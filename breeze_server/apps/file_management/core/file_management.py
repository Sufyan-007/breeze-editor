from ...directory_management.core.directory_management_service import DirectoryManager
import uuid
from ...common.utils.file_helpers.config_handler import write_config_file,read_config_file
from ...common.utils.file_helpers.file_handler import create_parent_dir_if_not_exists
from ...common.constants.enums.ResourceCategory import ResourceCategory
from ...code_generator.utils.function_ast_parser import FunctionParser
from copy import deepcopy
from ...code_generator.utils.import_helper import ImportHelper
import uuid
from ...code_generator.utils.code_indexing import get_code_index
import pickle
from apps.common.constants.consts import CONFIG_PATH
from apps.code_generator.utils.static_configs import TEMPLATE_CODE_FILE, TEMPLATE_COMP_CONFIG
from apps.common.utils.replace_variable import replace_variable
from apps.common.utils.uuid_as_key import generate_uuid_as_key

from apps.entity_management.core.entity_management import EntityManager

def get_section_from_flattened_index(flattened_index, config, configMeta):
    if flattened_index not in configMeta:
        return None
    
    index_string = configMeta[flattened_index]['index']
    
    parts = index_string.split("<>")
    
    current_section = config
    for part in parts:
        if part in current_section:
            current_section = current_section[part]
        elif part.isdigit():  
            current_section = current_section[int(part)]
        else:
            return None  
    
    return current_section


def set_value_in_flattened_index(flattened_index, value, config, configMeta):
    
    if flattened_index not in configMeta:
        return False
    
    index_string = configMeta[flattened_index]['index']
    
    parts = index_string.split("<>")
    
    
    current_section = config
    for part in parts[:-1]: 
        if part.isdigit():  
            part = int(part)
            while len(current_section) <= part:
                current_section.append({})
            current_section = current_section[part]
        elif part in current_section:
            current_section = current_section[part]
        else:
            current_section[part] = {}
            current_section = current_section[part]
    
    last_part = parts[-1]
    if last_part.isdigit():
        last_part = int(last_part)

    if isinstance(current_section, dict):
        current_section[last_part] = value
        return True

    elif isinstance(current_section, list):
        while len(current_section) <= last_part:
            current_section.append(None)
        current_section[last_part] = value
        return True

    return False  



def add_statement(projectId,fileId,parentId,statement):
    fileConfig = read_config_file(
        project_name=projectId,
        category=ResourceCategory.CODE_FILE.value,
        filename=fileId
    )["data"]
    fileConfigMeta = read_config_file(
        project_name=projectId,
        category=ResourceCategory.CODE_FILE.value,
        filename=fileId+"_meta"
    )["data"]
    
    try:
        parentConfigMeta = fileConfigMeta[parentId]
    except:
        raise KeyError("Could not find key %s" % parentId)
    
    
    parentConfig = get_section_from_flattened_index(parentId,fileConfig,fileConfigMeta)
    
    if parentConfig["type"] != "BLOCK" and parentConfig["type"] != "Element":
        raise TypeError("Cannot add statement to non block elements")
    
    
    
    id = str(uuid.uuid4())
    statement["id"] = id
    
    parentIndex = parentConfigMeta["index"]
    
    if parentConfig["type"] == "BLOCK":
        newIndex = parentIndex+"<>statements<>"+str(len(parentConfig["statements"]))
    elif parentConfig["type"] == "Element":
        newIndex = parentIndex+"<>children<>"+str(len(parentConfig["children"]))
    newMeta = {
        "index": newIndex,
        "type": "RAW"
    }
    
    fileConfigMeta[id] = newMeta
    
    if not set_value_in_flattened_index(id,statement,fileConfig,fileConfigMeta):
        raise Exception("Could not add statement")
        
    
    generate_file_code(projectId=projectId,fileId=fileId,config=fileConfig)
    
    write_config_file(
        project_name=projectId,
        category=ResourceCategory.CODE_FILE.value,
        filename=fileId,
        json_data=fileConfig
    )
    
    return {"id": id}

def update_statement(projectId,fileId,statementId,statement):
    fileConfig = read_config_file(
        project_name=projectId,
        category=ResourceCategory.CODE_FILE.value,
        filename=fileId
    )["data"]
    fileConfigMeta = read_config_file(
        project_name=projectId,
        category=ResourceCategory.CODE_FILE.value,
        filename=fileId+"_meta"
    )["data"]
    
    try:
        configMeta = fileConfigMeta[statementId]
    except:
        raise KeyError("Could not find key %s" % statementId)

    if not set_value_in_flattened_index(statementId,statement,fileConfig,fileConfigMeta):
        raise Exception("Could not update statement %s" % statementId)

    generate_file_code(projectId=projectId,fileId=fileId,config=fileConfig)
    
    write_config_file(
        project_name=projectId,
        category=ResourceCategory.CODE_FILE.value,
        filename=fileId,
        json_data=fileConfig
    )
    
    return {}

