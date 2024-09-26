import json
import subprocess
import os
from apps.common.utils.path_extractor import get_path_without_ext
from ..utils.html_generator import HTMLGenerator
from ..utils.import_helper import ImportHelper
from ..utils.function_ast_parser import FunctionParser
from apps.directory_management.core.directory_management_service import DirectoryManager
from apps.common.utils.file_helpers.dir_handler import create_parent_dir_if_not_exists
from apps.common.utils.formatter import format_raw_val



def generate_imports_code(component_config, all_config,all_store_config,all_reducer_config):
    # print(component_config)
    imported_components = component_config['imports']['components']
    imported_store = component_config['imports'].get('store',[]) 
 
    import_statements = []

    # Handle import for components
    for ic in imported_components:
        related_comp = all_config[ic]
        comp_path = get_path_without_ext(related_comp['containingFile'])

        import_statement = f'import {related_comp["name"]} from \'{comp_path}\';'
        import_statements.append(import_statement)

    # Handle import for redux store
    for i in imported_store:
        related_store = all_store_config[i]
        store_path = get_path_without_ext(related_store['containingFile'])

        import_statement = f'import {related_store["name"]} from \'{store_path}\';'
        import_statements.append(import_statement)

    # Handle other imports
    for imp in component_config['imports']['other']:
        if imp['TYPE'] == "THIRD_PARTY":
            if imp['import_type'] == 'FULL':
                import_statement = f'import {imp["import_entity"]} from \'{imp["from"]}\' ;'
            # elif imp['import_type'] == 'SINGLE':
            else:
                import_statement = f'import  {{{imp["import_entity"]}}} from \'{imp["from"]}\' ;'
            
            import_statements.append(import_statement)
        
        elif imp['TYPE'] == "REDUCER_FUNCTION":
            related_reducer = all_reducer_config.get(imp["from"])
            path = get_path_without_ext(related_reducer['containingFile'])

            if imp['import_entity'] == 'SELECTOR':
                import_statement = "import  {select%s} from '%s';"%(related_reducer["stateVarName"],path)
            else:
                import_statement = f'import  {{{imp["import_entity"]}}} from \'{path}\' ;'
            
            import_statements.append(import_statement)

    return '\n'.join(import_statements)

def gen_single_import(import_name, file_path):
        comp_path = get_path_without_ext(file_path)

        import_statement = f'import {import_name} from \'{comp_path}\';'
        return import_statement




class ComponentGenerator():
    
    def __new__(cls, app_config, all_comp_config,all_context_comp_config={},all_store_config={},all_reducer_config={}):
        if cls is ComponentGenerator:
            if app_config.get('language') =="typescript":
                return ComponentGenerator_TSX(app_config, all_comp_config,all_context_comp_config,all_store_config,all_reducer_config)
            else:
                return ComponentGenerator_JSX(app_config, all_comp_config,all_context_comp_config,all_store_config,all_reducer_config)
        return super().__new__(cls)
    
    def __init__(self, app_config, all_comp_config,all_context_comp_config={},all_store_config={},all_reducer_config={}):
        if not hasattr(self, '_initialized'):
            self._initialized = True
            super().__init__(app_config, all_comp_config,all_context_comp_config,all_store_config,all_reducer_config)

    def write_all_components(self):
        raise NotImplementedError()
    
    def write_all_contexts(self):
        raise NotImplementedError()
    
    def write_component(self, comp_config):
        raise NotImplementedError()

    def generate_react_component_code(self, config):
        raise NotImplementedError()



from .component_generator_tsx import ComponentGenerator_TSX

class ComponentGenerator_JSX(ComponentGenerator):

    def __init__(self, app_config, all_comp_config,all_context_comp_config={},all_store_config={},all_reducer_config={}):
        if not hasattr(self, '_initialized'):
            self._initialized = True
            self.app_config = app_config
            self.all_comp_config = all_comp_config
            self.all_store_config = all_store_config
            self.all_context_comp_config = all_context_comp_config
            self.src_dir = f"{app_config['path']}/{app_config['components_src_dir']}"
            self.app_config['APP_SOURCE_DIR'] = self.src_dir 
            self.all_reducer_config = all_reducer_config
            # self.mapping_config = mapping_config
            self.components_dir = f"{app_config['path']}/{app_config['components_src_dir']}"

    def write_all_components(self):
        configs =  list(self.all_comp_config.values())

        for component_config in configs:
            self.write_component(component_config)
    
    def write_all_contexts(self):
        configs =  list(self.all_context_comp_config.values())

        for component_config in configs:
            self.write_component(component_config)
    
    def write_component(self, comp_config):
    
        #generate react component code
        react_component_code = self.generate_react_component_code(comp_config)
        
        file_id = comp_config.get("file_id")
        
        directory_management_service = DirectoryManager(self.app_config["name"])
        directory_management_service.save_file(file_id,react_component_code)
        # # file_path = directory_management_service.get_path_from_file_id(file_id)
        # # Get the output file name from the JSON configuration
        # output_file = f"{self.src_dir}/{comp_config['containingFile']}"
        # output_file = f"{file_path}"
        # # print("REACTCOMPONENT")
        # # print(react_component_code)
        # formatted_code = subprocess.check_output(" ".join(['npx', 'prettier', '--parser', 'babel']), shell=True, input=react_component_code, text=True)
        # # formatted_code = react_component_code
        # # Create parent dir if not exists
        # create_parent_dir_if_not_exists(output_file)
        # # print("output file", output_file)
        # # Write the component code to the specified output file
        # with open(output_file, 'w') as file:
        #     file.write(formatted_code)
        print(f"React component code has been written to '{react_component_code}'")

    def generate_react_component_code(self, config):
        # component_uuid = config['component_uuid']
        all_config = self.all_comp_config
        all_store_config = self.all_store_config
        all_reducer_config = self.all_reducer_config

        name = config['name']
        props_vars = config['propsVars']
        resources = config['resources']
        html_config = config['html']
        generator = HTMLGenerator(config)
        html_code = generator.generateHTML(html_config)

        # print(html_code)

        wrapper_store = config.get("wrapper_store",None)
        if not wrapper_store :
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
        import_stats = ImportHelper.generate_imports_code(config, all_config,all_store_config,all_reducer_config, self.app_config)
        
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
            for resource in resources:
                if resource['type'] == 'stateVars':
                    resources_code.append(generate_state_var_code(resource))
                elif resource['type'] == 'refVars':
                    resources_code.append(generate_ref_var_code(resource))
                elif resource['type'] == 'otherVars':
                    resources_code.append(generate_other_var_code(resource))
                elif resource['type'] == 'function':
                    resources_code.append(generate_function_code(resource))
                elif resource['type'] == 'lifecycle':
                    resources_code.append(generate_lifecycle_code(resource))
                elif resource['type'] == 'hook':
                    resources_code.append(generate_hook_code(resource))
                # Add more resource types if needed

            return '\n'.join(resources_code)
        
        resources_code = generate_resources_code(resources)
        
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

        return react_component
