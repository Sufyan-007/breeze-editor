from apps.common.constants.consts import CONFIG_PATH,CONFIG_FILES_PATH
from apps.common.utils.file_helpers.json_handler import read_project_config_file, write_json_file
import os,json


class EntityManager:
    def __init__(self,projectId):
        self.projectId = projectId
        self.app_config_dir = f"{CONFIG_PATH}/{projectId}"
        self.entity_config_path= os.path.join(CONFIG_PATH, self.projectId, f'{CONFIG_FILES_PATH["ENTITY_CONFIG"]}.json')
        try:
            self.entity_config = read_project_config_file(self.app_config_dir,CONFIG_FILES_PATH["ENTITY_CONFIG"])
        except:
            self.entity_config = {}
    def add_entity(self,entityId, fileId,exportedAs, type="", defaultExport=True,schema=None):
        if entityId in self.entity_config:
            raise Exception("Entity already exists")
        
        entity = {
            "id": entityId,
            "fileId" : fileId,
            "type" : type,
            "schema" : schema,
            "exportedAs" : exportedAs,
            "defaultExport" : defaultExport,
            "usedIn" : []
        }
        self.entity_config[entityId] = entity
        
        with open(self.entity_config_path, 'w') as file:
            json.dump(self.entity_config, file, indent=2)
    
    def add_or_update_entity(self, entityId, fileId,exportedAs, type="", defaultExport=True,schema=None):
        entity = {
            "id": entityId,
            "fileId" : fileId,
            "type" : type,
            "schema" : schema,
            "exportedAs" : exportedAs,
            "defaultExport" : defaultExport,
            "usedIn" : []
        }
        if entityId in self.entity_config:
            ## TODO: Handle entity updation , primarily type and schema changes
            entity["usedIn"] = self.entity_config[entityId].get("usedId",[])
        
        
        self.entity_config[entityId] = entity
        
        with open(self.entity_config_path, 'w') as file:
            json.dump(self.entity_config, file, indent=2)    
        
    def get_entity(self,entityId):
        return self.entity_config[entityId]
    
    def get_file_entities(self,fileId):
        file_entities = {}
        
        for entityId, entity in self.entity_config.items():
            if entity["fileid"] == fileId:
                file_entities[entityId] = entity
        
        return file_entities
    
    def get_and_use_entity(self,entityId,fileId):
        if entityId in self.entity_config:
            if fileId not in self.entity_config[entityId]["usedIn"]:
                self.entity_config[entityId]["usedIn"].append(fileId)
            
            
            with open(self.entity_config_path, 'w') as file:
                json.dump(self.entity_config, file, indent=2)
            
            return self.get_entity(entityId=entityId)
        
        else:
            raise KeyError("Entity Id does not exist")
            
    def delete_entity(self, entityId):
        if entityId not in self.entity_config:
            raise KeyError("Entity id does not exist")
        
        if self.entity_config[entityId].get("usedIn"):
            ## handle deleting entity where it is already used
            pass
        else:
            del self.entity_config[entityId]
            
        with open(self.entity_config_path, 'w') as file:
            json.dump(self.entity_config, file, indent=2)
            
    def delete_file_entities(self, fileId):
        for entityId, entity in self.entity_config.items():
            if entity["fileId"] == fileId:
                self.delete_entity(entityId=entityId)