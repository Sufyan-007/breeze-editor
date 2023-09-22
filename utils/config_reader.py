import json
from .app_consts import APP_CONFIG_PATH


def read_config_file(file_path, ext=".json"):
    config_file = open(f"{APP_CONFIG_PATH}/{file_path}{ext}")
    json_config = json.load(config_file)
    return json_config

# def read_json_config(file_path)

