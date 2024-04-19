import json
import subprocess
import os
from common.utils.path_extractor import get_path_without_ext
from .helpers.html_generator import HTMLGenerator
from .helpers.import_helper import ImportHelper
from .helpers.api_parameters_mapping import APIParametersMapping

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

from common.utils.file_utils import create_parent_dir_if_not_exists, get_dir_path_from_file
from common.utils.app_consts import NEW_LINE_CHAR
from common.utils.formatter import format_val,format_raw_val


class ComponentGenerator():
    app_config = None
    src_dir = None

    def __init__(self, app_config, all_comp_config,all_context_comp_config={},all_store_config={},all_reducer_config={}):
        self.app_config = app_config
        self.all_comp_config = all_comp_config
        self.all_store_config = all_store_config
        self.all_context_comp_config = all_context_comp_config
        self.src_dir = f"{app_config['path']}/{app_config['name']}/{app_config['components_src_dir']}"
        self.app_config['APP_SOURCE_DIR'] = self.src_dir 
        self.all_reducer_config = all_reducer_config
        # self.mapping_config = mapping_config
        self.components_dir = f"{app_config['path']}/{app_config['name']}/{app_config['components_src_dir']}"

    def write_all_components(self):
        configs =  list(self.all_comp_config.values())

        for component_config in configs:
            self.write_component(component_config)
    
    def write_all_contexts(self):
        configs =  list(self.all_context_comp_config.values())

        for component_config in configs:
            self.write_component(component_config)
    
    def write_component(self, comp_config):
        react_component_code = self.generate_react_component_code(comp_config)
        # print(react_component_code)

        # Get the output file name from the JSON configuration
        output_file = f"{self.src_dir}/{comp_config['containingFile']}"

        # print("REACTCOMPONENT")
        # print(react_component_code)

        formatted_code = subprocess.check_output(['npx', 'prettier', '--parser', 'babel'], input=react_component_code, text=True)

        # Create parent dir if not exists
        create_parent_dir_if_not_exists(output_file)

        # print("output file", output_file)
        # Write the component code to the specified output file
        with open(output_file, 'w') as file:
            file.write(formatted_code)


        # print(f"React component code has been written to '{react_component_code}'")

    def generate_react_component_code(self, config):
        # component_uuid = config['component_uuid']
        all_config = self.all_comp_config
        all_store_config = self.all_store_config
        all_reducer_config = self.all_reducer_config

        name = config['name']
        state_vars = config['stateVars']
        other_vars = config.get('otherVars',[])
        props_vars = config['propsVars']
        html_config = config['html']
        generator = HTMLGenerator(config)
        html_code = generator.generateHTML(html_config)

        print(html_code)
        functions = config['functions']

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
        
        state_vars_declaration = '\n'.join([f'const [{var["name"]}, set{var["name"][0].title()+var["name"][1:]}] = useState({format_raw_val(var["defaultValue"])});' for var in state_vars])
        props_vars_declaration = '\n'.join([f'const {var["name"]} = props.{var["name"]};' for var in props_vars])
        
        # other vars
        other_vars_declaration = ""
        for ovar in other_vars:
            parameters = ""
            if len(ovar.get("parameters",[]))> 0:
                parameters = ",".join(ovar["parameters"])
            other_vars_declaration = other_vars_declaration + " \n %s %s = %s(%s);"%(ovar["declarationType"],ovar.get("name"),ovar.get("className"),parameters)
        
        # functions_code = '\n\n'.join()


        import_stats = ImportHelper.generate_imports_code(config, all_config,all_store_config,all_reducer_config, self.app_config)
        # import_stats = generate_imports_code(config, all_config,all_store_config,all_reducer_config)

        # functions_definition = '\n\n'.join([f'def {func["name"]}(event):' for func in functions])
        # functions_body = '\n'.join([f'    {func["body"]}' for func in functions])

        functions_code = []
        api_parameters_mapping = APIParametersMapping(app_config=self.app_config)
        
        for func_conf in config['functions']:
            if func_conf.get("func_type") == "MAPPER_FUNC":
                func = api_parameters_mapping.generate_mapping_function(func_conf["name"],func_conf)
                functions_code.append(func)

            else:
                if func_conf['isAnonymous'] is not True:
                    functions_code.append(FunctionCodeGenerator.generate_function(func_conf, config))

        hooks = []
        for hook_conf in config['hooks']:
            hooks.append(HookCodeHelper.generate_hook_code(hook_conf, config))
        
        # api_parameters_mapping = APIParametersMapping(app_config=self.app_config)
        # for mapping in config.get("mapping_func",[]):
        #     api_mappings = self.mapping_config[mapping["id"]]["mapping_config"]
        #     func = api_parameters_mapping.generate_mapping_function(mapping["name"],api_mappings)
        #     print("===============================================")
        #     functions_code.append(func)


        react_component = """
            import React, { useState , Fragment } from 'react';
            %s
            
            const %s = (props) => {
                %s
                %s
                %s
                %s
                %s
                return (
                    %s
                );
            }

            export default %s;
        """%(import_stats,name,props_vars_declaration,state_vars_declaration,other_vars_declaration,NEW_LINE_CHAR.join(hooks),NEW_LINE_CHAR.join(functions_code),html_code,name)

        return react_component


from .helpers.function_code_generator import FunctionCodeGenerator
class HookCodeHelper:


    @staticmethod
    def generate_hook_code(hook_conf, comp_conf):
        if hook_conf['type'] in ['USE_EFFECT', 'USE_CALLBACK', 'USE_MEMO']:
            return HookCodeHelper.handle_generic_hook(hook_conf, comp_conf)

    @staticmethod
    def handle_generic_hook(hook_config, comp_config):
        related_func_config = next(item for item in comp_config['functions'] if item["$id"] == hook_config['implementation']['$ref'])
        dependent_vars = hook_config.get('dependantVars', [])
        hook_name = ""

        if hook_config['type'] == 'USE_EFFECT':
            hook_name = 'useEffect'
        elif hook_config['type'] == 'USE_CALLBACK':
            hook_name = 'useCallback'
        elif hook_config['type'] == 'USE_MEMO':
            hook_name = 'useMemo'
        else:
            raise ValueError("Unsupported hook type")

        function_code = FunctionCodeGenerator.generate_function(related_func_config, comp_config)

        if hook_config['type'] == 'USE_EFFECT':
            hook_code = f"""
            React.{hook_name}({function_code}, [{", ".join(dependent_vars)}]);
            """
        else:
            hook_code = f"""
            const {hook_config['name']} = React.{hook_name}({function_code}, [{", ".join(dependent_vars)}]);
            """

        return hook_code



# def write_components():

#     all_comp_config = read_all_component_config()
#     app_config = read_app_config()
#     comps = list(all_comp_config.values())

#     generate_components(comps, app_config)