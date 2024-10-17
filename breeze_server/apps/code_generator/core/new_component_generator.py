from apps.directory_management.core.directory_management_service import DirectoryManager
from apps.common.utils.formatter import format_raw_val
from apps.common.constants.consts import CONFIG_PATH
from ..utils.html_generator import HTMLGenerator
from ..utils.function_ast_parser import FunctionParser
from ..utils.import_helper import ImportHelper
from ..utils.code_indexing import get_code_index
from ...common.utils.file_helpers.file_handler import create_parent_dir_if_not_exists
import pickle

# component generator file for the new backend

def write_component(app_config, comp_config, comp_config_index):

    #generate react component code
    react_component_code, code_tree = generate_react_component_code(app_config, comp_config, comp_config_index)
    
    file_id = comp_config.get("file_id")
    
    directory_management_service = DirectoryManager(app_config["name"])
    directory_management_service.save_file(file_id,react_component_code)
    
    content = directory_management_service.get_file_content(file_id)
    
    code_tree = get_code_index(code_tree, content)
    
    print(f"React component code has been written to '{react_component_code}'")
    
    app_config_dir = f"{CONFIG_PATH}/{app_config['name']}"
    
    pickle_dir = f"{app_config_dir}/pickles/{comp_config['id']}.bytes"
    create_parent_dir_if_not_exists(pickle_dir)
    with open(pickle_dir,"wb") as file:
        pickle.dump(code_tree, file)
    

