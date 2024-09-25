import random
import string
from ..core.post_edit_operations import RouteHandler
from apps.common.constants.consts import CONFIG_FILES_PATH, CONFIG_PATH
from apps.common.utils.file_helpers.json_handler import read_project_config_file, read_json_file
from apps.directory_management.core.directory_management_service import DirectoryManagementGenerator
from apps.common.constants.enums.ResourceCategory import ResourceCategory

def generate_layout_route_key():
    # Generate a unique key for layout routes
    return f"/layout__{''.join(random.choices(string.ascii_lowercase + string.digits, k=9))}__"

def process_and_save_route_config(project_name):
    print("This function runs after returning a 200 response.")
    try:
        app_config_dir = f"{CONFIG_PATH}/{project_name}"
        app_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        comp_config_index = read_json_file(f"{app_config_dir}/{ResourceCategory.COMPONENTS.value}/index")
        routing_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['ROUTING_CONFIG'])
        initialize, handle_routing_code = RouteHandler()
        initialize(app_config, routing_config, comp_config_index)
        react_code = handle_routing_code()
        directory_manager= DirectoryManagementGenerator(project_name)
        directory_manager.save_file("MAIN_COMPONENT",react_code)
        
    except Exception as e:
        print("Error while processing and saving config file.")
        print("Error: ", e)
        return {'case' : False, 'res' : 'Error while processing file'}

def generate_full_path(route_obj):
    if route_obj.get('parentPath') not in [None, 'none']:
        return f"{route_obj['parentPath']}{route_obj['path']}"
    else:
        return route_obj.get('path')

def get_full_parent_path_from_child_route(child_route):
    path_length = len(child_route.get('path', ''))
    full_path_length = len(child_route.get('fullPath', ''))
    full_parent_path = child_route.get('fullPath', '')[:(full_path_length - path_length)] or ""
    return full_parent_path

def set_parent_initial_parent(route_obj, intial_parent_path, routing_config):
    if route_obj.get('childRoutes'):
        for path in route_obj.get('childRoutes').keys():
            child_obj = routing_config["routes"][path]
            child_obj['initialParentPath'] = intial_parent_path
            if route_obj['path'] != child_obj['parentPath']:
                child_obj['parentPath'] = route_obj['path']    
            set_parent_initial_parent(child_obj, intial_parent_path, routing_config)
                    
def clean_dict_value(input_dict):
    cleaned_dict = {}
    for key, value in input_dict.items():
        # Check if value is a string and contains extra quotes
        if isinstance(value, str):
            # Remove leading and trailing single or double quotes
            cleaned_value = value.strip("'\"")
            cleaned_dict[key] = cleaned_value
        else:
            cleaned_dict[key] = value
    
    return cleaned_dict

def replace_first_instance(text, old_path, new_path):
    index = text.find(old_path)
    if index != -1:
        return text[:index] + new_path + text[index + len(old_path):]
    return text

def handle_route_path_change_in_child(route_obj, prev_path, new_path, parent_path, initial_parent_path, routing_config):
    if route_obj.get('childRoutes'):
        keys_to_modify = [path for path in route_obj.get('childRoutes').keys()]
        for child_path in keys_to_modify:
            new_child_path = replace_first_instance(child_path, prev_path, new_path)
            if routing_config['routes'].get(new_child_path):
                return {'case': False, 'res': 'error: route with same path already exists'}

            handle_route_path_change_in_child(
                routing_config['routes'][child_path],
                child_path,
                new_child_path,
                new_path,
                initial_parent_path,
                routing_config
            )
            
            route_obj.get('childRoutes')[new_child_path] = route_obj.get('childRoutes')[child_path]
            del route_obj.get('childRoutes')[child_path] 
    if route_obj.get('parentPath'):
        route_obj['parentPath'] = parent_path
    if route_obj.get('initialParentPath'):
        route_obj['initialParentPath'] = initial_parent_path

    routing_config['routes'][new_path] = route_obj
    del routing_config['routes'][prev_path]

def replace_last_instance(text, old_path, new_path):
    index = text.rfind(old_path)
    if index != -1:
        return text[:index] + new_path + text[index + len(old_path):]
    return text

