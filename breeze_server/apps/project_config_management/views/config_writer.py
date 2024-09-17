import json

from apps.common.device_spec_consts import CONFIG_PATH
from apps.common.consts import CONFIG_FILES_PATH
from apps.common.utils.file_helpers.dir_handler import create_parent_dir_if_not_exists 
from apps.common.utils.file_helpers.json_handler import read_json_file, write_json_file

def create_or_update_app_config(self, data):
        if data["name"]=="":
            raise ValueError("Name must be specified")
        app_config_dir = f"{CONFIG_PATH}/{data['name']}"

        # Create Dir if not exists for config folder
        create_parent_dir_if_not_exists(app_config_dir)
        #for storing intermediate service config
        create_parent_dir_if_not_exists(f"{app_config_dir}/api_client_intermediate_json")
        #for storing schemas retrieved form swagger file
        create_parent_dir_if_not_exists(f"{app_config_dir}/swagger_schema")
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
        
        # TODO: write all configuration part ASA other dependent module gets ready
            
        # write_json_file(f"{app_config_path}.json", json.dumps(app_current_config))

        # self.write_basic_main_comp_config(app_current_config)

        # self.write_basic_config_files(app_current_config)

        # GenerateProject.generate_project(app_current_config, app_current_config.get("logo"))
    