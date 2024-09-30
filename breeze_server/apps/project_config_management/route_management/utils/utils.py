import random
import string
from ..core.post_edit_operations import RouteHandler
from apps.common.constants.consts import CONFIG_FILES_PATH, CONFIG_PATH
from apps.common.utils.file_helpers.json_handler import read_project_config_file, read_json_file
from apps.directory_management.core.directory_management_service import DirectoryManager
from apps.common.constants.enums.ResourceCategory import ResourceCategory

def generate_layout_route_key():
    # Generate a unique key for layout routes
    return f"/layout__{''.join(random.choices(string.ascii_lowercase + string.digits, k=9))}__"

def process_and_save_route_config(project_name, routing_config={}):
    # print("This function runs after returning a 200 response.")
    try:
        app_config_dir = f"{CONFIG_PATH}/{project_name}"
        app_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        comp_config_index = read_json_file(f"{app_config_dir}/{ResourceCategory.COMPONENTS.value}/index")
        if routing_config == {}:
            routing_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['ROUTING_CONFIG'])
        initialize, handle_routing_code = RouteHandler()
        initialize(app_config, routing_config, comp_config_index)
        react_code = handle_routing_code(app_config, routing_config, comp_config_index, )
        directory_manager= DirectoryManager(project_name)
        directory_manager.save_file("MAIN_COMPONENT",react_code)
        
    except Exception as e:
        print("Error while processing and saving config file.")
        print("Error: ", e)
        raise e

def get_full_route_path(route_obj, routing_config):
    full_path = route_obj.get('path')
    if route_obj.get('parentId'):
        parent_route_obj = routing_config.get(route_obj.get('parentId'))
        if parent_route_obj:
            full_path = get_full_route_path(parent_route_obj, routing_config) + full_path
    else:
        full_path = full_path
    return full_path
 
def check_for_manadatory_route_props(route_obj):
    if route_obj.get('path'):
        route_obj['path'] = route_obj.get('path').strip()
        route_obj['path'] = "/" + route_obj['path'].strip('/')
    else:
        raise ValueError("path is missing")
    if route_obj.get('componentId'):
        route_obj.pop('redirectTo') if route_obj.get('redirectTo') else ''
        route_obj['componentId'] = route_obj.get('componentId').strip()
    elif route_obj.get('redirectTo'):
        route_obj.pop('componentId') if route_obj.get('componentId') else ''
    else:
        raise ValueError("component or redirectTo is missing")
        
def get_all_full_paths(with_ids=True, project_id="", routing_config={}):
    routing_config = get_routing_config(project_id, routing_config)
    # get all the route objects from the routing config except the fallback element's obj
    all_route_objects = list(get_filtered_object(routing_config, 'fallback').values())
    all_full_paths_with_object_id = []
    all_full_paths = []
    
    for route_obj in all_route_objects:
        full_path = get_full_route_path(route_obj, routing_config)
        all_full_paths.append(full_path)
        full_path_obj = { 'id': route_obj['id'], 'full_path': full_path}
        all_full_paths_with_object_id.append(full_path_obj)
    if with_ids:
        return all_full_paths_with_object_id   
    return all_full_paths
    
def validate_route_object(route_obj, project_id="", routing_config={}):
    routing_config = get_routing_config(project_id, routing_config)
    full_route_path = get_full_route_path(route_obj, routing_config) 
    if full_route_path in get_all_full_paths(with_ids=False, routing_config=routing_config):
        raise Exception("route with same path already exists")
    
def get_filtered_object(data, exclude_keys):
    return {key: value for key, value in data.items() if key not in exclude_keys}


def get_routing_config(project_id="", routing_config={}):
    if routing_config == {}:
        if project_id == "":
            raise ValueError("project id is missing")
        routing_config = read_project_config_file(f"{CONFIG_PATH}/{project_id}", CONFIG_FILES_PATH['ROUTING_CONFIG'])
    return routing_config
    