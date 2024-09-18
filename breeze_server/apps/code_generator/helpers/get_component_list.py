from ....configuration_reader import COMPONENTS_CONFIG, COMPONENTS_LIST
import os
import pathlib
from apps.common.constants.consts import CONFIG_FILES_PATH, CONFIG_PATH, THIRD_PARTY_CONFIG_PATH
from apps.common.utils.file_helpers.json_handler import read_project_config_file, read_json_file, write_json_file

import json
from django.http import JsonResponse


def update_components():
    global COMPONENTS_LIST
    global COMPONENTS_CONFIG
    all_projects = []
    all_projects_path = pathlib.Path(CONFIG_PATH)
    all_projects_path = list(all_projects_path.iterdir())
    for project_config_dir in all_projects_path:
        project_config = read_project_config_file(
            project_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        comp_config = prepare_comp_config(project_config_dir)
        COMPONENTS_CONFIG["CUSTOM"][project_config['name']] = comp_config

        COMPONENTS_LIST["CUSTOM"][project_config['name']] = []

        for single_comp_config in comp_config:
            COMPONENTS_LIST["CUSTOM"][project_config['name']].append({
                "name": comp_config[single_comp_config]['name'],
                # Certain config files don't contain $ID field, will remove later
                "id": comp_config[single_comp_config].get("$id", comp_config[single_comp_config]['name'])
            })
    # return COMPONENTS_LIST["HTML"]


def read_components_configs_path(project_config_path):
    comp_config_path = f"{project_config_path}/app_components"

    all_comp_path = []

    all_comp_path = pathlib.Path(comp_config_path)

    all_comp_path = list(all_comp_path.rglob("component_*.json"))

    return all_comp_path


def prepare_comp_config(project_config_path):
    comp_config = read_project_config_file(
        project_config_path, CONFIG_FILES_PATH['COMPONENT_CONFIG'])
    print(comp_config, "comp_congif ")
    comp_paths = read_components_configs_path(project_config_path)

    for comp_path in comp_paths:
        comp_config = read_json_file(comp_path)
        comp_config[comp_config['$id']] = comp_config

    return comp_config
