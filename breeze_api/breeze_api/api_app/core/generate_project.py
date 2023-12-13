import subprocess

class GenerateProject:
    def __init__(self):
        pass

    @staticmethod
    def generate_project(project_config):
        
        print("***********************************")
        print("RUNNING PROJECT GENERATION SCRIPT")
        cmd = ["python3", "/home/yash/Documents/Projects/Breeze/breezeui/app_generator.py", project_config['name']]
        # subprocess.run(cmd)
        with subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True) as proc:
            for line in proc.stderr:
                print(cmd[0], line)
        print("PROJECT GENERATION SCRIPT COMPLETED")
        print("***********************************")

        