def generate_react_component_code(app_config, config, comp_config_index):
    # component_uuid = config['component_uuid']
    # all_store_config = all_store_config
    # all_reducer_config = all_reducer_config
    
    all_store_config = {}
    all_reducer_config = {}

    name = config['name']
    props_vars = config['propsVars']
    resources = config['resources']
    html_config = config['html']
    generator = HTMLGenerator(config)
    html_code,html_code_tree = generator.generateHTML(html_config)

        # print(html_code)

    wrapper_store = config.get("wrapper_store",None)
    if not wrapper_store :
        html_code_tree = {
            "type" : "HTML_WRAP",
            # "statementType" : "NA",
            "code" : f"<Fragment> {html_code} </Fragment>",
            "children" :[
                html_code_tree
                ],
        }
        html_code = "<Fragment>%s</Fragment>"%(html_code)
    else:
        if "store" in config["imports"]:
            config["imports"]["store"].append(wrapper_store)
        else:
            config["imports"]["store"] = [
                wrapper_store
            ]
        config["imports"]["other"].append(
            {
                "TYPE": "THIRD_PARTY",
                "from": "react-redux",
                "import_entity": "Provider",
                "import_type" : "SINGLE"
            })
        
        store = all_store_config[wrapper_store]
        html_code = "<Provider store={%s}>%s</Provider>"%(store["name"],html_code)
        
    def generate_state_var_code(var):
        return f'const [{var["name"]}, set{var["name"][0].upper()+var["name"][1:]}] = useState({format_raw_val(var["body"]["defaultValue"])});'

    def generate_ref_var_code(var):
        return f'const {var["name"]} = React.useRef({format_raw_val(var["body"]["defaultValue"])});'
    
    def generate_other_var_code(var):
        datatype = var["body"].get("datatype")
        default_value = var["body"].get("defaultValue", "")
        declaration_type = var["body"].get("declarationType", "const")
        
        if datatype == "STRING":
            formatted_value = f'"{default_value}"'
        elif datatype == "BOOLEAN":
            formatted_value = str(default_value).lower()
        else:
            formatted_value = f'{default_value}'
        
        if declaration_type == 'const' or default_value:
            return f'{declaration_type} {var.get("name")} = {formatted_value};'
        else:
            return f'{declaration_type} {var.get("name")};'
                
    props_vars_declaration = ', '.join([f'{var["name"]}={var["body"]["defaultValue"]}' if var["body"].get("defaultValue") else var["name"] for var in props_vars])
    if props_vars_declaration != "":
        props_vars_declaration = "{" + props_vars_declaration +"}"
    import_stats,import_statement_tree = ImportHelper.generate_imports_code(config, comp_config_index, all_store_config,all_reducer_config, app_config)
    
    def generate_function_code(func):
        all_resources = []
        all_resources.extend(resources)
        all_resources.extend(props_vars)
        function_generator = FunctionParser(all_resources)
        function_code = function_generator.generate_statement_code(func)
        return function_code     
        
    def generate_lifecycle_code(lifecycle):
        lifecycle_type = lifecycle['body']['lifecycleType']
        lifecycle_body = lifecycle['body'].get('lifecycleBody', '')
        lifecycle_body_code = generate_function_code(lifecycle_body)
        dependent_vars = lifecycle['body'].get('dependentVars', [])
        dependencies = ', '.join(dependent_vars) if dependent_vars else ''
        
        if lifecycle_type == 'onEveryMount':
            return f"""
                React.useEffect({lifecycle_body_code});
            """
        elif lifecycle_type == 'onInitialMount':
            return f"""
                React.useEffect({lifecycle_body_code}, []);
                """
        elif lifecycle_type == 'onComponentMount':
            return f"""
                React.useEffect({lifecycle_body_code}, [{dependencies}]);
                """
        else:
            raise ValueError(f"Unknown lifecycle type: {lifecycle_type}")
    
    def generate_hook_code(hook):
        hook_name = hook['name']
        hook_type = hook['body']['type']
        hook_body = hook['body']['hookBody']
        hook_body_code = generate_function_code(hook_body)
        dependent_vars = hook['body'].get('dependentVars', [])
        dependencies = ', '.join(dependent_vars) if dependent_vars else ''

        hook_code = f"""
            const {hook_name} = React.{hook_type}({hook_body_code}, [{dependencies}]);
        """

        return hook_code

    def generate_resources_code(resources):
        resources_code = []
        resource_code_tree=[]
        for resource in resources:
            if resource['type'] == 'stateVars':
                code = generate_state_var_code(resource)
            elif resource['type'] == 'refVars':
                code = generate_ref_var_code(resource)
            elif resource['type'] == 'otherVars':
                code = generate_other_var_code(resource)
            elif resource['type'] == 'function':
                code = generate_function_code(resource)
            elif resource['type'] == 'lifecycle':
                code = generate_lifecycle_code(resource)
            elif resource['type'] == 'hook':
                code =generate_hook_code(resource)
            # Add more resource types if needed
            resources_code.append(code)
            resource_code_tree.append({
                "type": resource['type'],
                "statementType" : "SINGLE",
                "code" : code,
                "id": resource['id']
            })
        return '\n'.join(resources_code),resource_code_tree
    
    resources_code,resource_code_tree = generate_resources_code(resources)
    
    code_tree=[]
    
    code_tree.append({
        "type" : "ALL_IMPORTS",
        # "statementType" : "NA",
        "children" :import_statement_tree,
        "code": "import React, { useState, Fragment } from 'react';" + "".join([x["code"] for x in import_statement_tree])
    })
    
    all_resources = {
        "type" : "ALL_RESOURCES",
        # "statementType" : "NA",
        "children" : resource_code_tree,
        "code":"".join([x["code"] for x in resource_code_tree])
    }
    
    html_tree={
        "type" : "RETURN_HTML_TREE",
        # "statementType" : "NA",
        "code": f"return ( { html_code_tree['code'] } )", 
        "children" : [html_code_tree],
        
    }
    
    code_tree.append({
        "type" : "REACT_COMPONENT",
        # "statementType" : "NA",
        "code" : f"const {name} = ( {props_vars_declaration} ) => {{ {all_resources['code']} {html_tree['code']} }}",
        "children" :[
            all_resources,
            html_tree
            ],

    })
    code_tree.append({
        "type" : "EXPORT",
        # "statementType" : "NA",
        "code" : f"export default {name};"
        
    })
    react_component = f"""
        import React, {{ useState, Fragment }} from 'react';
        {import_stats}

        const {name} = ( {props_vars_declaration} ) => {{
            {resources_code}
            return (
                {html_code}
            );
        }}

        export default {name};
        """

    return react_component, code_tree

def write_app_component():
    pass