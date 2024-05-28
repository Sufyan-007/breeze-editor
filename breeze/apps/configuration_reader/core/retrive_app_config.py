from common.consts.consts import CONFIG_FILES_PATH, APP_CONFIG_PATH
from common.utils.file_helper import read_json_file, write_file, create_parent_dir_if_not_exists
import json
from common.utils.request_code import REQUEST
from ...code_generator.core.generate_project import GenerateProject

class RetriveAppConfig:
    def __init__(self):
        pass
    
    def get_comp_config(self, app_name,component_key,entity=None):
        app_config_dir = f"{APP_CONFIG_PATH}/{app_name}"
        comp_config = {}
        comp_config_path = f"{app_config_dir}/{CONFIG_FILES_PATH['COMPONENT_CONFIG']}"
        resp = {
            "error" : False,
            "data" : {}
        }
        # Read old config
        try:
            comp_config = read_json_file(comp_config_path)
        except FileNotFoundError as e:
            print(e)
            comp_config = {}
        config = comp_config.get(component_key,{})
        if entity == None:
            resp["data"] = config
        else:
            if entity in ["html","stateVars","functions","imports","hooks","propsVars","otherVars"]:
                resp["data"] = config.get(entity,config)
            else:
                resp["error"] = True
                resp["message"] ="Invalid entity name"
        return resp        
    
    def get_components(self, app_name,):
        app_config_dir = f"{APP_CONFIG_PATH}/{app_name}"
        comp_config = {}
        components = []
        comp_config_path = f"{app_config_dir}/{CONFIG_FILES_PATH['COMPONENT_CONFIG']}"
        resp = {
            "error" : False,
            "data" : {}
        }
        # Read old config
        try:
            comp_config = read_json_file(comp_config_path)
        except FileNotFoundError as e:
            resp["error"] = True
            resp["message"] ="File not found"
            print(e)
            comp_config = {}
        for com_key,config in comp_config.items():
            components.append({
                "name" : com_key,
                "id" : config.get("id","")

            })
        resp["data"] = components
        return resp        
    
    def get_state_variables(self, app_name,component_key):
        app_config_dir = f"{APP_CONFIG_PATH}/{app_name}"
        comp_config = {}
        comp_config_path = f"{app_config_dir}/{CONFIG_FILES_PATH['COMPONENT_CONFIG']}"
        resp = {
            "error" : False,
            "data" : {}
        }
        # Read old config
        try:
            comp_config = read_json_file(comp_config_path)
        except FileNotFoundError as e:
            print(e)
            comp_config = {}
        config = comp_config.get(component_key,{})
        data = config.get("stateVars",config)
        variables = {}
        for var in data:
            if var.get("type") == "OBJECT":
                variables[var.get("name")] = {
                        "type" : var.get("type"),
                        "root" : True,
                        "name" : var.get("name"),
                        "id" : var.get("$id")
                }
                for key,val in var.get("defaultValue",{}).items():
                    variables[key] = {
                        "type" : str(type(val)),
                        "root" : False,
                        "name" : key,
                        "parent" : var.get("type")
                        
                    }
            else:
                variables[var.get("name")] = {
                        "type" : var.get("type"),
                        "root" : True,
                        "name" : var.get("name"),
                        "id" : var.get("$id")
                }
        resp["data"] = variables
        return resp        