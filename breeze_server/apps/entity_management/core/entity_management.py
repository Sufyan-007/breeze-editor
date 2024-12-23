from apps.common.constants.consts import CONFIG_PATH,CONFIG_FILES_PATH
from apps.common.utils.file_helpers.json_handler import read_project_config_file, write_json_file
from apps.directory_management.core.directory_management_service import DirectoryManager
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
        
        self.dump_entities()
    
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
        
        self.dump_entities()
        
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
            
            
            self.dump_entities(skip_generation=True)            
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
            
        self.dump_entities()
            
    def delete_file_entities(self, fileId):
        for entityId, entity in self.entity_config.items():
            if entity["fileId"] == fileId:
                self.delete_entity(entityId=entityId)

    def get_all_entities_by_filters(self, filters):
        filtered_entities = {}
        for entityId, entity in self.entity_config.items():
            if all(entity.get(key) == value for key, value in filters.items()):
                filtered_entities[entityId] = entity
        return filtered_entities

    def dump_entities(self, skip_generation=False):
        with open(self.entity_config_path, 'w') as file:
            json.dump(self.entity_config, file, indent=2)   
        if not skip_generation:
            directory_manager = DirectoryManager(self.projectId)
            try:
                directory_manager.add_node_to_config(
                    name="all_entities",
                    parent_id="SRC",
                    tag="ENTITY",
                    node_type="FILE",
                    file_id="ALL_ENTITIES",
                    ext="SX"
                )
            except KeyError:
                pass
            
            exported_entities = []
            for entityId, entity in self.entity_config.items():
                if entity["defaultExport"]:
                    exported_entities.append(f'export {{ default as entity_{entityId} }} from "/{directory_manager.get_path_from_file_id(entity["fileId"], relative_path=True) }"'.replace("\\", "/"))
                else:
                    exported_entities.append(f'export {{ {entity["exportedAs"]} as entity_{entityId} }} from "/{directory_manager.get_path_from_file_id(entity["fileId"], relative_path=True) }"'.replace("\\", "/"))
            directory_manager.save_file("ALL_ENTITIES", "\n".join(exported_entities))