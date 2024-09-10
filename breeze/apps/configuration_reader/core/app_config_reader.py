from apps.configuration_reader import COMPONENTS_CONFIG, COMPONENTS_LIST
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH, THIRD_PARTY_CONFIG_PATH
from common.utils.config_reader import read_config_file
import os, json, re
class AppConfigReader:
    def __init__(self):
        pass
    
    def get_components(self, project_config):
        print(project_config,"project_config")
        global COMPONENTS_LIST
        project = project_config['project_id']

         
        comp_list = {
            "THIRD_PARTY" : self.get_third_party_component_list(project), 
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
    
    def get_latest_version(self,folder_path):
        versions = []
        for folder_name in os.listdir(folder_path):
            match = re.match(r".*__(\d+)", folder_name)
            if match:
                versions.append(int(match.group(1)))
        return max(versions) if versions else None

    def get_third_party_component_list(self,projectId):
            final_result= {}
            
            project_config_path= os.path.join(CONFIG_PATH,projectId)
            app_basic_config= read_config_file(project_config_path,CONFIG_FILES_PATH['APP_CONFIG'])
            
            
            #extract the dependencies from app_basic_config
            project_dependencies= app_basic_config.get('dependencies',{})        
            
            for dependency_name, version in project_dependencies.items():
            
                # If version is '*', find the latest version
                if version == '*':
                    lib_folder_path = os.path.join(THIRD_PARTY_CONFIG_PATH, "libs")
                    version = self.get_latest_version(lib_folder_path)
                    if version is None:
                        continue  # Skip if no valid version is found
                    
                # Format the folder name according to the library and version
                folder_name = f"{dependency_name}__{version}"
           
                
                third_party_folder_path = os.path.join(THIRD_PARTY_CONFIG_PATH, "libs", folder_name)
                comp_file_path = os.path.join(third_party_folder_path, "component", "__component.json")
            
                # Check if the component file exists
                if os.path.exists(comp_file_path):
                    try:
                        with open(comp_file_path, 'r') as file:
                            components = json.load(file)
                            
                            # Format the components for the final result
                            component_list = [
                                {"name": comp_name, "id": f"{dependency_name}_{comp_name}"}
                                for comp_name in components.keys()
                            ]
                        
                            final_result[dependency_name] = component_list
                        
                    except Exception as e:
                        return {"error": str(e)}
            
            return final_result
        
    # def get_component_config(self, data):
    #     print(data,"data")
    #     global COMPONENTS_CONFIG
    #     comp_id = data['component_id']
    #     print(comp_id,"comp_id")
    #     comp_type = data['component_type'] 
        
    #     if comp_type == 'THIRD_PARTY':
    #         tp_id = data['third_party_id']
    #         return COMPONENTS_CONFIG['THIRD_PARTY'][tp_id][comp_id]
    #     elif comp_type == 'CUSTOM':
    #         project_id = data['project_id']
    #         return COMPONENTS_CONFIG['CUSTOM'][project_id][comp_id]
    #     else:
    #         return COMPONENTS_CONFIG['HTML'][comp_id]    
    
    def get_component_config(self, data):
        comp_id = data['component_id']
        print(comp_id,"comp_id")
        comp_type = data['component_type']
        print(comp_type,"comp_type")

        if comp_type == 'THIRD_PARTY':
            tp_id = data['third_party_id'] #this is the library eg react-bootstrap
            print(tp_id,"third party id")
            # Construct the path to the third-party component's config file
            third_party_folder_path = os.path.join(THIRD_PARTY_CONFIG_PATH, "libs")
            comp_file_path = os.path.join(third_party_folder_path, tp_id,  "component", f"{comp_id}.json")
            
            if os.path.exists(comp_file_path):
                try:
                    with open(comp_file_path, 'r') as file:
                        component_config = json.load(file)
                        return component_config
                except Exception as e:
                    return {"error": f"Failed to load component config: {str(e)}"}
            else:
                return {"error": f"Component config for {comp_id} not found in {tp_id}"}
        
        elif comp_type == 'CUSTOM':
            project_id = data['project_id']
            return COMPONENTS_CONFIG['CUSTOM'][project_id][comp_id]
        
        else:
            return COMPONENTS_CONFIG['HTML'][comp_id]

        