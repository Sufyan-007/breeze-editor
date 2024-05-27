import json


def read_config_file(config_path, file_path, ext=".json"):
    config_file = open(f"{config_path}/{file_path}{ext}")
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

