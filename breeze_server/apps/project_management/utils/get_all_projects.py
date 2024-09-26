import os
from apps.common.constants.consts import CONFIG_FILES_PATH, CONFIG_PATH
from apps.common.utils.file_helpers.json_handler import read_project_config_file

def get_all_projects():
    project_names = os.listdir(CONFIG_PATH)
    projects={}
    for project_name in project_names:
        app_config_dir = f"{CONFIG_PATH}/{project_name}"
        app_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        app_config['project_name'] = project_name
        projects[project_name]=app_config
    return projects