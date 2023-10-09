import json
import subprocess
import os
from utils.path_extractor import get_path_without_ext



def generate_imports_code(component_config, all_config):
    # print(component_config)
    imported_components = component_config['imports']['components'] 
    import_statements = []

    # Handle import for components
    for ic in imported_components:
        related_comp = all_config[ic]
        comp_path = get_path_without_ext(related_comp['containingFile'])

        import_statement = f'import {related_comp["name"]} from \'{comp_path}\';'
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

    return '\n'.join(import_statements)

def gen_single_import(import_name, file_path):
        comp_path = get_path_without_ext(file_path)

        import_statement = f'import {import_name} from \'{comp_path}\';'
        return import_statement

from utils.file_utils import create_dir_if_not_exists, get_dir_path_from_file
from utils.app_consts import NEW_LINE_CHAR
from utils.formatter import format_val


class ComponentGenerator():
    app_config = None
    components_dir = None

    def __init__(self, app_config, all_comp_config):
        self.app_config = app_config
        self.all_comp_config = all_comp_config
        self.components_dir = f"{app_config['path']}/{app_config['name']}/{app_config['components_src_dir']}"

    def write_all_components(self):
        configs =  list(self.all_comp_config.values())

        for component_config in configs:
            self.write_component(component_config)

    def write_component(self, comp_config):
        react_component_code = self.generate_react_component_code(comp_config)
        # print(react_component_code)

        # Get the output file name from the JSON configuration
        output_file = f"{self.components_dir}/{comp_config['containingFile']}"

        formatted_code = subprocess.check_output(['npx', 'prettier', '--parser', 'babel'], input=react_component_code, text=True)

        # Create parent dir if not exists
        create_dir_if_not_exists(output_file)

        # print("output file", output_file)
        # Write the component code to the specified output file
        with open(output_file, 'w') as file:
            file.write(formatted_code)


        # print(f"React component code has been written to '{react_component_code}'")

    def generate_react_component_code(self, config):
        # component_uuid = config['component_uuid']
        all_config = self.all_comp_config
        name = config['name']
        state_vars = config['stateVars']
        props_vars = config['propsVars']
        html = config['html']
        functions = config['functions']

        # state_vars = []

        # for var in state_vars:
        #     var_val_default_ = var

        print(state_vars)

        state_vars_declaration = '\n'.join([f'const [{var["name"]}, set{var["name"][0].title()+var["name"][1:]}] = useState({format_val(var["defaultValue"])});' for var in state_vars])
        props_vars_declaration = '\n'.join([f'const {var["name"]} = props.{var["name"]};' for var in props_vars])
        # functions_code = '\n\n'.join()
        import_stats = generate_imports_code(config, all_config)

        print(state_vars_declaration)
        functions_definition = '\n\n'.join([f'def {func["name"]}(event):' for func in functions])
        functions_body = '\n'.join([f'    {func["body"]}' for func in functions])

        functions_code = []

        for func_conf in config['functions']:
            if func_conf['isAnonymous'] is not True:
                functions_code.append(FunctionCodeGenerator.generate_function(func_conf, config))

        
        hooks = []
        for hook_conf in config['hooks']:
            hooks.append(HookCodeHelper.generate_hook_code(hook_conf, config))


        react_component = f'''
            import React, {{ useState }} from 'react';
            {import_stats}

            const {name} = (props) => {{
                {state_vars_declaration}
                {props_vars_declaration}
                
                {NEW_LINE_CHAR.join(hooks)}

                {NEW_LINE_CHAR.join(functions_code)}
                return (
                    <div>{html}</div>
                );
            }};

            export default {name};
        '''

        return react_component


class FunctionCodeGenerator:
    @staticmethod
    def generate_function(function_def, comp_config):
        
        func_name = ""
        if function_def['isAnonymous'] is False:
            func_name = f"const {function_def['name']} = "

        
        # print(function_def)
        function_code = f"""

            {func_name} {"" if function_def['isAsync'] is not True else "async"} ( {", ".join([p['name'] for p in  function_def['parameters']])}) => {{
                
                {function_def['body']}

            }}

        """

        return function_code

    

class HookCodeHelper:


    @staticmethod
    def generate_hook_code(hook_conf, comp_conf):
        if hook_conf['type'] == 'USE_EFFECT':
            return HookCodeHelper.handle_use_effect(hook_conf, comp_conf)

    @staticmethod
    def handle_use_effect(hook_config, comp_config):

        related_func_config = next(item for item in comp_config['functions'] if item["$id"] == hook_config['implementation']['$ref'])
        dependent_vars = []

        for dep_var in hook_config['dependantVars']:
            related_var =  next(item for item in comp_config['stateVars'] if item["$id"] == dep_var)
            dependent_vars.append(related_var['name'])

        hook_code = f"""

            useEffect({FunctionCodeGenerator.generate_function(related_func_config, comp_config)} 
            
            , [{", ".join(dependent_vars)}])

        """

        return hook_code



# def write_components():

#     all_comp_config = read_all_component_config()
#     app_config = read_app_config()
#     comps = list(all_comp_config.values())

#     generate_components(comps, app_config)