import os
import json, uuid
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
from common.utils.config_reader import read_config_file
from common.utils.file_helper import create_parent_dir_if_not_exists

class ResourceConfigGenerator:
    def __init__(self, project_name):
        self.project_name = project_name
        self.app_config_dir = f"{CONFIG_PATH}/{project_name}"

        self.app_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        self.app_config['APP_CONFIG_PATH'] = self.app_config_dir
        self.app_config['APP_SOURCE_DIR'] = os.path.join(self.app_config['path'], self.app_config['components_src_dir'])

        self.base_dir = os.path.join('configurations', project_name)
        self.config_file_path = os.path.join(self.base_dir, 'uploaded_resources_config.json')
        self.assets_dir = os.path.join(self.app_config['APP_SOURCE_DIR'], 'assets')
        self.directory_management_path = os.path.join(self.base_dir, 'directory_management.json')
        
    def save_file(self, file_id, file_name, path):
        # create_parent_dir_if_not_exists(self.assets_dir)

        file_path_full = os.path.join(CONFIG_PATH, self.project_name, 'uploaded_assets', file_id)
        
        with open(file_path_full, 'rb') as f:
            file_content = f.read()

        create_parent_dir_if_not_exists(path)
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

    def generate_unique_id(self):
        return str(uuid.uuid4())
    
    def determine_lineage(self, file_path):
        directory_management = self.read_config_file(self.directory_management_path)
        
        path_components = file_path.split('/')  #Split file path into components
        lineage = []
        
        for part in path_components:
            for key,value in directory_management.items():
                if value['name'] == part and value['type'] == 'DIRECTORY':
                    lineage.append(key)
                    break
        print(lineage,"lineage for the new uploaded resource")    
          
        return lineage
            

    def find_root_directory_id(self):
        # Find the ID of the root directory
        directory_management = self.read_config_file(self.directory_management_path)
        root_id = None
        for item_id, item in directory_management.items():
            if item.get("tag") == "ROOT" and item.get("type") == "DIRECTORY":
                root_id = item_id
                break

        if root_id is None:
            print("Error: Root directory not found in the configuration.")
        return root_id
                
    def update_directory_management(self, file_name, file_path, file_type):
        print("Updating directory management...")
        print(file_name, file_path, file_type, "parameters")

        # Read existing directory management configuration
        directory_management = self.read_config_file(self.directory_management_path)
        if not directory_management:
            print(f"No existing directory management configuration found at {self.directory_management_path}")
            directory_management = {}  # Initialize if the file is empty

        # Generate unique ID for the new resource
        unique_id = self.generate_unique_id()

        # Determine the lineage for the new resource based on the file path
        lineage = self.determine_lineage(file_path)

        if not lineage:
            print(f"Warning: No lineage found for the file path {file_path}")

            # Generate a unique ID for the new directory
            unique_id_for_directory = self.generate_unique_id()

            # Find the root directory ID
            root_id = self.find_root_directory_id()
            if not root_id:
                return

            # Create new directory management entry
            new_directory = {
                unique_id_for_directory: {
                    "name": 'assets',
                    "lineage": [root_id],
                    "id": unique_id_for_directory,
                    "tag": file_type.upper(),
                    "type": "DIRECTORY",
                }
            }

            # Create new resource entry
            new_resource = {
                unique_id: {
                    "name": file_name,
                    "lineage": [root_id, unique_id_for_directory],
                    "id": unique_id,
                    "tag": file_type.upper(),
                    "type": "FILE"
                }
            }

            # Add the new directory and resource to the directory management
            directory_management.update(new_directory)
            directory_management.update(new_resource)
        else:
            # Create a new resource entry
            new_resource = {
                unique_id: {
                    "name": file_name,
                    "lineage": lineage,
                    "id": unique_id,
                    "tag": file_type.upper(),
                    "type": "FILE"
                }
            }

            # Update the directory management configuration with the new resource
            directory_management.update(new_resource)

        # Write the updated configuration back to the file
        try:
            self.write_config_file(self.directory_management_path, directory_management)
            print(f"Successfully updated directory management configuration at {self.directory_management_path}")
        except IOError as e:
            print(f"Error writing to {self.directory_management_path}: {e}")

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

        self.update_directory_management( file_name, file_path, file_type)
        return config_data

    def get_uploaded_files(self):
        file_data = self.read_config_file(self.config_file_path)
        return [{"id": key, "name": value.get("name"), "path": value.get("path")} for key, value in file_data.items()]

    def delete_config(self, file_id, file_name):
        config_data = self.read_config_file(self.config_file_path)

        if file_id in config_data:
            file_path = config_data[file_id]['path']
            del config_data[file_id]
            self.write_config_file(self.config_file_path, config_data)

            if file_path.startswith('/src/'):
                file_path = file_path[len('/src/'):]

            full_path = os.path.join(self.app_config['APP_SOURCE_DIR'], file_path, file_name)

            if os.path.exists(full_path):
                os.remove(full_path)

                # Update directory_management.json after deleting the file
        directory_management = self.read_config_file(self.directory_management_path)
        if file_id in directory_management:
            del directory_management[file_id]

            try:
                self.write_config_file(self.directory_management_path, directory_management)
                print(f"Successfully updated directory management configuration at {self.directory_management_path}")
            except IOError as e:
                print(f"Error writing to {self.directory_management_path}: {e}")
            else:
                print(f"Error: File {full_path} does not exist.")
        else:
            print(f"Error: File ID {file_id} not found in config data.")

            
            
    def file_duplicacy(self, file_name):
        existing_config = self.read_config_file(self.config_file_path)
        return any(value['name'] == file_name for value in existing_config.values())
