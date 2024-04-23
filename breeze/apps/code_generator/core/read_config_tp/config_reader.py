
import json
import traceback 
import os

from common.utils.app_consts import THIRD_PARTY_CONFIG_PATH, THIRD_PARTY_DIR, JS_FILE_PATH, JS_FUNCTION_NAME
from common.utils.file_utils import get_filename_without_ext
from common.utils.file_helper import write_file, create_dir_if_not_exists

from apps.code_generator.core.read_config_tp.js_ast_parser import get_ast, get_props_var_name, get_prop_config, save_comp_config, get_exports_of_file

# Run  python3 -m apps.code_generator.core.read_config_tp.config_reader


INDEX_PATH = f"{THIRD_PARTY_DIR}/index.tsx"

# filter exports from the ast configuration
def filter_exports_from_ast(ast_config):
    program_body = ast_config['body']
    exports_config = []
    for conf in program_body:
        if conf['type'] in ['ExportDefaultDeclaration', 'ExportNamedDeclaration']:
            exports_config.append(conf)

    return exports_config

# Process export variables and convert it to map format
# Ex : {  'path_of_file' : array of the exported variables from the file }
def process_export_vars(exports):

    export_configs = []
    export_map = {}
    for export in exports:
        if export['type'] == "ExportNamedDeclaration":
            if export['declaration'] is None and export['source'] is not None:
                exported_var_name = export['specifiers'][0]['exported']['name']
                source_full_path = get_absolute_source_path(INDEX_PATH, export['source']['value'])
                
                if export_map.get(source_full_path, None) is None:
                    export_map[source_full_path] = []

                export_map[source_full_path].append(
                    {
                        'export_var_name' : exported_var_name,
                        'source_full_path' : source_full_path
                    }
                )
                export_configs.append({
                    'export_var_name' : exported_var_name,
                    'source_full_path' : source_full_path
                })

    #print(export_map)

    return export_map

# Get absolute path of by merging two path
# ex 1> /home/desktop/breeze/src/index.tsx 2> ./comp.tsx
# result will be /home/desktop/src/comp.tsx
def get_absolute_source_path(current_file_path, source_relative_path):
    current_dir = os.path.dirname(current_file_path)
    final_path = os.path.normpath(os.path.join(current_dir, source_relative_path))
    return str(final_path)

# Try to get props from the ast
# This function checks for the declaration of propTypes variable from the file
# It gets the config of propTypes and then loop through all the properties of the variable
# If it doesnt find then it returns empty array
def get_props(ast_config, exported_vars=[]):
    

    prop_var_name = get_props_var_name()
    program_body = ast_config['body']

    prop_var_config = None

    props = []
    
    # Find propTypes variable config
    for conf in program_body:
        if conf['type'] == 'VariableDeclaration' and conf['declarations'][0]['id'].get('name') == prop_var_name:
            prop_var_config = conf['declarations'][0]

    if prop_var_config is None:
        return []
    
    # Loop through all the properties of the propTypes variable and convert to format of our app
    for prop_conf in prop_var_config['init']['properties']:
        app_prop_conf = get_prop_config(prop_conf)
        props.append(app_prop_conf)

    return props


def generate_components_config(exp_map, lib_name, lib_config={}):

    file_ext = lib_config.get('file_type', '.tsx')

    # For storing output logs of the process of generating config    
    output = ""

    # Loop through all the exported files
    for file_path in exp_map:
        try:
            # Read config of the file
            f = open(f"{file_path}{file_ext}", "r")
            file_content = f.read()

            output = output + f"GENERATING FOR {file_path}\n"

            # Generate ast of the file
            ast = get_ast(JS_FILE_PATH, JS_FUNCTION_NAME, file_content)
            ast = json.loads(ast)

            # Get exported vars of the file
            export_vars = get_exports_of_file(ast, lib_name)

            # Get props of the component inside file
            props = get_props(ast)

            # Prepare component config details
            comp_config = {
                "name" : get_filename_without_ext(file_path),
                "id" : f"{get_filename_without_ext(file_path)}",
                "path" : str(file_path),
                "propsVars" : props,
                "exports" : export_vars
            }

            # Save the component config
            save_comp_config(props, comp_config)

            output = output + f"{props}\n"
        except Exception as e:
            traceback.print_exc()
            print('EEEEEE', file_path)
            output = output + f"Error : {e}\n"

        output = output + f"----------------------\n"

 

def process_index_file():

    # TODO: Library name currently static need to do it vairable
    lib_name = "react-bootstrap"

    create_dir_if_not_exists(THIRD_PARTY_CONFIG_PATH)

    # Read index file from library
    f = open(INDEX_PATH, "r")
    file_content = f.read()

    try:
        # 1. Generate ast from the code
        ast = get_ast(JS_FILE_PATH, JS_FUNCTION_NAME, file_content)
        ast = json.loads(ast)

        # 2. Get exported variables from index file
        export_vars = filter_exports_from_ast(ast)

        # 3. Generate map of the exports so we can loop through file from which the component are exported
        # export_map = process_export_vars(export_vars)

        export_map = {
            '/home/raj/Desktop/bridge/npm_libraries/react_bootstrap/react-bootstrap/src/Anchor' : []
        }

        # 4. Generate component config for all the files from which comps are exported
        generate_components_config(export_map, lib_name)

    except Exception as e:
        traceback.print_exc()
        print("Error occurred in ")



# process_index_file()