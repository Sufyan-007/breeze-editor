from apps.common.constants.consts import CONFIG_PATH
import json,os
from apps.common.utils.react_request_code import REQUEST
from breeze_server.apps.common.constants.consts import CONFIG_FILES_PATH, JSX_DIRECTORY_CONFIG, TSX_DIRECTORY_CONFIG
from apps.common.utils.file_helpers.json_handler import read_json_file, write_json_file


def write_basic_config_files(app_config):
    app_config_dir = f"{CONFIG_PATH}/{app_config['name']}"
    basic_routing_config = {
        "routes":
            {
                "/" : {
                    "path": "/",
                    "component": f"{app_config['defaultComponent']}"
                }
            },
        "baseRoutes": {
            "/": {},
        }
    }
    usage_config = {
        "components": {
                f"{app_config['defaultComponent']}": {
                    "imports": {},
                    "props": {},
                    "variables": {},
                    "usedRoutes": {},
                    "functions": {},
                    "lifecycle": {},
                    "hooks": {},
                    "css": {},
                    "usage": {}
                }
            },
        "contexts": {},
        "reducers": {},
        "reduxStore": {},
        "routes": {},
        "imports": {},
        "css": {},
    }
    write_json_file(f"{app_config_dir}/{CONFIG_FILES_PATH['CONTEXT_COMPONENT_CONFIG']}.json", json.dumps({}))
    write_json_file(f"{app_config_dir}/{CONFIG_FILES_PATH['ROUTING_CONFIG']}.json", json.dumps(basic_routing_config))
    write_json_file(f"{app_config_dir}/{CONFIG_FILES_PATH['REDUCER_CONFIG']}.json", json.dumps({}))
    write_json_file(f"{app_config_dir}/{CONFIG_FILES_PATH['REDUX_STORE_CONFIG']}.json", json.dumps({}))
    write_json_file(f"{app_config_dir}/{CONFIG_FILES_PATH['CSS_CONFIG']}.json", json.dumps({}))
    write_json_file(f"{app_config_dir}/{CONFIG_FILES_PATH['USAGE_CONFIG']}.json", json.dumps(usage_config))
    write_json_file(f"{app_config_dir}/{CONFIG_FILES_PATH['SWAGGER_CONFIG']}.json", json.dumps({}))
    write_json_file(f"{app_config_dir}/react_request_code.py", REQUEST)  

def write_basic_main_comp_config(app_config):
    main_comp_config = {
        app_config['defaultComponent'] : {
            "name": app_config['defaultComponent'],
            "id":app_config['defaultComponent'].upper(),
            "file_id":"DEFAULT_COMP",
            "imports": {
                "components": [
                ],
                "other": [
                ]
            },
            "propsVars": [],
            "resources": [],
            "html": { "_id": "Main" },
            "wrapper_store": None,
            "html_elements": {
                "Main": {
                    "type": "Element",
                    "elementType": "HTML",
                    "typeId": "DIV",
                    "tagName": "div",
                    "attributes": {
                    "className": { "type": "LITERAL", "value": "" }
                    },
                    "children": [{ "_id": "Main-0" }]
                },
                "Main-0": { "type": "text", "text": "Hello world" }
            }
        }
    }

    app_config_dir = f"{CONFIG_PATH}/{app_config['name']}"

    comp_config = f"{app_config_dir}/{CONFIG_FILES_PATH['COMPONENT_CONFIG']}"

    write_json_file(f"{comp_config}.json", json.dumps(main_comp_config))

def create_directory_management_file(app_config):
    if app_config.get('languages') =="typescript":
        template_path=TSX_DIRECTORY_CONFIG
    else:
        template_path= JSX_DIRECTORY_CONFIG

    if not os.path.exists(template_path):
        raise FileNotFoundError(f"Template file {template_path} does not exist")

    with open(template_path, 'r') as template_file:
        template_content = json.load(template_file)
        
    app_config_dir = f"{CONFIG_PATH}/{app_config['name']}"
    
    directory_management_path =  f"{app_config_dir}/{CONFIG_FILES_PATH['DIRECTORY_MANAGEMENT']}.json"
    print(directory_management_path,"directory management file path")
    with open(directory_management_path, 'w') as dir_mgmt_file:
        json.dump(template_content, dir_mgmt_file, indent=4)
    
def update_directory_management_file(app_config):
    app_config_dir = f"{CONFIG_PATH}/{app_config['name']}"
    directory_management_path =  f"{app_config_dir}/{CONFIG_FILES_PATH['DIRECTORY_MANAGEMENT']}"
    
    directory_management_config = read_json_file(directory_management_path)
    
    default_comp_name = app_config['defaultComponent']+ (".tsx" if app_config.get("language") == "typescript" else ".jsx")
    
    directory_management_config["DEFAULT_COMP"]["name"] = default_comp_name
    
    write_json_file(f"{directory_management_path}.json", json.dumps(directory_management_config))