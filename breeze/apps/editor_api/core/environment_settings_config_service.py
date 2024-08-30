import os
import json
import uuid
from common.utils.config_reader import read_config_file, write_file
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
from common.utils.file_helper import create_parent_dir_if_not_exists
from .app_startup_manager import start_app

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

            # Get the old and new environment names from the config
            old_env_name = config.get("old_env_name")
            new_env_name = config.get("new_env_name")

            if old_env_name:
                # Remove the old environment script if it exists
                old_script_name = f"start:{old_env_name}"
                if old_script_name in scripts:
                    del scripts[old_script_name]

            package_json_data["scripts"] = scripts

            if new_env_name and new_env_name != 'default (.env)':
                # Add or update the new environment script
                new_script_name = f"start:{new_env_name}"
                command = f"env-cmd -f {new_env_name}.env react-scripts start"
                if new_script_name not in scripts:
                    scripts[new_script_name] = command

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

            # Load the existing configuration
            config = self.get_config()

            if not config:  # If the config doesn't exist or is empty
                config = {
                    "envVars": {},
                    "environments": {}
                }

            # Track IDs to remove or update
            new_env_vars = {}
            id_mapping = {}

            new_env_name = None

            # Process envVars: add new variables and map old IDs to new IDs if needed
            for old_id, name in env_vars.items():
                if old_id not in config["envVars"]:
                    # If it's a new variable, generate a new UUID and add it
                    new_id = self.generate_uuid()
                    new_env_vars[new_id] = name
                    id_mapping[old_id] = new_id
                else:
                    # Update existing variable name
                    new_env_vars[old_id] = name

            # Add new variables to the existing envVars
            config["envVars"].update(new_env_vars)

            # Update environments with the new variable IDs
            for env_name, env_values in environments.items():
                if env_name not in config["environments"]:
                    # Add the new environment if it doesn't exist
                    config["environments"][env_name] = {}
                    new_env_name = env_name

                for old_id, value in env_values.items():
                    new_id = id_mapping.get(old_id, old_id)
                    config["environments"][env_name][new_id] = value

            # Save the updated configuration
            self.write_config_file(self.config_file_path, config)

            # Call edit_package_json_file with the new environments
            self.edit_package_json_file({"new_env_name": new_env_name})

            # Save environment files
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

    def update_env_vars(self, variable_id, updated_name, updated_values):
        try:
            config = self.get_config()

            # Update the name in envVars
            if variable_id in config["envVars"]:
                config["envVars"][variable_id] = updated_name

            # Update the values in all environments
            for env_name, variables in config["environments"].items():
                if variable_id in variables:
                    config["environments"][env_name][variable_id] = updated_values[env_name]

            self.write_config_file(self.config_file_path, config)
            self.edit_package_json_file(config)
            for env_name, env_values in config["environments"].items():
                self.save_file(env_name, env_values, config["envVars"])

            start_app(self.app_config, forceRestart=True)

        except Exception as e:
            raise Exception(f"Error updating config: {e}")

    def update_environment_name(self, old_env_name, new_env_name):
        try:
            config = self.get_config()
            temp_config = {}

            # Check if the old environment name exists in the config
            if old_env_name not in config["environments"]:
                raise Exception(f"Environment '{old_env_name}' not found.")

            # Create a new ordered dictionary to preserve order
            new_environments = {}
            inserted = False

            # Iterate over the existing environments and update the name
            for env_name, env_values in config["environments"].items():
                if env_name == old_env_name:
                    # Insert the new environment at the same position
                    new_environments[new_env_name] = env_values
                    inserted = True
                else:
                    # Preserve existing environments in order
                    new_environments[env_name] = env_values

            # Ensure the old environment name was found and replaced
            if not inserted:
                raise Exception(f"Environment '{old_env_name}' not found in the order.")

            # Update the configuration with the new environments
            config["environments"] = new_environments

            # Pass old and new environment names to edit_package_json_file
            temp_config.update({"old_env_name": old_env_name, "new_env_name": new_env_name})

            # Save the updated configuration
            self.write_config_file(self.config_file_path, config)

            # Remove the old environment file if it exists
            env_file_path = os.path.join(self.env_directory, f"{old_env_name}.env")
            if os.path.exists(env_file_path):
                os.remove(env_file_path)

            # Update the package.json file
            self.edit_package_json_file(temp_config)

            # Save environment files
            for env_name, env_values in config["environments"].items():
                self.save_file(env_name, env_values, config["envVars"])

            # Restart the application
            start_app(self.app_config, forceRestart=True)

        except Exception as e:
            raise Exception(f"Error updating environment name: {e}")

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

    def delete_env_variable(self, env_variable_id):
        try:
            config = self.get_config()
            env_vars = config.get("envVars", {})

            if env_variable_id in env_vars:
                env_var_name =  env_vars[env_variable_id]
                del env_vars[env_variable_id]
                for env_name in config["environments"]:
                    if env_variable_id in config["environments"][env_name]:
                        del config["environments"][env_name][env_variable_id]
                self.write_config_file(self.config_file_path, config)

                # Rewrite the .env files without the deleted variable
                for env_name, env_values in config["environments"].items():
                    self.save_file(env_name, env_values, config["envVars"])

                return env_var_name
            else:
                raise Exception(f"Environment variable ID '{env_variable_id}' not found")
        except FileNotFoundError as e:
            raise FileNotFoundError(f"Error deleting environment variable: {e}")
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
