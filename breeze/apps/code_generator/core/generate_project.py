import subprocess
from .app_generator import AppGenerator 
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

        