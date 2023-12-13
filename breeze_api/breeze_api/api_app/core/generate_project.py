import subprocess

class GenerateProject:
    def __init__(self):
        pass

    @staticmethod
    def generate_project(project_config):
        
        print("***********************************")
        print("RUNNING PROJECT GENERATION SCRIPT")
        subprocess.run(["npx", "create-react-app", project_config['name'], "--template",
                    "cra-template", "--use-npm"], text=True, input=app_config_dump, cwd=self.app_config['path'])

        print("PROJECT GENERATION SCRIPT COMPLETED")
        print("***********************************")

        