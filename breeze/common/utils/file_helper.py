import json
import time
from pathlib import Path
from flatten_json import flatten
from flatten_json import unflatten_list
import sys
#a module called io in python is imported
import io
SEPARATOR = "<>"

def read_json_file(project_name,category,filename,version="latest"):
    file_path = f"{project_name}/{category}/{filename}"
    json_config = {}
    err = False
    err_message= ""
    if version == "latest":
        ## config file as the data of latest version already 
        with open(f"{file_path}.json","rb") as flatten_config:
            flatten_json = json.load(flatten_config)
            print(flatten_json)
            json_config = unflatten_list(flatten_json,SEPARATOR)
            
    elif isinstance(version,int):
        config_file = Path(f"{file_path}.json")
        versions_file = Path(f"{file_path}_versions.json")
        if versions_file.is_file() and config_file.is_file():
            # files exists
            with open(f"{file_path}_versions.json","r") as file_version_config,  open(f"{file_path}.json","r") as file_config:
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
    
def write_json_file(project_name,category,filename,json_data):
    file_path = f"{project_name}/{category}/{filename}"
    config_file = Path(f"{file_path}.json")
    versions_file = Path(f"{file_path}_versions.json")
    
    ## create flatten obj for given data
    flatten_data_json = flatten(json_data,SEPARATOR)
    file_version_json = {}
    file_config_json = {}
    
    ## fist check if file is present then store and update it's version
    if versions_file.is_file() and config_file.is_file():
        # files exists
        with open(f"{file_path}_versions.json","r") as file_version_config,  open(f"{file_path}.json","r") as file_config:
            file_version_json = json.load(file_version_config)
            file_config_json = json.load(file_config)
            
            ## increment the version number
            current_version = file_version_json.get("current_version")
            prev_version = str(current_version)
            current_version = int(current_version) + 1  
            file_version_json["current_version"] = current_version
            current_version = str(current_version)
            
            ## add new entry in the versions and store current time
            versions = file_version_json.get("versions",{})
            versions[current_version] = { "key" : int(current_version), "timestamp" : time.time() }
            
            ## store the changes of each field corresponding to it's version 
            ## for that use flatten obj for given data
            changes = file_version_json.get("changes",{})
            for key,value in flatten_data_json.items():
                if value != file_config_json[key]:
                    ## field value is updated so store the changes
                    if key not in changes:
                        changes[key] = {}
                    changes[key][prev_version]= file_config_json[key]
                    changes[key][current_version] = value
                else:
                    pass 
                
            file_version_json["versions"] = versions    
            file_version_json["changes"] = changes
    
    ## new file config to be written
    else:
        file_version_json["current_version"] = 1
        file_version_json["versions"] = {}
        file_version_json["versions"]["1"] = { "key" : 1, "timestamp" : time.time() }
        file_version_json["changes"]={}
        
    ## update both files
    with open(f"{file_path}_versions.json", "w") as jsconfig_version_file:
        jsconfig_version_file.write(json.dumps(file_version_json))
        with open(f"{file_path}.json", "w") as jsconfig_file:
            jsconfig_file.write(json.dumps(flatten_data_json))

            

def create_parent_dir_if_not_exists(dir_path):
    Path(dir_path).mkdir(parents=True, exist_ok=True)

def write_file(file_path, content, mode="w"):
    with open(file_path, mode) as jsconfig_file:

        jsconfig_file.write(content)
