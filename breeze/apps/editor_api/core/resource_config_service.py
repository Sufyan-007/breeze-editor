import os
import json
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
from common.utils.config_reader import read_config_file
from common.utils.file_helper import create_parent_dir_if_not_exists

class ResourceConfigGenerator:
    def __init__(self, project_name):
        self.project_name = project_name
        self.app_config_dir = f"{CONFIG_PATH}/{project_name}"

        self.app_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        self.app_config['APP_CONFIG_PATH'] = self.app_config_dir
        self.app_config['APP_SOURCE_DIR'] = os.path.join(self.app_config['path'], self.app_config['name'], self.app_config['components_src_dir'])

        self.base_dir = os.path.join('configurations', project_name)
        self.config_file_path = os.path.join(self.base_dir, 'uploaded_resources_config.json')

    def save_file(self, file_id, file_name, path):
        # create_parent_dir_if_not_exists(self.assets_dir)

        file_path_full = os.path.join(CONFIG_PATH, self.project_name, 'uploaded_assets', file_id)
        
        with open(file_path_full, 'rb') as f:
            file_content = f.read()

        final_path = os.path.join(path, file_name)
        with open(final_path, 'wb') as destination:
            destination.write(file_content)

    def read_config_file(self, path):
        if os.path.exists(path):
            with open(path, 'r') as file:
                return json.load(file)
        return {}

    def write_config_file(self, path, data):
        create_parent_dir_if_not_exists(os.path.dirname(path))
        with open(path, 'w') as file:
            json.dump(data, file, indent=4)

    def update_config(self, file_name, file_path, description, file_id):
        existing_config = self.read_config_file(self.config_file_path)
        
        file_extension = os.path.splitext(file_name)[1]
        file_type = file_extension.lstrip('.').lower()

        config_data = {
            file_id: {
                "name": file_name,
                "type": file_type,
                "path": file_path,
                "description": description,
            }
        }

        existing_config.update(config_data)
        self.write_config_file(self.config_file_path, existing_config)

        # Remove leading 'src/' if present
        if file_path.startswith('/src/'):
            file_path = file_path[len('/src/'):]

        # Combine the base source directory with the dynamic file path
        full_path = os.path.join(self.app_config['APP_SOURCE_DIR'], file_path)
        self.save_file(file_id, file_name, full_path)

        
        return config_data

    def get_uploaded_files(self):
        file_data = self.read_config_file(self.config_file_path)
        return [{"id": key, "name": value.get("name")} for key, value in file_data.items()]

    def delete_config(self, file_id, file_name):
        config_data = self.read_config_file(self.config_file_path)

        if file_id in config_data:
            file_path = config_data[file_id]['path']
            del config_data[file_id]
            self.write_config_file(self.config_file_path, config_data)

            # Remove leading 'src/' if present
            if file_path.startswith('/src/'):
                file_path = file_path[len('/src/'):]

            full_path = os.path.join(self.app_config['APP_SOURCE_DIR'], file_path, file_name)

            if os.path.exists(full_path):
                os.remove(full_path)
    
    def file_duplicacy(self, file_name):
        existing_config = self.read_config_file(self.config_file_path)
        return any(value['name'] == file_name for value in existing_config.values())
