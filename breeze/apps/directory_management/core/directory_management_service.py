import json
import uuid
import os
from common.utils.app_consts import CONFIG_PATH
from rest_framework.views import APIView
from apps.editor_api.core.app_editor import AppEditor

class DirectoryManagementGenerator:
    def __init__(self,project_name):
        self.project_name = project_name
        self.app_config_dir = f"{CONFIG_PATH}/{project_name}"
        self.app_editor = AppEditor(project_name)  #create an instamce of AppEditor
        self.directory_config_path= os.path.join(CONFIG_PATH, self.project_name, 'directory_management.json')
        self.component_config_path = os.path.join(CONFIG_PATH, self.project_name, 'component_config.json')
    def create_parent_dir_if_not_exists(self,directory):
        if not os.path.exists(directory):
            os.makedirs(directory)
  
    def save_file(self, file_id, file_name, is_directory):
        
        self.app_editor.reload_config()
        # Get the path using get_path_from_file_id
        constructed_final_path = self.app_editor.get_path_from_file_id(file_id)
        
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
        print(
              parent_id,"2",
              node_type,"3",
              tag,"4",
              "see the values ")
        config_path = os.path.join(CONFIG_PATH, self.project_name, 'directory_management.json')
        print(config_path,"config path")
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
            
            old_path = self.app_editor.get_path_from_file_id(node_id)
            
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
                self.app_editor.reload_config()
            
                print(old_path,"old_path")
                new_path = os.path.join(os.path.dirname(old_path), new_name)
                print(new_path,"new_path")
                os.rename(old_path, new_path)
                print(f"Renamed from {old_path} to {new_path}")
                
                return {'status': 'success', 'message': 'Node renamed successfully', 'config': config_data}
            else:
                return {'status': 'error', 'message': 'Node not found'}
        except Exception as e:
            return {'status': 'error', 'message': str(e)}