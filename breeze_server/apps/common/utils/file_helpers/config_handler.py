import json
import time
from pathlib import Path
from flatten_json import flatten
from flatten_json import unflatten_list
from apps.common.constants.consts import CONFIG_PATH, CONFIG_FILES_PATH, MULTI_NODE_MULTI_FILE

from apps.common.utils.file_helpers.json_handler import write_json_file, read_project_config_file

SEPARATOR = "<>"
global_file_change_state = {'changed_files': {}}

def read_config_file(project_name, category, filename, version="latest"):
    file_path = f"{CONFIG_PATH}/{project_name}/{category}/{filename}.json"
    version_path = f"{CONFIG_PATH}/{project_name}/{category}/versions/{filename}"
    json_config = {}
    err = False
    err_message= ""
        
    if version == "latest":
        ## config file as the data of latest version already 
        with open(file_path,"rb") as flatten_config:
            flatten_json = json.load(flatten_config)
            json_config = unflatten_list(flatten_json,SEPARATOR)
            
    elif isinstance(version,int):
        config_file = Path(f"{file_path}.json")
        versions_file = Path(f"{file_path}_versions.json")
        if versions_file.is_file() and config_file.is_file():
            # files exists
            with open(f"{version_path}_versions.json","r") as file_version_config,  open(f"{file_path}.json","r") as file_config:
                file_version_json = json.load(file_version_config)
                file_config_json = json.load(file_config)
                current_version = file_version_json.get("current_version")
                ## given version should not be grater than the current version
                if version > current_version and version < 1:
                    err = True
                    err_message = "Invalid version specified"
                else:
                    version_str = str(version)
                    ## if user manually remove the previous version despite the warnings
                    if version_str not in file_version_json.get("versions",{}):
                        err = True
                        err_message = "Invalid version specified"
                    else:
                        ## here needs to fetch the specified version of the each prop 
                        ## from the config changes
                        ## if that prop not exists then it is already in the latest version
                        changes = file_version_json.get("changes",{})
                        specified_version_json = {}
                        for key,value in file_config_json.items():
                            if key not in changes:
                                specified_version_json[key] = value
                            else: 
                                if version_str in changes[key]:
                                    specified_version_json[key] = changes.get(key).get(version_str) 
                                else:
                                    local_version = version
                                    while(local_version < current_version): 
                                        local_version += 1
                                        if str(local_version) in changes.get(key):
                                            specified_version_json[key] = changes.get(key).get(str(local_version))
                                            break
                                        else:
                                            continue
                        json_config = unflatten_list(specified_version_json,SEPARATOR)

        else:
            err = True
            err_message = "Invalid version specified"

    if err is True:
        return {
            "err" : err,
            "message" : err_message
        }
    else: 
        return {
            "err" : err,
            "data" : json_config
        }
    
def write_config_file(project_name, category, filename, json_data):
    INDEX_FILE_PATH = f"{CONFIG_PATH}/{project_name}/{category}/index.json"
    file_path = f"{CONFIG_PATH}/{project_name}/{category}/{filename}"
    version_file_path = f"{CONFIG_PATH}/{project_name}/{category}/versions/{filename}"
    
    config_file = Path(f"{file_path}.json")
    versions_file = Path(f"{version_file_path}_versions.json")
    
    ## create flatten obj for given data
    flatten_data_json = flatten(json_data,SEPARATOR)
    file_version_json = {}
    file_config_json = {}
    
    ## fist check if file is present then store and update it's version
    if versions_file.is_file() and config_file.is_file():
        # files exists
        with open(f"{version_file_path}_versions.json","r") as file_version_config,  open(f"{file_path}.json","r") as file_config:
            file_version_json = json.load(file_version_config)
            file_config_json = json.load(file_config)
            
            ## increment the version number
            current_version = file_version_json.get("current_version")
            file_version_json["current_version"] = current_version + 1
            current_version = str(current_version)
                    
            ## add new entry in the versions and store current time
            versions = file_version_json.get("versions",{})
            versions[str(int(current_version) + 1)] = { "key" : int(current_version) + 1, "timestamp" : time.time() }
            
            # flag to check something have changed or not
            has_something_changed = False
            
            # remove extra versions present in versions' stack and changes 
            for version in list(versions.keys()):
                if int(version) > int(current_version) + 1:
                    del versions[version]
                    
            changes = file_version_json.get("changes",{})
            for change_obj in list(changes.values()):
                for version in list(change_obj.keys()):
                    # change to del only greater version
                    if int(version) > int(current_version) + 1:
                        del change_obj[version]

            if not file_version_json.get("deleted_keys"):
                file_version_json["deleted_keys"] = {}
            for key in file_version_json["deleted_keys"]:
                if int(key) >= int(current_version) + 1:
                    del file_version_json["deleted_keys"][key]
            ## store the changes of each field corresponding to it's version 
            ## for that use flatten obj for given data
            for key,value in flatten_data_json.items():
                if value != file_config_json.get(key):
                    ## field value is updated so store the changes
                    if key not in changes:
                        changes[key] = {}
                    changes[key][int(current_version) + 1] = value
                    has_something_changed = True
                else:
                    pass 
            
            for key in file_config_json:
                if key not in flatten_data_json:
                    if not file_version_json.get("deleted_keys", {}).get(str(int(current_version) + 1)):
                        file_version_json["deleted_keys"][file_version_json["current_version"]] = []
                    file_version_json["deleted_keys"][file_version_json["current_version"]].append(key)
                    has_something_changed = True
            file_version_json["versions"] = versions    
            file_version_json["changes"] = changes
    
    ## new file config to be written
    else:
        file_version_json["current_version"] = 1
        file_version_json["versions"] = {}
        file_version_json["versions"]["1"] = { "key" : 1, "timestamp" : time.time() }
        file_version_json["changes"]={}
        file_version_json["deleted_keys"] = {}
        for key, value in flatten_data_json.items():
            file_version_json["changes"][key] = {}
            file_version_json["changes"][key][1] = value
        has_something_changed = True
        
    ## update both files
    if has_something_changed:
        with open(f"{version_file_path}_versions.json", "w+") as jsconfig_version_file:
            jsconfig_version_file.write(json.dumps(file_version_json))
            with open(f"{file_path}.json", "w") as jsconfig_file:
                global_file_change_state["changed_files"][filename] = {
                    "filename": filename,
                    "project_name": project_name,
                    "category": category,
                    "current_version": file_version_json["current_version"]
                }
                jsconfig_file.write(json.dumps(flatten_data_json))
                if category in MULTI_NODE_MULTI_FILE:
                    # UPDATE INDEX.JSON WITH NEW KEY VALUE PAIR
                    index_file = open(f"{INDEX_FILE_PATH}")
                    index_file_content = json.load(index_file)
                    index_file_content[filename] = json_data.get('name')
                    write_json_file(INDEX_FILE_PATH, index_file_content)
    else:
        print(f"Nothing changed in {filename}")
                 
def get_breeze_config_file(project_id, config_type='APP_CONFIG'):
    path = f"{CONFIG_PATH}/{project_id}"
    if config_type == "ROUTING_CONFIG":
        config_data_obj = read_config_file(project_id, "routing_config", "routing_config")
        if config_data_obj.get('err'):
            raise Exception(config_data_obj['message'], ": not able to read routing_config..")
        config = config_data_obj.get('data')
    else:
        config = read_project_config_file(
            path, CONFIG_FILES_PATH[config_type]
        )
    return config
        