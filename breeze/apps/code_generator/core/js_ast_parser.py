import execjs
import json
import pathlib
import traceback 
import subprocess
import os
import inspect
import sys

# from core.generate_project import AppGenerator
from common.utils.app_consts import THIRD_PARTY_CONFIG_PATH, THIRD_PARTY_DIR, JS_FILE_PATH, JS_FUNCTION_NAME
from common.utils.file_utils import get_filename_without_ext
from common.utils.file_helper import write_file, create_dir_if_not_exists

# Go to root of the django project breezeui/breeze
# Run  python3 -m apps.code_generator.core.js_ast_parser

def get_ast(script_path, function_name, *args):
    command = ["node", script_path, function_name,  *args]
    result = subprocess.run(command, capture_output=True, text=True)
    
    # print(result.stdout)

    if result.returncode == 0:
        return result.stdout
        # pass
        # print("JavaScript function executed successfully.")
        # print("Output:", result.stdout)
    else:
        print("Error executing JavaScript function.")
        print("Error:", result.stderr)

def generate_ast_js(code):
    js_code = f'''
    const parser = require('flow-parser');

    const ast = parser.parse(`{code}`, {{
    flow: {{ all: true }}
    }});
    JSON.stringify(ast, null, 2);
    '''

    # Create a Node.js context
    ctx = execjs.compile(js_code)

    # Run the JavaScript code and get the AST as a JSON string
    ast_json_str = ctx.eval('ast')

    print(type(ast_json_str))

    # Parse the JSON string to a Python object
    ast_json = json.loads(json.dumps(ast_json_str))

    return ast_json

def generate_ast_to_comp_config(ast_config):
    # print(ast_config)
    prop_var_name = find_props(ast_config)
    program_body = ast_config['body']

    prop_var_config = None

    props = []

    for conf in program_body:
        if conf['type'] == 'VariableDeclaration' and conf['declarations'][0]['id']['name'] == prop_var_name:
            prop_var_config = conf['declarations'][0]

    if prop_var_config is None:
        print("No Props defined")
        return []
    # print(prop_var_config)
    for prop_conf in prop_var_config['init']['properties']:
        app_prop_conf = get_prop_config(prop_conf)
        props.append(app_prop_conf)

    print(props)

    return props

    # print(prop_var_name)
    # pass

def get_prop_config(prop_config):
    prop = {}
    # print(prop_config)
    
    if prop_config['value']['type'] == 'MemberExpression':
        prop_type = prop_config['value']['property']['name']
        prop['name'] = get_prop_key_name(prop_config)
        prop['type'] = prop_type
    elif prop_config['value']['type'] == 'Identifier':
        prop_type = prop_config['value']['name']
        prop['name'] = get_prop_key_name(prop_config)
        prop['type'] = prop_type

    elif prop_config['value']['type'] == 'CallExpression':
        # print(prop_config)
        prop_type = prop_config['value']['callee']['property']['name']
        prop['name'] = get_prop_key_name(prop_config)
        prop['type'] = prop_type
    
    else:
        # print(prop_config['value']['type'])
        raise Exception('Unknown Type Of Props')
    

    return prop


def get_prop_key_name(prop_conf):
    # print(prop_conf['key'])
    if prop_conf['key']['type'] == "Literal":
        return prop_conf['key']['value']
    
    return prop_conf['key']['name']

def find_props(ast_config):
    return "propTypes"

# generate_ast_to_comp_config(ast)


def read_all_comp_files_path(dir_path, file_type):
    all_comp_path = pathlib.Path(dir_path)

        
    all_comp_path = list(all_comp_path.rglob(f"*.{file_type}"))

    return all_comp_path


def get_exports_of_file(ast_config):
    program_body = ast_config['body']
    exports_config = []
    for conf in program_body:
        if conf['type'] in ['ExportDefaultDeclaration', 'ExportNamedDeclaration']:
            exports_config.append(conf)

    

    
    export_vars = []
    for exp in exports_config:
        if exp['type'] == 'ExportDefaultDeclaration':
            # print(exp)
            export_vars.append({ "name" : exp['declaration']['name'], "type" : exp['type']})
        elif exp['type'] == 'ExportNamedDeclaration':
            pass
            # if exp['declaration']['type'] == 'VariableDeclaration':
            #     export_vars.append({ "name" : exp['declaration']['declarations'][0]['id']['name'], "type" : exp['declaration']['type'] })
            # elif exp['declaration']['type'] in ['InterfaceDeclaration', 'ClassDeclaration']:
            #     export_vars.append({ "name" : exp['declaration']['id']['name'], "type" : exp['declaration']['type']})
    
    print("------------EXPORT_VARS-----------")
    print(export_vars)
    print("---------------------------------")
    return export_vars


    pass


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

    print(props, comp_config)
    
    create_dir_if_not_exists(f"{THIRD_PARTY_CONFIG_PATH}/{lib_name}")
    write_file(f"{THIRD_PARTY_CONFIG_PATH}/{lib_name}/{file_name}",  json.dumps(initial_config))

    

def fetch_props_from_comps():
    comp_files = read_all_comp_files_path(THIRD_PARTY_DIR, "tsx") 
    comp_files.sort()
    output = ""
    lib_name = "react-bootstrap"
    # comp_files = ["/home/raj/Desktop/bridge/processor/bridge_ui_server/testing_ts.tsx"]
    # comp_files = comp_files[0:10]
    create_dir_if_not_exists(THIRD_PARTY_CONFIG_PATH)
    for fl in comp_files:
        f = open(fl, "r")
        file_content = f.read()
        # file_content = file_content.replace("`", "'")
        output = output + f"GENERATING FOR {fl}\n"
        print(f"GENERATING FOR {fl}")
        try:
            # ast = generate_ast_js(file_content)
            ast = get_ast(JS_FILE_PATH, JS_FUNCTION_NAME, file_content)
            # print(ast)
            # print(type(json.loads(ast)))
            ast = json.loads(ast)
            # print(ast)
            export_vars = get_exports_of_file(ast)


            props = generate_ast_to_comp_config(ast)


            comp_config = {
                "name" : get_filename_without_ext(fl),
                "id" : f"{lib_name}_{get_filename_without_ext(fl)}",
                "path" : str(fl),
                "propsVars" : props,
                "exports" : export_vars
            }

            save_comp_config(props, comp_config)
            output = output + f"{props}\n"
        except Exception as e:
            traceback.print_exc()
            output = output + f"Error : {e}\n"

        output = output + f"----------------------\n"

        # print("---------------------")

        # log_file = open("/home/raj/Desktop/bridge/processor/bridge_ui_server/generated_props.log", "w")
        # log_file.write(output)
        # log_file.close()

# fetch_props_from_comps()


