from ..utils.consts import CONFIG_FILES_PATH, APP_CONFIG_PATH
from ..utils.file_helper import read_json_file, write_file, create_dir_if_not_exists
import json
from ..utils.request_code import REQUEST
from generate_project import GenerateProject

class AppConfigWriter:
    def __init__(self):
        pass
    
    def write_basic_config_files(self, app_config):
        app_config_dir = f"{APP_CONFIG_PATH}/{app_config['name']}"

        basic_routing_config = {
            "routes": [
                {
                    "path": "/",
                    "component": f"'{app_config['defaultComponent']}'"
                }
            ]
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
                "containingFile": f"components/{app_config['defaultComponent']}.js",
                "stateVars": [],
                "propsVars": [],
                "otherVars" : [],
                "functions": [],
                "html": {},
                "wrapper_store": None,
                "imports": {
                    "components": [
                    ],
                    "other": [
                    ]
                },
                "hooks": []
            }
        }

        app_config_dir = f"{APP_CONFIG_PATH}/{app_config['name']}"

        comp_config = f"{app_config_dir}/{CONFIG_FILES_PATH['COMPONENT_CONFIG']}"

        write_file(f"{comp_config}.json", json.dumps(main_comp_config))


    def create_or_update_app_config(self, data):
        app_config_dir = f"{APP_CONFIG_PATH}/{data['name']}"

        # Create Dir if not exists for config folder
        create_dir_if_not_exists(app_config_dir)

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

        # write configuration
        write_file(f"{app_config_path}.json", json.dumps(app_current_config))

        

        self.write_basic_main_comp_config(app_current_config)

        self.write_basic_config_files(app_current_config)

        GenerateProject.generate_project(app_current_config)

