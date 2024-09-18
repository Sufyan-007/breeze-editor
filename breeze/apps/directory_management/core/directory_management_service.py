import json
import uuid, shutil
import os
from common.utils.app_consts import CONFIG_PATH,CONFIG_FILES_PATH
from common.utils.file_utils import create_parent_dir_if_not_exists
from common.utils.formatter import format_by_prettier
from common.utils.config_reader import read_config_file

class DirectoryManagementGenerator:
    def __init__(self,project_name):
        self.project_name = project_name
        self.app_config_dir = f"{CONFIG_PATH}/{project_name}"
        self.directory_config_path= os.path.join(CONFIG_PATH, self.project_name, 'directory_management.json')
        self.component_config_path = os.path.join(CONFIG_PATH, self.project_name, 'component_config.json')
        self.app_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        self.app_config['APP_SOURCE_DIR'] = f"{self.app_config['path']}/{self.app_config['components_src_dir']}"
        self.directory_management_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['DIRECTORY_MANAGEMENT'])
    
    
    def load_config(self,config_path):
        with open(config_path, 'r') as file:
            return json.load(file)

    def save_config(self,config_path, config_data):
        with open(config_path, 'w') as file:
            json.dump(config_data, file, indent=4)

    def save_file(self, file_id, content,formatted=True):
        path = self.get_path_from_file_id(file_id)
        create_parent_dir_if_not_exists(path)
        if formatted:
            content = format_by_prettier(content)
        with open(path, 'w') as f:
            f.write(content)


    def add_node_to_config(self, parent_id, tag,node_type="FILE", name=None, file_id=None):

        
        if not name:
            name = "New Folder" if node_type == "DIRECTORY" else "New File"
        
        parent_node = self.directory_management_config.get(parent_id,None)
        
        if not parent_node:
            raise IndexError("Given parent id does not exist")
        
        if parent_node["type"] != "DIRECTORY":
            raise NotADirectoryError("Parent is not a directory")
        
        parent_dir = self.get_path_from_file_id(parent_node["id"])
        
        if name in os.listdir(parent_dir):
            raise FileExistsError("Given file name already exists")
        
        new_lineage = parent_node.get("lineage",[])[0:]
        new_lineage.append(parent_id)
        
        if file_id:
            new_id= file_id
        else:
            new_id = str(uuid.uuid4())
        
        
        new_node = {
            "name": name,
            "lineage": new_lineage,
            "id": new_id,
            "tag": tag.upper(),
            "type": node_type.upper(),
        }
        
        self.directory_management_config[new_id] = new_node
        
        with open(self.directory_config_path, 'w') as file:
            json.dump(self.directory_management_config, file, indent=2)
        
       
        return new_node

    def rename_node(self, node_id, new_name):
        try:
            
            # Load the current folder configuration from the JSON file
            with open(self.directory_config_path, 'r') as file:
                config_data = json.load(file)
            
            old_path = self.get_path_from_file_id(node_id)
            
            # Find and rename the node
            if str(node_id) in config_data:
                config_data[str(node_id)]['name'] = new_name

                # Save the updated configuration back to the JSON file
                with open(self.directory_config_path, 'w') as file:
                    json.dump(config_data, file, indent=4)
                
                # Load component configuration from component_config.json
                try:
                    with open(self.component_config_path, 'r') as component_file:
                        component_data = json.load(component_file)
                except FileNotFoundError:
                    component_data = {}

                # Update the name in component_config.json if the node is a component
                if str(node_id) in component_data:
                    component_data[str(node_id)]['name'] = new_name

                    # Save the updated component configuration back to the JSON file
                    with open(self.component_config_path, 'w') as component_file:
                        json.dump(component_data, component_file, indent=4)
                
            
              
                new_path = os.path.join(os.path.dirname(old_path), new_name)
            
                os.rename(old_path, new_path)
                print(f"Renamed from {old_path} to {new_path}")
                
                return {'status': 'success', 'message': 'Node renamed successfully', 'config': config_data}
            else:
                return {'status': 'error', 'message': 'Node not found'}
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
        

    def build_parent_child_map(self,config_data):
        parent_child_map = {}
        for node_id, node in config_data.items():
            for parent_id in node['lineage']:
                if parent_id not in parent_child_map:
                    parent_child_map[parent_id] = []
                parent_child_map[parent_id].append(node_id)
        return parent_child_map

    def update_lineage_and_children(self,config_data, parent_child_map, node_id, new_lineage):
        node = config_data[str(node_id)]
        node['lineage'] = new_lineage
        for child_id in parent_child_map.get(node_id, []):
            self.update_lineage_and_children(config_data, parent_child_map, child_id, new_lineage + [node_id])

    #move files and folders based on old path and new path 
    def move_files_and_folders(self,config_data, parent_child_map, node_id, old_path_base, new_path_base):
        node = config_data[str(node_id)]
        node_name = node['name']
        old_path = os.path.join(self.app_config['APP_SOURCE_DIR'],old_path_base, node_name)
        new_path = os.path.join(self.app_config['APP_SOURCE_DIR'],new_path_base, node_name)
   
        if os.path.exists(old_path):
            os.makedirs(os.path.dirname(new_path), exist_ok=True)
            shutil.move(old_path, new_path)
        
        else:
            print(f"Old path does not exist: {old_path}")

        for child_id in parent_child_map.get(node_id, []):
            self.move_files_and_folders(config_data, parent_child_map, child_id, old_path, new_path)

    #constructs path on the base of old and updates lineage 
    def construct_path_from_new_lineage(self,config_data, lineage):
        path_parts = [config_data[str(id)]['name'] for id in lineage]
        if 'src' in path_parts:
            path_parts.remove('src')
        if path_parts:
            return os.path.join(*path_parts)
        else:
            return ""
        
    #get path from file_id
    def get_path_from_file_id(self,file_id,relative_path=False):
        if file_id not in self.directory_management_config:
            raise Exception(f"File ID {file_id} not found in directory_management.json")
       
        entry = self.directory_management_config[file_id]
        lineage = entry['lineage']
        # Construct the path from the lineage
        path_elements = []
        for lineage_id in lineage:
            if lineage_id in self.directory_management_config:
                path_elements.append(self.directory_management_config[lineage_id]['name'])
            else:
                raise Exception(f"Lineage ID {lineage_id} not found in directory_management.json")
        path_elements.append(entry['name'])
        if relative_path:
            
            constructed_path = os.path.join( *path_elements)
        else:
            constructed_path = os.path.join(self.app_config['path'], *path_elements)
            
        return constructed_path