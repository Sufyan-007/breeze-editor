import os,json, re
from common.utils.app_consts import THIRD_PARTY_CONFIG_PATH, CONFIG_FILES_PATH, CONFIG_PATH
from common.utils.config_reader import read_config_file

class ThirdPartyComponents:
    def __init__(self):
        pass 
    
    def get_latest_version(self,library_name):
        libs_path = os.path.join(THIRD_PARTY_CONFIG_PATH, 'libs')
        folders = os.listdir(libs_path)
        versions = []

        # Pattern to match folder names with version
        pattern = re.compile(rf"^{re.escape(library_name)}__(\d+)$")

        for folder in folders:
            match = pattern.match(folder)
            if match:
                versions.append(int(match.group(1)))

        if versions:
            # Return the highest version number
            return max(versions)
        else:
            # No versioned folders found, return None
            return None
    
    def get_third_party_components(self, library, lib_version=None):
        # Determine the folder name based on the version
        if not lib_version:
            latest_version = self.get_latest_version(library)
            if latest_version is not None:
                folder_name = f"{library}__{latest_version}"
        else:
            folder_name = f"{library}__{lib_version}"
        
        # Construct the path to the __component.json file
        folder_path = f"{THIRD_PARTY_CONFIG_PATH}/libs/{folder_name}"
        component_file_path = os.path.join(folder_path, "component", "__component.json")
        print(component_file_path,"components file path")
        # Check if the file exists
        if not os.path.exists(component_file_path):
            return {"error": "File not found."}, 404
        
        # Read and parse the JSON file
        try:
            with open(component_file_path, 'r') as file:
                components = json.load(file)
        except Exception as e:
            return {"error": str(e)}, 500
     
        component_names = list(components.keys())
        return {"components": component_names}, 200
        
    def get_third_party_component_config(self, library, component_name, lib_version=None):
        # If lib_version is not provided, get the latest version
        if lib_version is None:
            lib_version = self.get_latest_version(library)
            if lib_version is None:
                return {"error": "Library version not found."}, 404
            
        # Construct the folder name and path based on the library and version
        folder_name = f"{library}__{lib_version}"
        folder_path = os.path.join(THIRD_PARTY_CONFIG_PATH, 'libs', folder_name)
        print(folder_path,"folder path")
        # Load the __component.json file to get the path to the component
        components_json_path = os.path.join(folder_path,"component", '__component.json')
        print(components_json_path,"components json path")
        
        if not os.path.exists(components_json_path):
            return {"error": "__component.json file not found."}, 404
        
        try:
            with open(components_json_path, 'r') as file:
                components_data = json.load(file)
        except Exception as e:
            return {"error": f"Failed to load __component.json: {str(e)}"}, 500
        
        # Get the full path from the __component.json file
        full_component_path = components_data.get(component_name)
        
        if not full_component_path:
            return {"error": "Component not found in __component.json."}, 404
        
        # Extract the relevant part of the path
        relative_component_path = full_component_path.split(f"libs/{library}__{lib_version}/")[-1]
        
        component_file_path = os.path.join(folder_path, relative_component_path)
        
        # Check if the component config file exists
        if not os.path.exists(component_file_path):
            return {"error": "Component file not found."}, 404
        
        # Read and return the component configuration
        try:
            with open(component_file_path, 'r') as file:
                component_config = json.load(file)
            return {"component_config": component_config}, 200
        except Exception as e:
            return {"error": f"Failed to load component config: {str(e)}"}, 500
        
    def get_project_lib_list(self, projectId):
        project_config_path = os.path.join(CONFIG_PATH, projectId)
        config_file_name = CONFIG_FILES_PATH['APP_CONFIG']
        app_basic_config = read_config_file(project_config_path, config_file_name)
        
        # Extract dependencies and initialize dependency list
        dependency_list = [
            {'name': dependency_name, 'version': version}
            for dependency_name, version in app_basic_config.get('dependencies', {}).items()
        ]
        
        # Path to the extracted_zip_files directory
        extracted_zip_path = os.path.join(CONFIG_PATH, projectId, "extracted_zip_files")
        
        # Append each zip file as a separate object in the dependency list
        if os.path.exists(extracted_zip_path):
            dependency_list.extend(
                {'name': folder_name, 'type': 'uploaded_zip_file'}
                for folder_name in os.listdir(extracted_zip_path)
                if os.path.isdir(os.path.join(extracted_zip_path, folder_name))
            )
        
        return dependency_list
    
    def get_components_from_zip(self,zip_file, project_id):
        zip_file_path = os.path.join(CONFIG_PATH, project_id, "extracted_zip_files",zip_file,"components")
            
        if os.path.exists(zip_file_path):
            components= []
            
            for component in os.listdir(zip_file_path):
                components.append({"name":component, "id":f"{zip_file}_{component}"})
            
            return {"components":components}, 200
        else:
            return{"error":"zip file not found"}, 404
        
    
    def get_component_config_from_zip(self, zip_file, project_id, component_name):
        try:
           
            base_path = os.path.join(CONFIG_PATH, project_id, 'external_project_configs', zip_file)

            # Path to the __component.json file
            component_json_path = os.path.join(base_path, 'component', '__component.json')
            
          
            if not os.path.exists(component_json_path):
                return {"error": "__component.json file not found."}, 404

        
            with open(component_json_path, 'r') as file:
                component_map = json.load(file)

            component_path = component_map.get(component_name)
            if not component_path:
                return {"error": f"Component {component_name} not found in __component.json."}, 404

           
            if not os.path.exists(component_path):
                return {"error": "Component file not found."}, 404

            # Read and return the component's JSON configuration
            with open(component_path, 'r') as component_file:
                component_config = json.load(component_file)

            return {"component_config": component_config}, 200

        except Exception as e:
            return {"error": str(e)}, 500