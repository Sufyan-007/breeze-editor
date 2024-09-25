import json
from pathlib import Path

def read_json_file(file_path, ext=".json",return_empty=False):
    if Path(f"{file_path}{ext}").is_file():
        config_file = open(f"{file_path}{ext}")
        json_config = json.load(config_file)
        return json_config
    elif return_empty:
        return {}
    else:
        raise FileNotFoundError(f"No such file or directory: {file_path}{ext}")

def write_json_file(file_path, content, mode="w"):
    with open(file_path, mode) as jsconfig_file:
        jsconfig_file.write(json.dumps(content))
        
def read_project_config_file(config_path, file_path, ext=".json"):
    config_file = open(f"{config_path}/{file_path}{ext}")
    json_config = json.load(config_file)
    return json_config
        