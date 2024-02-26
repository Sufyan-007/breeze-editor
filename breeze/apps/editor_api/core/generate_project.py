import subprocess,os

from common.utils.config_reader import read_config_file
from .app_generator import AppGenerator 
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
class GenerateProject:
    def __init__(self):
        pass

    @staticmethod
    def generate_project(project_config):
        
        print("***********************************")
        print("RUNNING PROJECT GENERATION SCRIPT")
        app_generator = AppGenerator(project_config['name'])
        app_generator.generate_app()
        print("PROJECT GENERATION SCRIPT COMPLETED")
        print("***********************************")
        
    @staticmethod
    def get_projects():
        project_names = os.listdir(CONFIG_PATH)
        projects={}
        for project_name in project_names:
            app_config_dir = f"{CONFIG_PATH}/{project_name}"
            app_config = read_config_file(app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
            app_config['project_name'] = project_name
            projects[project_name]=app_config
        return projects