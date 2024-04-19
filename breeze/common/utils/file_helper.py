import json
from pathlib import Path

def read_json_file(file_path, ext=".json"):
    config_file = open(f"{file_path}{ext}")
    json_config = json.load(config_file)
    return json_config

def create_parent_dir_if_not_exists(dir_path):
    Path(dir_path).mkdir(parents=True, exist_ok=True)

def write_file(file_path, content, mode="w"):
    with open(file_path, mode) as jsconfig_file:

        jsconfig_file.write(content)