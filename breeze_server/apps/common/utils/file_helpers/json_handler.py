import json

def read_json_file(file_path, ext=".json"):
    config_file = open(f"{file_path}{ext}")
    json_config = json.load(config_file)
    return json_config

# check its usage once
def write_json_file(file_path, content, mode="w"):
    with open(file_path, mode) as jsconfig_file:
        jsconfig_file.write(content)
        
def read_project_config_file(config_path, file_path, ext=".json"):
    config_file = open(f"{config_path}/{file_path}{ext}")
    json_config = json.load(config_file)

    return json_config
        