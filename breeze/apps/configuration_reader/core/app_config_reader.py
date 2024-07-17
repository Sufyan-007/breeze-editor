from apps.configuration_reader import COMPONENTS_CONFIG, COMPONENTS_LIST
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
from common.utils.config_reader import read_config_file
import os
class AppConfigReader:
    def __init__(self):
        pass
    
    def get_components(self, project_config):
        global COMPONENTS_LIST
        project = project_config['project_id']

         
        comp_list = {
            "THIRD_PARTY" : COMPONENTS_LIST["THIRD_PARTY"],
            "CUSTOM" : self.get_custom_component_list(project),
            "HTML" : COMPONENTS_LIST["HTML"]
        }

        return comp_list
    
    def get_custom_component_list(self, projectId):
        components = []
        try:
            project_config_path= os.path.join(CONFIG_PATH,projectId)
            comp_config = read_config_file(project_config_path, CONFIG_FILES_PATH['COMPONENT_CONFIG'])
            for id in comp_config:
                components.append({'name':comp_config[id]['name'],'id':id})
        except:
            pass
        return components

    def get_component_config(self, data):
        global COMPONENTS_CONFIG
        comp_id = data['component_id']
        comp_type = data['component_type'] 

        if comp_type == 'THIRD_PARTY':
            tp_id = data['third_party_id']
            return COMPONENTS_CONFIG['THIRD_PARTY'][tp_id][comp_id]
        elif comp_type == 'CUSTOM':
            project_id = data['project_id']
            return COMPONENTS_CONFIG['CUSTOM'][project_id][comp_id]
        else:
            return COMPONENTS_CONFIG['HTML'][comp_id]    

