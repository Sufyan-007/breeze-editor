import os
import json
from common.utils.app_consts import CONFIG_PATH

class GetResourceVersion:
    def __init__(self, project_name):
        self.project_name = project_name
        self.config_path = os.path.join(CONFIG_PATH, project_name)
        
    def get_version(self, resource, category):
        version_file = f"{resource}_versions.json"
        version_file_path = os.path.join(self.config_path, category.lower(),version_file)
        print(version_file_path,"version file path")
        # Check if the version file exists
        if not os.path.exists(version_file_path):
            return {'error': f"{version_file} not found"}, 404
        
        try:
            with open(version_file_path, 'r') as file:
                version_data = json.load(file)
            return version_data, 200
        except Exception as e:
            return {'error': f"Error reading {version_file}: {str(e)}"}, 500