import json
import uuid, shutil
import os
from common.utils.app_consts import CONFIG_PATH,CONFIG_FILES_PATH
from common.utils.config_reader import read_config_file

class DirectoryManagementGenerator:
    def __init__(self,project_name):
        self.project_name = project_name
        self.app_config_dir = f"{CONFIG_PATH}/{project_name}"
        self.directory_config_path= os.path.join(CONFIG_PATH, self.project_name, 'directory_management.json')
        self.component_config_path = os.path.join(CONFIG_PATH, self.project_name, 'component_config.json')
        self.app_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        self.app_config['APP_SOURCE_DIR'] = f"{self.app_config['path']}/{self.app_config['name']}/{self.app_config['components_src_dir']}"
        self.directory_management_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['DIRECTORY_MANAGEMENT'])
    def reload_config(self):
        self.directory_management_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['DIRECTORY_MANAGEMENT'])
        
    def create_parent_dir_if_not_exists(self,directory):
        if not os.path.exists(directory):
            os.makedirs(directory)
  
    def save_file(self, file_id, file_name, is_directory):
        
        self.reload_config()
        # Get the path using get_path_from_file_id
        constructed_final_path = self.get_path_from_file_id(file_id)
        
         # Remove .js extension for directories
        if is_directory:
            # Ensure that .js is not included for directories
            if constructed_final_path.endswith(".js"):
                constructed_final_path = constructed_final_path[:-3]
        
        self.create_parent_dir_if_not_exists(os.path.dirname(constructed_final_path))
        
        if is_directory:
        # Create a new directory
            os.makedirs(constructed_final_path, exist_ok=True)
            print(f"Directory created at {constructed_final_path}")
        else:
        # Create a new file
            with open(constructed_final_path, 'w') as new_file:
                new_file.write("")  # Create an empty file
            print(f"File created at {constructed_final_path}")


    def add_node_to_config(self, parent_id, node_type, lineage, tag, name=None):

        config_path = os.path.join(CONFIG_PATH, self.project_name, 'directory_management.json')

        with open(config_path, "r") as file:
            config = json.load(file)
        
        if not name:
            name = "New Folder" if node_type == "DIRECTORY" else "New File"
            
        new_id = str(uuid.uuid4())
        new_lineage = lineage + [parent_id]
        
        new_node = {
            "name": name,
            "lineage": new_lineage,
            "id": new_id,
            "tag": tag.upper(),
            "type": node_type.upper(),
        }
        
        formatted_key = new_node["name"].capitalize()
        config[new_id] = new_node
        
        with open(config_path, 'w') as file:
            json.dump(config, file, indent=2)
        
        if tag.lower() == "components":
            component_config_path = os.path.join(CONFIG_PATH, self.project_name, 'component_config.json')
            with open(component_config_path, "r") as component_file:
                component_config = json.load(component_file)
                
            new_component_node = {
                "name": new_node["name"],
                "file_id": new_node["id"],
                "propsVars": [],
                "resources": [],
                "componentType": "CUSTOM",
                "id": new_node["name"],
                "html": {"_id": new_node["name"]},
                "wrapper_store": None,
                "imports": {
                    "components": [], 
                    "other": [
                        {
                            "TYPE": "THIRD_PARTY",
                            "from": "react-bootstrap",
                            "import_entity": "Container",
                            "import_type": "SINGLE"
                        },
                        {
                            "TYPE": "THIRD_PARTY",
                            "from": "react",
                            "import_entity": "useEffect",
                            "import_type": "SINGLE"
                        }
                    ]
                },
                "html_elements": {
                    new_node["name"]: {
                        "type": "Element",
                        "elementType": "HTML",
                        "typeId": "DIV",
                        "tagName": "div",
                        "attributes": {
                            "className": {"type": "LITERAL", "value": ""},
                        },
                        "children": [
                            {"_id": f"{name}-0"},
                            {"_id": f"{name}-1"}
                        ]
                    },
                    f"{name}-0": {
                        "type": "text", 
                        "text": "Hello world"
                    },
                    f"{name}-1": {
                        "type": "Element",
                        "elementType": "HTML",
                        "typeId": "DIV",
                        "tagName": "div",
                        "attributes": {
                            "className": {"type": "LITERAL", "value": ""}
                        },
                        "children": [
                            {"_id": f"{name}-1-0"}
                        ]
                    },
                    f"{name}-1-0": {
                        "type": "text",
                        "text": "BYe"
                    }
                },
                "type": "CUSTOM"
            }
            component_config[formatted_key] = new_component_node
            
            with open(component_config_path, 'w') as component_file:
                json.dump(component_config, component_file, indent=2)
                 
            #save file/folder in the generated react app 
            if node_type.upper() == "DIRECTORY":
                self.save_file(new_id,name,True)
            else:
                self.save_file(new_id, name, False)
        
        
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
                
                # Rename the file/folder in the generated React app
                self.reload_config()
            
              
                new_path = os.path.join(os.path.dirname(old_path), new_name)
            
                os.rename(old_path, new_path)
                print(f"Renamed from {old_path} to {new_path}")
                
                return {'status': 'success', 'message': 'Node renamed successfully', 'config': config_data}
            else:
                return {'status': 'error', 'message': 'Node not found'}
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
        
    def load_config(self,config_path):
        with open(config_path, 'r') as file:
            return json.load(file)

    def save_config(self,config_path, config_data):
        with open(config_path, 'w') as file:
            json.dump(config_data, file, indent=4)

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
   
        
        print(f"Checking if old path exists: {old_path}")
        if os.path.exists(old_path):
            changed_path = shutil.move(old_path, new_path)
            print(f"Changed path: {changed_path}")
        else:
            print(f"Old path does not exist: {old_path}")

        for child_id in parent_child_map.get(node_id, []):
            self.move_files_and_folders(config_data, parent_child_map, child_id, old_path, new_path)

    #constructs path on the base of old and updates lineage 
    def construct_path_from_new_lineage(self,config_data, lineage):
        path_parts = [config_data[str(id)]['name'] for id in lineage]
        if 'src' in path_parts:
            path_parts.remove('src')
        return os.path.join(*path_parts)
    
    #get path from file_id
    def get_path_from_file_id(self,file_id):
          
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
        
        # Remove 'src' if it's included in the path_elements
        app_source_dir = self.app_config['APP_SOURCE_DIR']
        app_source_parts = app_source_dir.split(os.sep)
    
        # Check if 'src' exists in both and remove from path_elements if necessary
        if 'src' in path_elements and 'src' in app_source_parts:
            src_index = path_elements.index('src')
            path_elements = path_elements[src_index + 1:]
            
        # Append .js extension to the last element if not already present
        if not path_elements[-1].endswith('.js'):
            path_elements[-1] += '.js'

        constructed_path = os.path.join(self.app_config['APP_SOURCE_DIR'], *path_elements)
        
        print(f"Constructed path: {constructed_path}")
        return constructed_path