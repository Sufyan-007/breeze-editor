import json
import subprocess
import os
from utils.path_extractor import get_path_without_ext

def generate_imports_code(component_config, all_config):
    print(component_config)
    imported_components = component_config['imports']['components'] 
    import_statements = []
    for ic in imported_components:
        related_comp = all_config[ic]
        comp_path = get_path_without_ext(related_comp['containingFile'])

        import_statement = f'import {related_comp["name"]} from \'{comp_path}\';'
        import_statements.append(import_statement)


    return '\n'.join(import_statements)

def gen_single_import(import_name, file_path):
        comp_path = get_path_without_ext(file_path)

        import_statement = f'import {import_name} from \'{comp_path}\';'
        return import_statement

# def generate_react_component(config):
#     # component_uuid = config['component_uuid']
#     all_config = read_all_component_config()
#     name = config['name']
#     state_vars = config['stateVars']
#     props_vars = config['propsVars']
#     html = config['html']
#     functions = config['functions']

#     state_vars_declaration = '\n'.join([f'const [{var["name"]}, set{var["name"].capitalize()}] = useState("{var["defaultValue"]}");' for var in state_vars])
#     props_vars_declaration = '\n'.join([f'const {var["name"]} = props.{var["name"]};' for var in props_vars])
#     # functions_code = '\n\n'.join()
#     import_stats = generate_imports_code(config, all_config)
    
#     functions_definition = '\n\n'.join([f'def {func["name"]}(event):' for func in functions])
#     functions_body = '\n'.join([f'    {func["body"]}' for func in functions])

    
#     react_component = f'''
#         import React, {{ useState }} from 'react';
#         {import_stats}

#         const {name} = (props) => {{
#             {state_vars_declaration}
#             {props_vars_declaration}
            

#             return (
#                 <div>{html}</div>
#             );
#         }};

#         export default {name};
#     '''
    
#     return react_component

# Sample component structure
# component_structure = {
#     "main" : {
#         "component" : "uuid1",
#         "childs" : [
#             {
#                 "component" : "uuid2",
#                 "childs" : ""
#             }
#         ]
#     }
# }


# def get_dir_path_from_file(file_path):
#     return os.path.dirname(file_path)

# def create_dir_if_not_exists(file_path):
#     dir_path = get_dir_path_from_file(file_path)
#     if not os.path.exists(dir_path):
#         os.makedirs(dir_path)

from utils.file_utils import create_dir_if_not_exists, get_dir_path_from_file

# def generate_components(configs, app_config):
#     print(configs)
#     COMPONENTS_PATH = f"{app_config['name']}/{app_config['components_src_dir']}"

#     for component_config in configs:
#         config = component_config
#         print
#         react_component_code = generate_react_component(config)
#         print(react_component_code)

#         # Get the output file name from the JSON configuration
#         output_file = f"{COMPONENTS_PATH}/{config['containingFile']}"

#         formatted_code = subprocess.check_output(['npx', 'prettier', '--parser', 'babel'], input=react_component_code, text=True)

#         # Create parent dir if not exists
#         create_dir_if_not_exists(output_file)

#         # Write the component code to the specified output file
#         with open(output_file, 'w') as file:
#             file.write(formatted_code)


#         print(f"React component code has been written to '{react_component_code}'")



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
        print(react_component_code)

        # Get the output file name from the JSON configuration
        output_file = f"{self.components_dir}/{comp_config['containingFile']}"

        formatted_code = subprocess.check_output(['npx', 'prettier', '--parser', 'babel'], input=react_component_code, text=True)

        # Create parent dir if not exists
        create_dir_if_not_exists(output_file)

        print("output file", output_file)
        # Write the component code to the specified output file
        with open(output_file, 'w') as file:
            file.write(formatted_code)


        print(f"React component code has been written to '{react_component_code}'")

    def generate_react_component_code(self, config):
        # component_uuid = config['component_uuid']
        all_config = self.all_comp_config
        name = config['name']
        state_vars = config['stateVars']
        props_vars = config['propsVars']
        html = config['html']
        functions = config['functions']

        state_vars_declaration = '\n'.join([f'const [{var["name"]}, set{var["name"].capitalize()}] = useState("{var["defaultValue"]}");' for var in state_vars])
        props_vars_declaration = '\n'.join([f'const {var["name"]} = props.{var["name"]};' for var in props_vars])
        # functions_code = '\n\n'.join()
        import_stats = generate_imports_code(config, all_config)

        functions_definition = '\n\n'.join([f'def {func["name"]}(event):' for func in functions])
        functions_body = '\n'.join([f'    {func["body"]}' for func in functions])


        react_component = f'''
            import React, {{ useState }} from 'react';
            {import_stats}

            const {name} = (props) => {{
                {state_vars_declaration}
                {props_vars_declaration}
                

                return (
                    <div>{html}</div>
                );
            }};

            export default {name};
        '''

        return react_component



# def write_components():

#     all_comp_config = read_all_component_config()
#     app_config = read_app_config()
#     comps = list(all_comp_config.values())

#     generate_components(comps, app_config)