def handle_route_path_change_in_child_for_child(route_obj, prev_full_path, new_full_path, routing_config):
    if route_obj.get('childRoutes'):
        keys_to_modify = [path for path in route_obj.get('childRoutes').keys()]
        for child_path in keys_to_modify:
            relative_child_path = routing_config['routes'][child_path]['path']
            new_full_parent_path = new_full_path
            new_child_path = new_full_parent_path + relative_child_path
            if routing_config['routes'].get(new_child_path):
                return {'case': False, 'res': 'error: route with same path already exists'}

            handle_route_path_change_in_child_for_child(
                routing_config['routes'][child_path],
                child_path,
                new_child_path,
                routing_config
            )
            route_obj.get('childRoutes')[new_child_path] = route_obj.get('childRoutes')[child_path]
            del route_obj.get('childRoutes')[child_path] 
    routing_config['routes'][new_full_path] = route_obj
    del routing_config['routes'][prev_full_path]
    
def get_config_obj(route, selected_route, routing_config, routing_helper_data):
    # selectedRoute and RouterProviderSection are being devoid from route object
    route_section = ['propDetails', 'advancePropDetails']
    prop_name_map = {'parent path': 'parentPath',  "error-element": 'errorElement', "element": 'component', "elementProp": 'props'}
    route_obj = {}
    for section in route_section:
        for prop in route[section]['props']:
            # if value is empty it won't include the key in route object
            # so we use default value while getting the key's value
            print(prop)
            if prop['value']:
                if prop_name_map.get(prop['name']):
                    prop['name'] = prop_name_map.get(prop['name'])
                if prop.get('type') == 'key-value-pair':
                    rectified_pair = {}
                    for pair in prop['value']:
                        rectified_pair.update(clean_dict_value({pair : prop['value'][pair]})) 
                    prop['value'] = rectified_pair
                route_obj[prop['name']] = prop['value']
    if not route_obj.get('path', "").strip():
        # here write a functino that returns path 
        route_obj['path'] = generate_layout_route_key()
    else:
        route_obj['path'] = route_obj.get('path').strip()
        route_obj['path'] = "/" + route_obj['path'].strip('/')
    if not route_obj.get('component', "").strip():
        route_obj['component'] = ""
    else:
        route_obj['component'] = route_obj.get('component').strip()
    
    if selected_route:
        route_obj['fullPath'] = selected_route.get('fullPath')
        prev_route_parent_path = selected_route.get('parentPath')
        if selected_route.get('childRoutes'):
            route_obj['childRoutes'] = selected_route.get('childRoutes')
        # here parentPath key has full parent path value
        if route_obj.get('parentPath', 'none') != 'none':
            # it is a base route converted to child -> base_edit
            if not prev_route_parent_path:
                route_obj['newFullParentPath'] = route_obj.get('parentPath')
                route_obj['prevPath'] = selected_route.get('path')
            # it is a child route updated to a child -> child_edit
            else:
                route_obj['prevPath'] = selected_route.get('path') 
                route_obj['fullParentPath'] = get_full_parent_path_from_child_route(selected_route) 
                route_obj['newFullParentPath'] = route_obj.get('parentPath')
        else:
            # it is a base route updated to base route -> base_edit
            if prev_route_parent_path in [None, "none"]:
                route_obj['newFullParentPath'] = route_obj.get('parentPath')
                route_obj['prevPath'] = selected_route.get('path')
            # it is a child route converted to base route -> edit_child
            else:
                route_obj['prevPath'] = selected_route.get('path') 
                route_obj['fullParentPath'] = get_full_parent_path_from_child_route(selected_route) 
                route_obj['newFullParentPath'] = route_obj.get('parentPath')
    else:
        if route_obj.get('parentPath', 'none') != 'none':
            route_obj['fullParentPath'] = route_obj['parentPath']
    
    routing_helper_data['recently_saved_route_fullpath'] = generate_full_path(route_obj)
    if route_obj.get('parentPath', "none") != "none":
        route_obj['parentPath'] = routing_config['routes'][route_obj['parentPath']].get('path')
    return route_obj
