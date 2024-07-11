from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
from common.utils.file_helper import read_json_file, write_file, create_parent_dir_if_not_exists
import json,os
from common.utils.request_code import REQUEST
from .generate_project import GenerateProject

class AppConfigWriter:
    def __init__(self):
        pass
    
    def write_basic_config_files(self, app_config):
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
        write_file(f"{app_config_dir}/{CONFIG_FILES_PATH['CONTEXT_COMPONENT_CONFIG']}.json", json.dumps({}))
        write_file(f"{app_config_dir}/{CONFIG_FILES_PATH['ROUTING_CONFIG']}.json", json.dumps(basic_routing_config))
        write_file(f"{app_config_dir}/{CONFIG_FILES_PATH['REDUCER_CONFIG']}.json", json.dumps({}))
        write_file(f"{app_config_dir}/{CONFIG_FILES_PATH['REDUX_STORE_CONFIG']}.json", json.dumps({}))
        write_file(f"{app_config_dir}/{CONFIG_FILES_PATH['CSS_CONFIG']}.json", json.dumps({}))
        write_file(f"{app_config_dir}/react_request_code.py", REQUEST)

    def write_basic_main_comp_config(self, app_config):
        main_comp_config = {
            app_config['defaultComponent'] : {
                "name": app_config['defaultComponent'],
                "id":app_config['defaultComponent'].upper(),
                "containingFile": f"components/{app_config['defaultComponent']}.js",
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

        write_file(f"{comp_config}.json", json.dumps(main_comp_config))

    def create_or_update_app_config(self, data):
        if data["name"]=="":
            raise ValueError("Name must be specified")
        app_config_dir = f"{CONFIG_PATH}/{data['name']}"

        # Create Dir if not exists for config folder
        create_parent_dir_if_not_exists(app_config_dir)
        create_parent_dir_if_not_exists(f"{app_config_dir}/generated_intermediate_json")
        create_parent_dir_if_not_exists(data["path"])

        app_config_path = f"{app_config_dir}/{CONFIG_FILES_PATH['APP_CONFIG']}"

        # Read old config
        try:
            app_current_config = read_json_file(app_config_path)
        except FileNotFoundError as e:
            print(e)
            app_current_config = {}


        app_current_config = data

        app_current_config['components_src_dir'] = 'src'

        print(app_current_config)
        app_current_config["dependencies"] = {
            "react-router-dom": "*",
            "bootstrap": "^5.3.2",
            "react-bootstrap": "*"

        }
        
        # write configuration
        # first check for an existing auth.json file
        auth_json_path = f"{app_config_dir}/generated_intermediate_json/auth.json"
        if not os.path.exists(auth_json_path):
            write_file(auth_json_path, json.dumps({}))
            
        write_file(f"{app_config_path}.json", json.dumps(app_current_config))

        self.write_basic_main_comp_config(app_current_config)

        self.write_basic_config_files(app_current_config)

        GenerateProject.generate_project(app_current_config)
    
