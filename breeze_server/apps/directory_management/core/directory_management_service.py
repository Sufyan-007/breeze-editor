import json
import uuid, shutil
import os
from apps.common.constants.consts import CONFIG_FILES_PATH
from apps.common.constants.consts import CONFIG_PATH
from apps.common.utils.file_helpers.dir_handler import create_parent_dir_if_not_exists
from apps.common.utils.formatter import format_by_prettier
from apps.common.utils.file_helpers.json_handler import read_project_config_file
class DirectoryManager:
    def __init__(self,project_name):
        self.project_name = project_name
        self.app_config_dir = f"{CONFIG_PATH}/{project_name}"
        self.directory_config_path= os.path.join(CONFIG_PATH, self.project_name, 'directory_management.json')
        self.component_config_path = os.path.join(CONFIG_PATH, self.project_name, 'component_config.json')
        self.app_config = read_project_config_file(self.app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        self.app_config['APP_SOURCE_DIR'] = f"{self.app_config['path']}/{self.app_config['components_src_dir']}"
        self.directory_management_config = read_project_config_file(self.app_config_dir, CONFIG_FILES_PATH['DIRECTORY_MANAGEMENT'])
        self.language = self.app_config.get('language',"javascript")
        self.isTypeScript = self.language == 'typescript'

    def save_file(self, file_id, content,formatted=True):
        path = self.get_path_from_file_id(file_id)
        create_parent_dir_if_not_exists(path)
        if formatted:
            content = format_by_prettier(content)
        with open(path, 'w') as f:
            f.write(content)


    def add_node_to_config(self, parent_id, tag,name, node_type="FILE",ext="", file_id=None, entity_id = "",isProtected=False):
        
        parent_node = self.directory_management_config.get(parent_id,None)
        
        if not parent_node:
            raise IndexError("Given parent id does not exist")
        
        if parent_node["type"] != "DIRECTORY":
            raise NotADirectoryError("Parent is not a directory")
        
        if parent_node.get("isProtected",False) :
            raise PermissionError()
        
        parent_dir = self.get_path_from_file_id(parent_node["id"])
        
        fullName = name
        
        if node_type == "FILE":
            if not ext:
                _ = name.split(".")
                if len(_) > 1:
                    name,ext = ".".join(_[0:-1]), _[-1]
                    
            ex = ("tsx" if self.isTypeScript else "jsx") if ext=="SX" else ext
            fullName = name + "." + ex
        
        if fullName in os.listdir(parent_dir):
            raise FileExistsError("Given file name already exists")
        
        
        if file_id:
            new_id= file_id
        else:
            new_id = str(uuid.uuid4())
        
        parent_node["children"].append(new_id)
        
        new_node = {
            "name": name,
            "parentId": parent_id,
            "id": new_id,
            "tag": tag.upper(),
            "type": node_type.upper(),
            "entityId" : entity_id,
        }|({"children":[]} if node_type=="DIRECTORY" else {"extension":ext})
        
        self.directory_management_config[new_id] = new_node
        
        with open(self.directory_config_path, 'w') as file:
            json.dump(self.directory_management_config, file, indent=2)
        
       
        return new_node

    def rename_node(self, node_id, new_name):
        raise NotImplementedError()
    
    def move_node(self, node_id, new_parent_id):
        raise NotImplementedError()
        

    #get path from file_id
    def get_path_from_file_id(self,file_id,relative_path=False):
        if file_id not in self.directory_management_config:
            raise Exception(f"File ID {file_id} not found in directory_management.json")
        entry = self.directory_management_config[file_id]
        name = entry.get('name')
        if entry["type"] == "FILE":
            ext =entry["extension"]
            if ext:
                if ext =="SX":
                    ext = "tsx" if self.isTypeScript else "jsx"
                name +="." + ext
        if entry["parentId"] == "ROOT":
            if  relative_path:
                return name
            else:
                return os.path.join(self.app_config['path'], name)
        else:
            return os.path.join(self.get_path_from_file_id(entry["parentId"]), name)
        
        
        
    def get_directory_configs(self,id,depth=0,allChildren=False,withPreferences=False):
        directories = {}
        conf = self.directory_management_config.get(id)
        if conf:
            directories[id] = conf
        else:
            raise KeyError("Id does not exist")
            
        
        if depth >0:
            for child in conf.get("children", []):
                childConfigs = self.get_directory_configs(child,depth=depth-1)
                print(childConfigs)
                directories = directories|childConfigs
                
        
        return directories