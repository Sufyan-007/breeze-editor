from ...directory_management.core.directory_management_service import DirectoryManager
import uuid
from ...common.utils.file_helpers.config_handler import write_config_file,read_config_file
from ...common.constants.enums.ResourceCategory import ResourceCategory
from ...code_generator.utils.function_ast_parser import FunctionParser
from copy import deepcopy
from ...code_generator.utils.import_helper import ImportHelper


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
                "text" : " Happy coding!"
            }
        ]
    },
    "EXPORTS":{
        "default":None,
        "others":[]
    }

}
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
    code = functionParser.generate_statement_code(config["BLOCK"])
    
    generated_imports = functionParser.get_generated_imports()
    
    imports = deepcopy(config["IMPORTS"])
    
    imports["other"].extend(generated_imports["other"])
    imports["components"].extend(generated_imports["components"])
    
    imports,tree = ImportHelper.generate_imports_code(imports)
    
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
    directoryManager = DirectoryManager(projectId)
    directoryManager.save_file(file_id=fileId,content=code,formatted=True)
    