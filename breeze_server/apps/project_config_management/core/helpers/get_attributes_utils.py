# utils.py
import os
import pathlib
from apps.common.constants.consts import CONFIG_FILES_PATH, CONFIG_PATH, THIRD_PARTY_CONFIG_PATH
from apps.common.utils.file_helpers.json_handler import read_project_config_file, read_json_file, write_json_file
import json
from django.http import JsonResponse
from .elements_attributes_list import ELEMENT_ATTRIBUTES
from ....configuration_reader import COMPONENTS_CONFIG, COMPONENTS_LIST
# from .....common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH, THIRD_PARTY_CONFIG_PATH

# from .core.html_attributes import COMMON_HTML_ATTRIBUTES


def prepare_tp_comp_config(project_id, component_id):

    all_projects_path = pathlib.Path(CONFIG_PATH)
    all_projects_path = list(all_projects_path.iterdir())
    for project_config_dir in all_projects_path:
        print("dfjvdfv")

        project_config = read_project_config_file(project_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        if project_config['name'] == project_id:

            comp_config = prepare_comp_config(project_config_dir)
            if comp_config.get(component_id):
                return comp_config[component_id]["propsVars"]
            else:
                return None
        else:
            continue
    return None


def convert_attributes(new_attributes, IsCustom):
    old_attributes = {}

    for attr in new_attributes:
        name = attr['name']
        if IsCustom:
            attr_type = attr['body']['datatype']
            if (attr_type == 'bool'):
              attr_type = 'Boolean'; 
    
            default_value = attr['body'].get('defaultValue', None)  # Get default value if present, otherwise None
            old_attributes[name] = {
                'datatype': attr_type.upper(),
                'defaultValue': default_value
            }
        else:
            attr_type = attr['type']
            if (attr_type == 'bool'):
              attr_type = 'Boolean'; 
            old_attributes[name] = {
                'datatype': attr_type.upper()
            }

    return old_attributes




def get_attributes_logic(request_body):
    data = json.loads(request_body.decode('utf-8'))
    component_id = data.get('component_id')
    component_type = data.get('component_type')
    project_id = data.get('project_id')
    third_party_id = data.get('third_party_id', None)
    print('-----------------------------')
    print(component_id, component_type, project_id, third_party_id)
    responseData = None
    if not component_id or not component_type or not project_id:
        return JsonResponse({'error': 'Missing Parameters '}, status=400)

    if component_type == 'THIRD_PARTY':
        if COMPONENTS_CONFIG['THIRD_PARTY'][third_party_id][component_id]["propsVars"]:
            new_attributes = COMPONENTS_CONFIG['THIRD_PARTY'][third_party_id][component_id]["propsVars"]

            responseData = convert_attributes(new_attributes,False)
        else:
            responseData = None
        # return JsonResponse({"attributesdf": new_attributes}, status=200)

    elif component_type == 'CUSTOM':
        
        new_attributes = prepare_tp_comp_config(project_id, component_id)
        responseData = convert_attributes(new_attributes,True)
        print("-------------------------------------------------",new_attributes)
        

    #    return JsonResponse({"attributes": responseData}, status=200)

    else:
        if component_id in ELEMENT_ATTRIBUTES:
            responseData = {
                **ELEMENT_ATTRIBUTES[component_id], **ELEMENT_ATTRIBUTES["common"]}
        else:
            responseData = None
    if responseData is None:
        return JsonResponse({'error': 'No attributes found for the given component_id and component_type'}, status=404)

    return JsonResponse( responseData, status=200)


def prepare_comp_config(project_config_path):
    comp_config = read_project_config_file(
        project_config_path, CONFIG_FILES_PATH['COMPONENT_CONFIG'])
    print(comp_config, "comp_congif ")
    comp_paths = read_components_configs_path(project_config_path)

    for comp_path in comp_paths:
        comp_config = read_json_file(comp_path)
        comp_config[comp_config['$id']] = comp_config

    return comp_config


def read_components_configs_path(project_config_path):
    comp_config_path = f"{project_config_path}/app_components"

    all_comp_path = []

    all_comp_path = pathlib.Path(comp_config_path)

    all_comp_path = list(all_comp_path.rglob("component_*.json"))

    return all_comp_path
