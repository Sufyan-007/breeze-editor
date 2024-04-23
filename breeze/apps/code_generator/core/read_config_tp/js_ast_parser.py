import json
import pathlib
import traceback 
import subprocess

from common.utils.app_consts import THIRD_PARTY_CONFIG_PATH, THIRD_PARTY_DIR, JS_FILE_PATH, JS_FUNCTION_NAME
from common.utils.file_utils import get_filename_without_ext
from common.utils.file_helper import write_file, create_dir_if_not_exists

# Go to root of the django project breezeui/breeze
# Run  python3 -m apps.code_generator.core.read_config_tp.js_ast_parser

# Generate ast from the given script path
def get_ast(script_path, function_name, *args):
    command = ["node", script_path, function_name,  *args]
    result = subprocess.run(command, capture_output=True, text=True)
    
    # #print(result.stdout)

    if result.returncode == 0:
        return result.stdout
        # pass
        # #print("JavaScript function executed successfully.")
        # #print("Output:", result.stdout)
    else:
        #print("Error executing JavaScript function.")
        #print("Error:", result.stderr)
        pass


# Find config of given variable
# It search through all variables of ast and find by name of the variable
def find_config_by_var_name(var_name, ast_config):
    var_config = None
    for conf in ast_config['body']:
        if conf['type'] == 'FunctionDeclaration' and conf['id']['name'] == var_name:
            var_config = conf
            break
        elif conf['type'] == 'VariableDeclaration' and conf['declarations'][0]['id'].get('name') == var_name:
            var_config = conf['declarations'][0]
            break

    return var_config


# Read propTypes variable from the file and process it to our format
def get_props(ast_config):
    prop_var_name = get_props_var_name()
    program_body = ast_config['body']

    prop_var_config = None

    props = []

    for conf in program_body:
        if conf['type'] == 'VariableDeclaration' and conf['declarations'][0]['id']['name'] == prop_var_name:
            prop_var_config = conf['declarations'][0]
            break

    if prop_var_config is None:
        return []
    
    for prop_conf in prop_var_config['init']['properties']:
        app_prop_conf = get_prop_config(prop_conf)
        props.append(app_prop_conf)


    return props

# Check if it is direct function call like const a = getValue()
# Here getValue is called directly it is not like User.getValue()
def is_direct_fun_call(config):
    return bool(config['value']['callee'].get('object') is None)

# Get name of the function from the config of the function
def get_call_exp_fun_name(config):
    if is_direct_fun_call(config):  
        return config['value']['callee']['name']

    return config['value']['callee']['property']['name']

# Process and convert the particular prop to the system format
def get_prop_config(prop_config):
    prop = {}
    
    if prop_config['value']['type'] == 'MemberExpression':
        prop_type = prop_config['value']['property']['name']
        prop['name'] = get_prop_key_name(prop_config)
        prop['type'] = prop_type
    elif prop_config['value']['type'] == 'Identifier':
        prop_type = prop_config['value']['name']
        prop['name'] = get_prop_key_name(prop_config)
        prop['type'] = prop_type

    elif prop_config['value']['type'] == 'CallExpression':
        prop_type = get_call_exp_fun_name(prop_config)
        prop['name'] = get_prop_key_name(prop_config)
        prop['type'] = prop_type
    
    else:
        raise Exception('Unknown Type Of Props')
    

    return prop


# Get key of the prop
def get_prop_key_name(prop_conf):
    if prop_conf['key']['type'] == "Literal":
        return prop_conf['key']['value']
    
    return prop_conf['key']['name']

# Get the name of the variable which holds the props config for the component
def get_props_var_name():
    return "propTypes"

# Read all the files from the given path by file type
def read_all_comp_files_path(dir_path, file_type):
    all_comp_path = pathlib.Path(dir_path)

        
    all_comp_path = list(all_comp_path.rglob(f"*.{file_type}"))

    return all_comp_path

