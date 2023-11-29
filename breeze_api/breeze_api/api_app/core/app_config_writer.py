from ..utils.consts import CONFIG_FILES_PATH, APP_CONFIG_PATH
from ..utils.file_helper import read_json_file, write_file, create_dir_if_not_exists
import json

class AppConfigWriter:
    def __init__(self):
        pass

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

        print(app_current_config)

        # write configuration
        write_file(f"{app_config_path}.json", json.dumps(app_current_config))
