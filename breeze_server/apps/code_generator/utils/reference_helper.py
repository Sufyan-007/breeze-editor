from ...common.utils.file_helpers.config_handler import read_config_file
from ...common.constants.enums.ResourceCategory import ResourceCategory 
def resolve_ref(projectId,entityType,entityId,extras={}):
    if entityType == "COMPONENT":
        conf = read_config_file(project_name=projectId, category=ResourceCategory.COMPONENTS.value,filename=entityId)
        return list(conf["data"].values())[0]
    else:
        raise NotImplementedError("Unknown/not implemented type ")