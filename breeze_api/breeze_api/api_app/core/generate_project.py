import subprocess

class GenerateProject:
    def __init__(self):
        pass

    @staticmethod
    def generate_project(project_config):
        
        print("***********************************")
        print("RUNNING PROJECT GENERATION SCRIPT")
        subprocess.run(["python3", "/home/raj/Desktop/bridge/processor/bridge_ui_server/breezeui/app_generator.py", project_config['name']])

        print("PROJECT GENERATION SCRIPT COMPLETED")
        print("***********************************")

        