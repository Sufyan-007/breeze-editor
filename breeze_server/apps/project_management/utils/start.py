from apps.project_management.communication.app_startup_manager import start_app
from apps.common.constants.consts import CONFIG_FILES_PATH, CONFIG_PATH
from apps.common.utils.file_helpers.json_handler import read_project_config_file

def start_project(project_name):
    try:
        app_config_dir = f"{CONFIG_PATH}/{project_name}"
        app_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        start_app(app_config)
    except Exception as e:
        print(f"Error starting project: {e}")