# Checks if the given variable(variable_name) is component or not by checking
# if it has the propTypes value set
def is_component_by_prop_type(variable_name, ast_config):

    for conf in ast_config['body']:
        if conf['type'] == 'ExpressionStatement':
            expression_conf = conf['expression']
            # Check if the line contains something like A = B
            if expression_conf['type'] == 'AssignmentExpression' and expression_conf['operator'] == '=':
                # Check if the statement is variable.propTypes = propTypes
                if (
                        expression_conf['left']['type'] == 'MemberExpression' 
                        and expression_conf['left']['object']['name'] == variable_name 
                        and expression_conf['left']['property']['name'] == 'propTypes'
                    ) :
                    # and (
                    #     expression_conf['right'].get('name') == 'propTypes' 
                    #     or (
                    #         expression_conf['right']['type'] == 'AsExpression' and
                    #         expression_conf['right']['expression']['name'] == 'propTypes'
                    #     )     
                    # ):

                    # Return true and get out of the function
                    return True
                    

    return False

# check if given conf is config of the component or not
def is_component(conf):
    return_conf = None

    if conf['type'] == 'FunctionDeclaration':
        return_conf = find_return_statement(conf)

    elif(conf['init']['type']) == 'AsExpression':
        if (conf['init']['expression']['arguments'][0]['type'] == 'ArrowFunctionExpression'):
            return_conf = find_return_statement(conf['init']['expression']['arguments'][0])

    elif(conf['init']['type'] == 'CallExpression'):
        if (conf['init']['arguments'][0]['type'] == 'ArrowFunctionExpression'):
            return_conf = find_return_statement(conf['init']['arguments'][0])

    elif(conf['init']['type'] == 'ArrowFunctionExpression'):
        return_conf = find_return_statement(conf['init'])

    if return_conf is not None:
        return is_return_jsx(return_conf)
        
    return False

# Find return statement from the function config
def find_return_statement(func_conf):

    if func_conf['body'].get('body', None) is None:
        return func_conf['body']
    for conf in func_conf['body']['body']:
        if conf['type'] == 'ReturnStatement':
            return conf
        
    return None

# Check if the return statement config has the return of jsx
def is_return_jsx(return_conf):

    if return_conf.get('type', None) in ['JSXElement','JSXFragment']:
        return True
    
    return return_conf['argument']['type'] in ['JSXElement', 'JSXFragment']


# Check if the config of Object.assign()
def is_object_assign(config):
    try:
        if config['declaration']['callee']['object']['name'] == 'Object' and \
            config['declaration']['callee']['property']['name'] == 'assign' :
            return True
    except Exception as e:
        print('Error while checking if is object assign')

    return False

# Check if the file 
def find_var_name(exp):

    if exp['declaration'].get('type') == 'CallExpression':
        if exp['declaration']['callee']['type'] == 'MemberExpression':
            if is_object_assign(exp):
                return exp['declaration']['arguments'][0]['name']

    return exp['declaration']['name']
    
