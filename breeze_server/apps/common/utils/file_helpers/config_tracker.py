import json
from pathlib import Path
from apps.common.constants.consts import CONFIG_PATH
from apps.common.utils.file_helpers.json_handler import write_json_file
from apps.code_generator.core.generate_code import generate_code_with_latest_config



# rollback all files to there previous version
def rollback_config_file(project_name, category, filename, version=None, is_exception=False):
    # 1st change file ma jaine changes object ma 1 step revert previous ne copy
    # 2nd change config ma jaine copy karea changes ne override
    # handle case where if 1st version is removed then delete the original entity
    # rewrite generated projects file as per the current config
    file_path = f"{CONFIG_PATH}/{project_name}/{category}/{filename}.json"
    version_file_path = f"{CONFIG_PATH}/{project_name}/{category}/versions/{filename}_versions.json"
    config_file = Path(file_path)
    versions_file = Path(version_file_path)
    
    if not (versions_file.is_file() and config_file.is_file()):
        return "can't find config file, incorrect configuration details provided.."
    
    with open(file_path,"rb") as flatten_config:
        flatten_json = json.load(flatten_config)
    
    with open(version_file_path,"rb") as version_handler:
        version_handler = json.load(version_handler)
        
    all_version_list = version_handler['versions'].keys()
    if not version:
        current_version = version_handler.get('current_version')
    elif int(version) >= 1 and str(int(version)) in all_version_list:
        current_version = int(version) + 1
    else:
        return "provided invalid version number.."
    
    if current_version > 1:
        version_handler['current_version'] = current_version - 1
        for key in version_handler['changes']:
            version_list = sorted(version_handler['changes'][key].keys())
            if current_version == int(version_list[-1]):
                if len(version_list) >= 2:
                    previous_version_in_use = version_list[-2]
                    flatten_json[key] = version_handler['changes'][key][previous_version_in_use]
                else:
                    flatten_json.pop(key, None)
            elif str(current_version) in version_list:
                prev_ver_index = version_list.index(str(current_version)) - 1
                if prev_ver_index >= 0:
                    previous_version_in_use = version_list[prev_ver_index]
                    flatten_json[key] = version_handler['changes'][key][previous_version_in_use]
                else:
                    flatten_json.pop(key, None)
            elif str(current_version - 1) in version_list:
                flatten_json[key] = version_handler['changes'][key][str(current_version - 1)]
            elif current_version in version_handler.get('deleted_keys', {}):
                deleted_keys = version_handler['deleted_keys'][current_version]
                if key in deleted_keys:
                    prev_ver_index = version_list.index(str(current_version)) - 1
                    previous_version_in_use = version_list[prev_ver_index]
                    flatten_json[key] = version_handler['changes'][key][previous_version_in_use]
    elif current_version == 1:
        if is_exception:
            # remove_the_newly_added_content_from_the_index_file
            INDEX_FILE_PATH = f"{CONFIG_PATH}/{project_name}/{category}/index.json"
            index_file = open(f"{INDEX_FILE_PATH}")
            index_file_content = json.load(index_file)
            index_file_content.pop(filename, None)
            write_json_file(INDEX_FILE_PATH, index_file_content)
            # TODO:
            # remove the newly generated code file or new content in those code files
            # will be done when components, services and other entities will start 
            # generating code files
        else:
            pass
               
    with open(f"{version_file_path}", "w+") as jsconfig_version_file:
        jsconfig_version_file.write(json.dumps(version_handler))
    with open(f"{file_path}", "w") as jsconfig_file:
        jsconfig_file.write(json.dumps(flatten_json))
    
    if not is_exception:
        # rewrite generated projects file as per the current config
        # provided that the config is correct things will go the right way otherwise
        # exception will be raised and version errors will be encountered
        generate_code_with_latest_config(project_name, {category: filename})
    else:
        # exeption for current_version > 1 || == 1 both are managed
        pass
    
def rollforward_config_file(project_name, category, filename, version=None):
    # 1st change file ma jaine changes object ma 1 step forward karela change ne copy & ++1 current_version
    # 2nd change config ma jaine copy karela changes ne override
    # rewrite generated projects file as per new config
    file_path = f"{CONFIG_PATH}/{project_name}/{category}/{filename}.json"
    version_file_path = f"{CONFIG_PATH}/{project_name}/{category}/versions/{filename}_versions.json"
    
    config_file = Path(file_path)
    versions_file = Path(version_file_path)
    
    if not (versions_file.is_file() and config_file.is_file()):
        return "can't find config file, incorrect configuration details provided.."
    
    with open(file_path,"rb") as flatten_config:
        flatten_json = json.load(flatten_config)
    
    with open(version_file_path,"rb") as version_handler:
        version_handler = json.load(version_handler)
        
    all_version_list = version_handler['versions'].keys()
    if not version:
        current_version = version_handler.get('current_version')
    elif int(version) > 1 and str(int(version)) in all_version_list:
        current_version = int(version)-1
    else:
        return "provided invalid version number.."
    
    if str(current_version+1) in list(version_handler['versions'].keys()):
        version_handler['current_version'] = current_version + 1
        for key in version_handler['changes']:
            version_list = sorted(version_handler['changes'][key].keys())
            if str(current_version+1) in version_list:
                new_version_to_be_used = str(current_version+1)
                flatten_json[key] = version_handler['changes'][key][new_version_to_be_used]
        if version_handler.get('deleted_keys'):
            for key in version_handler['deleted_keys'].get(str(current_version + 1), {}):
                flatten_json.pop(key, None)
    else:
        return "already reached the latest changes"
                
    with open(f"{version_file_path}", "w+") as jsconfig_version_file:
        jsconfig_version_file.write(json.dumps(version_handler))
    with open(f"{file_path}", "w") as jsconfig_file:
        jsconfig_file.write(json.dumps(flatten_json))
    generate_code_with_latest_config(project_name, {category: filename})
   
  