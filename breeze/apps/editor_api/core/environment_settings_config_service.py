import os
import json
import uuid
from common.utils.config_reader import read_config_file, write_file
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
from common.utils.file_helper import create_parent_dir_if_not_exists
from .app_startup_manager import start_app
from django.http import JsonResponse

class EnvironmentSettingsConfigService:
    def __init__(self, project_name):
        self.project_name = project_name
        self.app_config_dir = f"{CONFIG_PATH}/{project_name}"
        self.app_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        self.config_file_path = os.path.join(self.app_config_dir, 'environment_settings.json')
        self.env_directory = os.path.join(self.app_config['path'], self.app_config['name'])
        self.package_json_path = os.path.join(f"{self.app_config['path']}/{self.app_config['name']}", 'package.json')
        
    def save_file(self, env_name, env_values, env_vars):
        try:
            env_file_path = os.path.join(self.env_directory, f"{env_name}.env")
            if env_name == 'default (.env)':
                env_file_path = os.path.join(self.env_directory, ".env")
            create_parent_dir_if_not_exists(os.path.dirname(env_file_path))
            with open(env_file_path, 'w') as file:
                for var_id, value in env_values.items():
                    var_name = env_vars.get(var_id, var_id)
                    file.write(f"{var_name}={value}\n")
        except Exception as e:
            raise Exception(f"Error saving environment file for {env_name}: {e}")

    def edit_package_json_file(self, config):
        try:
            if not os.path.exists(self.package_json_path):
                raise FileNotFoundError(f"Package.json file does not exist at path: {self.package_json_path}")

            with open(self.package_json_path, 'r') as package_json_file:
                package_json_data = json.load(package_json_file)

            scripts = package_json_data.get("scripts", {})

            environments = config.get("environments", {})

            for env_name in environments.keys():
                script_name = f"start:{env_name}"
                if env_name == 'default (.env)':
                    continue
                command = f"env-cmd -f {env_name}.env react-scripts start"
                if script_name not in scripts:
                    scripts[script_name] = command

            package_json_data["scripts"] = scripts

            create_parent_dir_if_not_exists(os.path.dirname(self.package_json_path))

            with open(self.package_json_path, 'w') as package_json_file:
                json.dump(package_json_data, package_json_file, indent=4)

            print(f"Package.json file updated with environment-specific scripts.")
        except FileNotFoundError as e:
            raise FileNotFoundError(f"Error editing package.json file: {e}")
        except json.JSONDecodeError as e:
            raise Exception(f"Error decoding JSON from package.json file: {e}")
        except Exception as e:
            raise Exception(f"General error editing package.json file: {e}")

    def remove_script_from_package_json(self, env_name):
        try:
            if not os.path.exists(self.package_json_path):
                raise FileNotFoundError(f"Package.json file does not exist at path: {self.package_json_path}")

            with open(self.package_json_path, 'r') as package_json_file:
                package_json_data = json.load(package_json_file)

            scripts = package_json_data.get("scripts", {})

            script_name = f"start:{env_name}"
            if script_name in scripts:
                del scripts[script_name]

            package_json_data["scripts"] = scripts

            create_parent_dir_if_not_exists(os.path.dirname(self.package_json_path))

            with open(self.package_json_path, 'w') as package_json_file:
                json.dump(package_json_data, package_json_file, indent=4)
        except FileNotFoundError as e:
            raise FileNotFoundError(f"Error removing script from package.json file: {e}")
        except json.JSONDecodeError as e:
            raise Exception(f"Error decoding JSON from package.json file: {e}")
        except Exception as e:
            raise Exception(f"General error removing script from package.json file: {e}")

    def read_config_file(self, path):
        try:
            if os.path.exists(path):
                with open(path, 'r') as file:
                    return json.load(file)
            return {}
        except json.JSONDecodeError as e:
            raise Exception(f"Error decoding JSON from config file: {e}")
        except Exception as e:
            raise Exception(f"General error reading config file: {e}")

    def write_config_file(self, path, data):
        try:
            create_parent_dir_if_not_exists(os.path.dirname(path))
            with open(path, 'w') as file:
                json.dump(data, file, indent=4)
        except Exception as e:
            raise Exception(f"Error writing config file: {e}")

    def generate_uuid(self):
        try:
            return str(uuid.uuid4())
        except Exception as e:
            raise Exception(f"Error generating UUID: {e}")

    def generate_config_from_payload(self, payload):
        try:
            env_vars = payload.get("envVars", {})
            environments = payload.get("environments", {})

            config = {
                "envVars": {},
                "environments": {}
            }

            uuid_mapping = {key: self.generate_uuid() for key in env_vars}

            for old_id, name in env_vars.items():
                new_id = uuid_mapping[old_id]
                config["envVars"][new_id] = name

            for env_name, env_values in environments.items():
                config["environments"][env_name] = {}
                for old_id, value in env_values.items():
                    new_id = uuid_mapping[old_id]
                    config["environments"][env_name][new_id] = value

            self.write_config_file(self.config_file_path, config)
            self.edit_package_json_file(config)
            for env_name, env_values in config["environments"].items():
                self.save_file(env_name, env_values, config["envVars"])

            start_app(self.app_config, forceRestart=True)
            return config
        except Exception as e:
            raise Exception(f"Error generating config from payload: {e}")

    def get_config(self):
        try:
            config_data = self.read_config_file(self.config_file_path)
            return config_data
        except Exception as e:
            raise Exception(f"Error getting config: {e}")
    
    def delete_config(self, env_name):
        try:
            if env_name == 'default (.env)':
                raise Exception("Cannot delete the default environment")
    
            if env_name == self.app_config.get('current_environment'):
                raise Exception(f"Cannot delete the current environment '{env_name}'")
    
            config = self.get_config()
    
            if env_name in config["environments"]:
                del config["environments"][env_name]
                self.write_config_file(self.config_file_path, config)
                env_file_path = os.path.join(self.env_directory, f"{env_name}.env")
                if os.path.exists(env_file_path):
                    os.remove(env_file_path)
                self.remove_script_from_package_json(env_name)
        except FileNotFoundError as e:
            raise FileNotFoundError(f"Error deleting environment config: {e}")
        except Exception as e:
            raise Exception(f"{e}")


    def set_environment(self, env_name):
        try:
            path = os.path.join(self.app_config_dir, CONFIG_FILES_PATH['APP_CONFIG']) + ".json"
            self.app_config["current_environment"] = env_name
            self.write_config_file(path, self.app_config)
            start_app(self.app_config, forceRestart=True)
        except FileNotFoundError as e:
            raise FileNotFoundError(f"Error setting environment: {e}")
        except Exception as e:
            raise Exception(f"{e}")
