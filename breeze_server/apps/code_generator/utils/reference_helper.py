from ...common.utils.file_helpers.config_handler import read_config_file
from ...common.constants.enums.ResourceCategory import ResourceCategory 
from ...common.constants.consts import CLIENT_API, CONFIG_PATH
from ...common.utils.variable_name_convertor import convert_to_valid_variable_name
import json 

def resolve_ref(projectId,entityType,entityId,extras={}):
    if entityType == "COMPONENT":
        conf = read_config_file(project_name=projectId, category=ResourceCategory.COMPONENTS.value,filename=entityId)
        # will need to get code_file category later
        # conf = read_config_file(project_name=projectId, category=ResourceCategory.CODE_FILE.value,filename=entityId)
        return list(conf["data"].values())[0]
    
    
    elif entityType == "SERVICE":
        file_path = f"{CONFIG_PATH}/{projectId}/{CLIENT_API}/{extras['moduleId']}/{extras['fileId']}.json"
        with open(file_path) as file:
            file_config= json.load(file) 
        conf = file_config[entityId]
        conf["fileId"] = extras['fileId']
        conf["name"] = convert_to_valid_variable_name(conf["operation_id"])
        return conf
    else:
        raise NotImplementedError("Unknown/not implemented type ")