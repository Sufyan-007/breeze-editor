from common.utils.config_reader import read_config_file, read_file_json, write_file
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
import json
from common.utils.file_helper import create_parent_dir_if_not_exists



class ConfigService():
    app_config = {}
    def __init__(self,project_name):
        # self.project_name = project_name
        self.app_config_dir = f"{CONFIG_PATH}/{project_name}"
        self.app_config['APP_CONFIG_PATH'] = f"{CONFIG_PATH}/{project_name}"
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
    
    def get_component_configs(self):
        page_list = { x.get("component",None)  for x in self.routing_config["routes"]}
        page_list.discard(None)
        pages = {}
        custom_components = {}
        for x in self.comp_config:
            if x in page_list:
                pages[x] = self.comp_config[x]
            else:
                custom_components[x] = self.comp_config[x]
        return {"pages":pages,"custom_components":custom_components}