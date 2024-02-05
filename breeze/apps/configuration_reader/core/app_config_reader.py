from apps.configuration_reader import COMPONENTS_CONFIG, COMPONENTS_LIST

class AppConfigReader:
    def __init__(self):
        pass
    
    def get_components(self, project_config):
        global COMPONENTS_LIST
        project = project_config['project_id']

        if COMPONENTS_LIST["CUSTOM"].get(project, None) is None:
            raise Exception("Project not found")
         
        comp_list = {
            "THIRD_PARTY" : COMPONENTS_LIST["THIRD_PARTY"],
            "CUSTOM" : COMPONENTS_LIST["CUSTOM"][project],
            "HTML" : COMPONENTS_LIST["HTML"]
        }

        return comp_list

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