def get_config_by_tag(tag,fileName,entityId):
    if tag == "COMPONENTS":
        file_config = deepcopy(TEMPLATE_COMP_CONFIG)
        replace_variable(file_config,"DEFAULT_COMP_ID",entityId)
        replace_variable(file_config,"DEFAULT_COMP_NAME",fileName)
    elif tag == "CODE_FILE":
        file_config = deepcopy(TEMPLATE_CODE_FILE)
    else:
        raise NotImplementedError()
    file_config["name"] = fileName
    return file_config

def add_code_file(projectId, fileName, parentId, file_id=None,  tag="CODE_FILE", entity_id=None, transaction_id=None):
    if file_id is None:
        file_id = generate_uuid_as_key()
    if not parentId:
        parentId = "ROOT"
    if not entity_id:
        entity_id = file_id

    directoryManager = DirectoryManager(projectId)
    node = directoryManager.add_node_to_config(
        parent_id=parentId,
        tag=tag,
        name=fileName,
        node_type="FILE",
        ext="SX",
        file_id=file_id,
        entity_id=entity_id
    )
   
    file_config = get_config_by_tag(tag, fileName, entity_id)
    generate_file_code(
        projectId=projectId,
        fileId=file_id,
        config= file_config
    )
    
    write_config_file(
        project_name=projectId,
        category=ResourceCategory.CODE_FILE.value,
        filename=file_id,
        json_data=file_config,
        transaction_id=transaction_id
    )
    
    
    return node
    
    
def update_code_file(projectId, fileId, config, transaction_id=None):
    
    generate_file_code(projectId, fileId, config)
    
    write_config_file(
        project_name=projectId,
        category=ResourceCategory.CODE_FILE.value,
        filename=fileId,
        json_data=config,
        transaction_id=transaction_id
    )
    
    return {}

def generate_file_code(projectId,fileId,config):
    functionParser = FunctionParser(projectId=projectId)
    code,tree = functionParser.generate_statement_code(config["BLOCK"],["BLOCK"])
    
    generated_imports = functionParser.get_generated_imports()
    
    meta_config = functionParser.get_meta_config()
    
    imports = deepcopy(config["IMPORTS"])
    #get imported entitie's ids and add current entity's id to its usedIn array in the entity config
    # id(entityId: string) : {type: string, fileId: string, dataType, usedIn: [](add current entity's id)}
    
    imports["other"].extend(generated_imports["other"])
    imports["components"].extend(generated_imports["components"])
    
    imports,importTree = ImportHelper.generate_imports_code(imports,projectId, fileId)
    
    export_statements = ""
    
    entityManager = EntityManager(projectId=projectId)
    
    
    if config["EXPORTS"].get("default"):
        entityId = config["EXPORTS"].get("default")
        exportEntity = meta_config[entityId]
        
        entityManager.add_or_update_entity(
            entityId=entityId,
            fileId = fileId,
            exportedAs= exportEntity["name"],
            type= exportEntity.get("type","NA"),
            defaultExport=True
        )
        
        export_statements = f'export default {exportEntity["name"]} ;'
    
    namedExports = []
    for exportId in config["EXPORTS"].get("others"):
        exportEntity = meta_config[exportId]
        entityManager.add_or_update_entity(
            entityId=exportId,
            fileId = fileId,
            exportedAs= exportEntity["name"],
            type= exportEntity.get("type","NA"),
            defaultExport=False
        )
        
        namedExports.append(exportEntity["name"])
        
    if namedExports:
        export_statements += f"export {{ {', '.join(namedExports)} }}"
    
    code  =f"""
        {imports}
        {code}
        {export_statements}
    """
    
    
    directoryManager = DirectoryManager(projectId)
    directoryManager.save_file(file_id=fileId,content=code,formatted=True)
    
    content = directoryManager.get_file_content(fileId)
    
    code_tree = get_code_index(importTree+[tree], content, meta_config)
    
    write_config_file(
        project_name=projectId,
        category=ResourceCategory.CODE_FILE.value,
        filename=fileId+"_meta",
        json_data=meta_config
    )
    pickle_dir = f"{CONFIG_PATH}/{projectId}/pickles/{fileId}.bytes"
    create_parent_dir_if_not_exists(pickle_dir)
    with open(pickle_dir,"wb") as file:
        pickle.dump(code_tree, file)
    
def get_statement_config(projectId,fileId,statementId):
    fileConfig = read_config_file(
        project_name=projectId,
        category=ResourceCategory.CODE_FILE.value,
        filename=fileId
    )["data"]
    fileConfigMeta = read_config_file(
        project_name=projectId,
        category=ResourceCategory.CODE_FILE.value,
        filename=fileId+"_meta"
    )["data"]
    
    try:
        configMeta = fileConfigMeta[statementId]
    except:
        raise KeyError("Could not find key %s" % statementId)
    
    config = get_section_from_flattened_index(statementId,fileConfig,fileConfigMeta)
    
    
    return {"config":config,"configMeta":configMeta}