# Filter exports of the file and convert to system format
def get_exports_of_file(ast_config, src_lib = ""):
    program_body = ast_config['body']
    exports_config = []
    for conf in program_body:
        if conf['type'] in ['ExportDefaultDeclaration', 'ExportNamedDeclaration']:
            exports_config.append(conf)

    

    
    export_vars = []
    for exp in exports_config:
        if exp['type'] == 'ExportDefaultDeclaration':
            # #print(exp)
            is_component_type = None
            var_name = find_var_name(exp)
            try:
                var_config = find_config_by_var_name(var_name, ast_config)
                is_component_type = is_component(var_config)
                is_comp_type_by_prop = True
                is_comp_type_by_prop = is_component_by_prop_type(var_name, ast_config)
                # print(is_comp_type_by_prop, 'BY_PROP_TYPE')
                if is_comp_type_by_prop is not True and is_component_type is not True:
                    print('**********',exp ,'-------------')
                
            except Exception as e:
                print('Error while trying for isComponent', exp)
            export_vars.append({ "name" : var_name, "type" : exp['type'], "src" : src_lib, "is_component" : bool(is_component_type or is_comp_type_by_prop) })
        elif exp['type'] == 'ExportNamedDeclaration':
            if exp['declaration'] is None:
                
                pass 
            else:
                if exp['declaration']['type'] == 'VariableDeclaration':
                    export_vars.append({ "name" : exp['declaration']['declarations'][0]['id']['name'], "type" : exp['declaration']['type'], "src" : src_lib })
                elif exp['declaration']['type'] in ['InterfaceDeclaration', 'ClassDeclaration']:
                    export_vars.append({ "name" : exp['declaration']['id']['name'], "type" : exp['declaration']['type'], "src" : src_lib})
    
    #print("------------EXPORT_VARS-----------")
    #print(export_vars)
    #print("---------------------------------")
    return export_vars


    pass

# Save config of the component
def save_comp_config(props,  comp_config):
    lib_name = "react-bootstrap"
    initial_config = {
        "type": "COMPONENT",
        "name": comp_config['name'],
        "$id": comp_config['id'],
        "version": "V_0",
        "containingFile": comp_config['path'],
        "stateVars": [
        ],
        "propsVars": comp_config['propsVars'],
        "otherVars": [],
        "functions": [],
        "html": {},
        "wrapper_store": None,
        "imports": {
            "components": [],
            "other": []
        },
        "hooks": [],
        "exports" : comp_config['exports']
    }

    file_name = f"component_{comp_config['id']}.json"

    #print(props, comp_config)
    
    create_dir_if_not_exists(f"{THIRD_PARTY_CONFIG_PATH}/{lib_name}")
    write_file(f"{THIRD_PARTY_CONFIG_PATH}/{lib_name}/{file_name}",  json.dumps(initial_config))

    
# Handles config generation for third party components
# TODO : Divide this function into smaller utility functions
# It reads component from particular path and generate config for those component 
def handle_config_generation():

    # 1. Read paths of all the component in the directory
    comp_files = read_all_comp_files_path(THIRD_PARTY_DIR, "tsx") 
    comp_files.sort()

    output = ""
    lib_name = "react-bootstrap"
    # comp_files = ["/home/raj/Desktop/bridge/processor/bridge_ui_server/testing_ts.tsx"]
    # comp_files = comp_files[0:10]

    # Create directory for storing the config if it doesnt exists
    create_dir_if_not_exists(THIRD_PARTY_CONFIG_PATH)

    # Loop through all the components
    for fl in comp_files:

        # Read file contents
        f = open(fl, "r")
        file_content = f.read()
        # file_content = file_content.replace("`", "'")
        output = output + f"GENERATING FOR {fl}\n"

        try:
            # Generate AST for the file
            ast = get_ast(JS_FILE_PATH, JS_FUNCTION_NAME, file_content)
            # #print(ast)
            # #print(type(json.loads(ast)))
            ast = json.loads(ast)
            # #print(ast)

            # Get exported variables from the file
            export_vars = get_exports_of_file(ast)

            # Get props from the file
            props = get_props(ast)

            # Preapre config in the proper format
            comp_config = {
                "name" : get_filename_without_ext(fl),
                "id" : f"{get_filename_without_ext(fl)}",
                "path" : str(fl),
                "propsVars" : props,
                "exports" : export_vars
            }

            # Save the config
            save_comp_config(props, comp_config)
            output = output + f"{props}\n"
        except Exception as e:
            traceback.print_exc()
            output = output + f"Error : {e}\n"

        output = output + f"----------------------\n"

        # #print("---------------------")

        # log_file = open("/home/raj/Desktop/bridge/processor/bridge_ui_server/generated_props.log", "w")
        # log_file.write(output)
        # log_file.close()

# handle_config_generation()


