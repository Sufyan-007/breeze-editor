import os, json
from pathlib import Path
from apps.common.constants.consts import CONFIG_FILES_PATH, CONFIG_PATH
from apps.common.utils.uuid_as_key import generate_uuid_as_key
from apps.common.utils.file_helpers.json_handler import read_project_config_file, write_json_file
from apps.common.utils.file_helpers.dir_handler import create_parent_dir_if_not_exists 
from ..communication.app_startup_manager import start_app

def set_environment(env_name, project_id):
    try:
        app_config_dir = f"{CONFIG_PATH}/{project_id}"
        app_config_path = f"{app_config_dir}/{CONFIG_FILES_PATH['APP_CONFIG']}"
        
        app_config = read_project_config_file(
            app_config_dir, CONFIG_FILES_PATH['APP_CONFIG']
        )
        app_config["current_environment"] = env_name
        write_json_file(f"{app_config_path}.json", app_config)
        start_app(app_config, forceRestart=True)
    except FileNotFoundError as e:
        raise FileNotFoundError(f"Error setting environment: {e}")
    except Exception as e:
        raise Exception(f"{e}")

def get_env_config(project_id):
    try:
        app_config_dir = f"{CONFIG_PATH}/{project_id}"
        env_config_path = app_config_dir + '/' +CONFIG_FILES_PATH['ENVIRONMENT_SETTINGS']
        config_data = {}
        if Path(f"{env_config_path}.json").is_file():
            config_data = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['ENVIRONMENT_SETTINGS'])
        
        config = {
            "envVars": config_data.get("envVars",{}),
            "environments": config_data.get("environments",{})
        }
            
        return config
    except Exception as e:
        raise Exception(f"Error getting config: {e}")
    
def edit_package_json_file(project_id, config):
    try:
        app_config_dir = f"{CONFIG_PATH}/{project_id}"
        app_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        package_json_path = os.path.join(f"{app_config['path']}", 'package.json')
        if not os.path.exists(package_json_path):
            raise FileNotFoundError(f"Package.json file does not exist at path: {package_json_path}")

        with open(package_json_path, 'r') as package_json_file:
            package_json_data = json.load(package_json_file)

        scripts = package_json_data.get("scripts", {})

        environments = config.get("environments", {})

        for env_name in environments.keys():
            script_name = f"start:{env_name}"
            if env_name == 'default (.env)':
                continue
            if app_config.get('buildTool', "") == "create-react-app":
                command = f"env-cmd -f {env_name}.env react-scripts start"
            else:
                command = f"vite --mode {env_name}"
            if script_name not in scripts:
                scripts[script_name] = command

        package_json_data["scripts"] = scripts

        create_parent_dir_if_not_exists(os.path.dirname(package_json_path))

        with open(package_json_path, 'w') as package_json_file:
            json.dump(package_json_data, package_json_file, indent=4)

        print(f"Package.json file updated with environment-specific scripts.")
    except FileNotFoundError as e:
        raise FileNotFoundError(f"Error editing package.json file: {e}")
    except json.JSONDecodeError as e:
        raise Exception(f"Error decoding JSON from package.json file: {e}")
    except Exception as e:
        raise Exception(f"General error editing package.json file: {e}")
        
def save_file(project_id, env_name, env_values, env_vars):
    try:
        app_config_dir = f"{CONFIG_PATH}/{project_id}"
        app_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        env_directory = app_config['path']
        env_file_path = os.path.join(env_directory, f".env.{env_name}")
        if env_name == 'dev (default)':
            env_file_path = os.path.join(env_directory, ".env")
        create_parent_dir_if_not_exists(os.path.dirname(env_file_path))
        with open(env_file_path, 'w') as file:
            for var_id, value in env_values.items():
                var_name = env_vars.get(var_id, var_id)
                file.write(f"{var_name}={value}\n")
    except Exception as e:
        raise Exception(f"Error saving environment file for {env_name}: {e}")
    
def generate_config_from_payload(project_id, payload):
    try:
        env_vars = payload.get("envVars", {})
        environments = payload.get("environments", {})

        # Load the existing configuration
        config = get_env_config(project_id)

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
                new_id = generate_uuid_as_key()
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
        app_config_dir = f"{CONFIG_PATH}/{project_id}"
        app_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        write_json_file(f"{app_config_dir}/{CONFIG_FILES_PATH['ENVIRONMENT_SETTINGS']}.json", config)

        # Call edit_package_json_file with the new environments
        edit_package_json_file(project_id, {"new_env_name": new_env_name})

        # Save environment files
        for env_name, env_values in config["environments"].items():
            save_file(project_id, env_name, env_values, config["envVars"])

        start_app(app_config, forceRestart=True)
        return config
    except Exception as e:
        raise Exception(f"Error generating config from payload: {e}")

