import execjs
import json
import pathlib
from temp_react_code import javascript_code1
from js4_parser import get_ast
import traceback 

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
        return "No Props defined"
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


COMP_DIR = "/home/raj/Desktop/bridge/npm_libraries/react_bootstrap/react-bootstrap/src"

JS_FILE_PATH = '/home/raj/Desktop/bridge/processor/ast_parser/index.js'
JS_FUNCTION_NAME = 'get_ast'

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



def fetch_props_from_comps():
    comp_files = read_all_comp_files_path(COMP_DIR, "tsx") 
    comp_files.sort()
    output = ""
    comp_files = ["/home/raj/Desktop/bridge/processor/bridge_ui_server/testing_ts.tsx"]
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
            get_exports_of_file(ast)
            props = generate_ast_to_comp_config(ast)
            output = output + f"{props}\n"
        except Exception as e:
            traceback.print_exc()
            output = output + f"Error : {e}\n"

        output = output + f"----------------------\n"

        print("---------------------")

        log_file = open("/home/raj/Desktop/bridge/processor/bridge_ui_server/generated_props.log", "w")
        log_file.write(output)
        log_file.close()

fetch_props_from_comps()

