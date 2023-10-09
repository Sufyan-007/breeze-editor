import json
from .app_consts import APP_CONFIG_PATH


def read_config_file(file_path, ext=".json"):
    config_file = open(f"{APP_CONFIG_PATH}/{file_path}{ext}")
    json_config = json.load(config_file)
    return json_config

def read_file_json(file_path):
    config_file = open(f"{file_path}")
    json_config = json.load(config_file)
    return json_config

def write_file(file_path, content, mode="w"):
    with open(file_path, mode) as jsconfig_file:

        jsconfig_file.write(content)
# def config_file = open(f")ig(file_path)