def update_env_vars(project_id, variable_id, updated_name, updated_values):
    try:
        config = get_env_config(project_id)

        # Update the name in envVars
        if variable_id in config["envVars"]:
            config["envVars"][variable_id] = updated_name

        # Update the values in all environments
        for env_name, variables in config["environments"].items():
            if variable_id in variables:
                config["environments"][env_name][variable_id] = updated_values[env_name]

        app_config_dir = f"{CONFIG_PATH}/{project_id}"
        app_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        write_json_file(f"{app_config_dir}/{CONFIG_FILES_PATH['ENVIRONMENT_SETTINGS']}.json", config)
        edit_package_json_file(project_id, config)
        for env_name, env_values in config["environments"].items():
            save_file(project_id, env_name, env_values, config["envVars"])

        start_app(app_config, forceRestart=True)
        return config

    except Exception as e:
        raise Exception(f"Error updating config: {e}")

def update_environment_name(project_id, old_env_name, new_env_name):
    try:
        config = get_env_config(project_id)
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

        app_config_dir = f"{CONFIG_PATH}/{project_id}"
        app_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        # Save the updated configuration
        write_json_file(f"{app_config_dir}/{CONFIG_FILES_PATH['ENVIRONMENT_SETTINGS']}.json", config)

        # Remove the old environment file if it exists
        env_file_path = os.path.join(app_config['path'], f"{old_env_name}.env")
        if os.path.exists(env_file_path):
            os.remove(env_file_path)

        # Update the package.json file
        edit_package_json_file(project_id, temp_config)

        # Save environment files
        for env_name, env_values in config["environments"].items():
            save_file(project_id, env_name, env_values, config["envVars"])

        # Restart the application
        start_app(app_config, forceRestart=True)
        return config

    except Exception as e:
        raise Exception(f"Error updating environment name: {e}")
    
def delete_proj_env(project_id, env_name):
    try:
        if env_name == 'dev (default)':
            raise Exception("Cannot delete the default environment")

        app_config_dir = f"{CONFIG_PATH}/{project_id}"
        app_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        env_directory = app_config['path']
        
        if env_name == app_config.get('current_environment'):
            raise Exception(f"Cannot delete the current environment '{env_name}'")

        config = get_env_config(project_id)

        if env_name in config["environments"]:
            del config["environments"][env_name]
            write_json_file(f"{app_config_dir}/{CONFIG_FILES_PATH['ENVIRONMENT_SETTINGS']}.json", config)
            env_file_path = os.path.join(env_directory, f".env.{env_name}")
            if os.path.exists(env_file_path):
                os.remove(env_file_path)
            remove_script_from_package_json(app_config['path'], env_name)
            return config
    except FileNotFoundError as e:
        raise FileNotFoundError(f"Error deleting environment config: {e}")
    except Exception as e:
        raise Exception(f"{e}")

def remove_script_from_package_json(app_config_path, env_name):
    try:
        package_json_path = os.path.join(f"{app_config_path}", 'package.json')
        if not os.path.exists(package_json_path):
            raise FileNotFoundError(f"Package.json file does not exist at path: {package_json_path}")

        with open(package_json_path, 'r') as package_json_file:
            package_json_data = json.load(package_json_file)

        scripts = package_json_data.get("scripts", {})

        script_name = f"start:{env_name}"
        if script_name in scripts:
            del scripts[script_name]

        package_json_data["scripts"] = scripts

        create_parent_dir_if_not_exists(os.path.dirname(package_json_path))

        with open(package_json_path, 'w') as package_json_file:
            json.dump(package_json_data, package_json_file, indent=4)
    except FileNotFoundError as e:
        raise FileNotFoundError(f"Error removing script from package.json file: {e}")
    except json.JSONDecodeError as e:
        raise Exception(f"Error decoding JSON from package.json file: {e}")
    except Exception as e:
        raise Exception(f"General error removing script from package.json file: {e}")

def delete_env_variable(project_id, env_variable_id):
    try:
        config = get_env_config(project_id)
        env_vars = config.get("envVars", {})
        app_config_dir = f"{CONFIG_PATH}/{project_id}"

        if env_variable_id in env_vars:
            env_var_name =  env_vars[env_variable_id]
            del env_vars[env_variable_id]
            for env_name in config["environments"]:
                if env_variable_id in config["environments"][env_name]:
                    del config["environments"][env_name][env_variable_id]
            write_json_file(f"{app_config_dir}/{CONFIG_FILES_PATH['ENVIRONMENT_SETTINGS']}.json", config)

            # Rewrite the .env files without the deleted variable
            for env_name, env_values in config["environments"].items():
                save_file(project_id, env_name, env_values, config["envVars"])

            return {'env_var_name':env_var_name, 'config': config}
        else:
            raise Exception(f"Environment variable ID '{env_variable_id}' not found")
    except FileNotFoundError as e:
        raise FileNotFoundError(f"Error deleting environment variable: {e}")
    except Exception as e:
        raise Exception(f"{e}") 