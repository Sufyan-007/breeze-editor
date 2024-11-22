from ...directory_management.core.directory_management_service import DirectoryManager
import uuid
from ...common.utils.file_helpers.config_handler import write_config_file,read_config_file
from ...common.constants.enums.ResourceCategory import ResourceCategory
from ...code_generator.utils.function_ast_parser import FunctionParser
from copy import deepcopy
from ...code_generator.utils.import_helper import ImportHelper
import uuid

TEMPLATE_CODE_FILE = {
    "IMPORTS":{
      "other":[],
      "components":[],  
    },
    "BLOCK":{
        "type": "BLOCK",
        "noWrap": 1,
        "statements": [
            {
                "type" : "COMMENT",
                "text" : " Happy coding!!"
            }
                
                
            
        ]
    },
    "EXPORTS":{
        "default":None,
        "others":[]
    }

}

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
    
    if parentConfig["type"] != "BLOCK":
        raise TypeError("Cannot add statement to non block elements")
    
    
    
    id = str(uuid.uuid4())
    statement["id"] = id
    
    parentIndex = parentConfigMeta["index"]
    
    newIndex = parentIndex+"<>statements<>"+str(len(parentConfig["statements"]))
    
    newMeta = {
        "index": newIndex,
        "type": "RAW"
    }
    
    fileConfigMeta[id] = newMeta
    
    set_value_in_flattened_index(id,statement,fileConfig,fileConfigMeta)
    
    generate_file_code(projectId=projectId,fileId=fileId,config=fileConfig)
    
    write_config_file(
        project_name=projectId,
        category=ResourceCategory.CODE_FILE.value,
        filename=fileId,
        json_data=fileConfig
    )
    
    return {}

def add_code_file(projectId, fileName,parentId):
    if not parentId:
        parentId = "ROOT"
        
    fileId = str(uuid.uuid4())

    directoryManager = DirectoryManager(projectId)
    node = directoryManager.add_node_to_config(
        parent_id=parentId,
        tag="CODE_FILE",
        name=fileName,
        node_type="FILE",
        ext="SX",
        file_id=fileId,
        entity_id=fileId
    )
    
    generate_file_code(projectId=projectId,fileId=fileId,config=TEMPLATE_CODE_FILE)
    
    write_config_file(
        project_name=projectId,
        category=ResourceCategory.CODE_FILE.value,
        filename=fileId,
        json_data=TEMPLATE_CODE_FILE
    )
    
    
    return node
    
    
def update_code_file(projectId, fileId, config):
    
    generate_file_code(projectId, fileId, config)
    
    write_config_file(
        project_name=projectId,
        category=ResourceCategory.CODE_FILE.value,
        filename=fileId,
        json_data=config
    )
    
    return {}

def generate_file_code(projectId,fileId,config):
    functionParser = FunctionParser(projectId=projectId)
    code,tree = functionParser.generate_statement_code(config["BLOCK"],["BLOCK"])
    
    generated_imports = functionParser.get_generated_imports()
    
    meta_config = functionParser.get_meta_config()
    
    imports = deepcopy(config["IMPORTS"])
    
    imports["other"].extend(generated_imports["other"])
    imports["components"].extend(generated_imports["components"])
    
    imports,tree = ImportHelper.generate_imports_code(imports,projectId)
    
    export_statements = ""
    
    if config["EXPORTS"].get("default"):
        export_statements = f"export default {config['EXPORTS'].get('default')} ;" 
    
    if config["EXPORTS"].get("others"):
        export_statements += f"export {{ {', '.join(config['EXPORTS'].get('others'))} }}"
    
    code  =f"""
        {imports}
        {code}
        {export_statements}
    """
    
    write_config_file(
        project_name=projectId,
        category=ResourceCategory.CODE_FILE.value,
        filename=fileId+"_meta",
        json_data=meta_config
    )
    
    directoryManager = DirectoryManager(projectId)
    directoryManager.save_file(file_id=fileId,content=code,formatted=True)
    
    
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