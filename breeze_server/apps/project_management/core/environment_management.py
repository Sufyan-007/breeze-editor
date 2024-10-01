from apps.common.constants.consts import CONFIG_FILES_PATH, CONFIG_PATH
from apps.common.utils.file_helpers.json_handler import read_project_config_file, write_json_file
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