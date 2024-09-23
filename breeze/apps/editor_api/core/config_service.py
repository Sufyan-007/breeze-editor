from common.utils.config_reader import read_config_file, read_file_json, write_file
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
import json
from common.utils.file_helper import create_parent_dir_if_not_exists
from apps.directory_management.core.directory_management_service import DirectoryManager


class ConfigService():
    app_config = {}
    def __init__(self,project_name):
        self.project_name = project_name
        self.app_config_dir = f"{CONFIG_PATH}/{project_name}"
        self.app_config['APP_CONFIG_PATH'] = f"{CONFIG_PATH}/{project_name}"
        self.directory_manager = DirectoryManager(project_name)
        self.read_config()

    def read_config(self):
        self.app_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        self.app_config['APP_SOURCE_DIR'] = f"{self.app_config['path']}/{self.app_config['name']}/{self.app_config['components_src_dir']}"
        self.app_config['APP_CONFIG_PATH'] = self.app_config_dir
        # Read config of component written in component_config file
        self.comp_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['COMPONENT_CONFIG'])
        # Read component config from different files and prepare map of config for all 
        # self.prepare_comp_config()
        self.context_comp_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['CONTEXT_COMPONENT_CONFIG'])
        self.reducer_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['REDUCER_CONFIG'])
        self.redux_store_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['REDUX_STORE_CONFIG'])
        self.app_config['MAPPINGS'] = {}
        self.app_config['CSS_CONFIG'] = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['CSS_CONFIG'])
        # self.prepare_path_mappings() 
        self.routing_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['ROUTING_CONFIG'])
    
    def get_all_component_configs(self):
        page_list = { x.get("component",None)  for x in self.routing_config["routes"].values()}
        page_list.discard(None)
        pages = {}
        custom_components = {}
        for x in self.comp_config:
            if x in page_list:
                pages[x] = self.comp_config[x]
            else:
                custom_components[x] = self.comp_config[x]
        return {"pages":pages,"custom_components":custom_components}
    
    def get_component_config(self,componentName):
        print(componentName)
        comp= self.comp_config[componentName]
        comp["containingFile"] = self.directory_manager.get_path_from_file_id(comp["file_id"],relative_path=True)
        return comp
    
    def get_file_path(self):
        directory_manager = DirectoryManager(self.project_name)
        file_paths = {}
        # Check if comp_config is a dictionary and contains components
        if isinstance(self.comp_config, dict):
            for component_id, config in self.comp_config.items():
                try:
                    # Extract file_id for the component
                    file_id = config.get("file_id")
                    if file_id:
                        # Get file path from file_id
                        file_path = directory_manager.get_path_from_file_id(file_id)
                        if file_path:
                            # Find the position of 'src/' and extract the path from there
                            src_index = file_path.find('src/')
                            if src_index != -1:
                                relative_path = file_path[src_index:]
                                file_paths[component_id] = relative_path
                            else:
                                file_paths[component_id] = "src not found in path"
                        else:
                            file_paths[component_id] = "file_path not found"
                    else:
                        file_paths[component_id] = "file_id not found"
                except Exception as e:
                    print(f"Error getting file path for component {component_id}: {e}")
                    file_paths[component_id] = "error retrieving file path"

        else:
            print("Invalid component configuration")
            file_paths["error"] = "Invalid component configuration"

        return file_paths



