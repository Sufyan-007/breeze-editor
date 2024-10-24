import random
import string, re
from ..core.post_edit_operations import get_routing_code

from apps.common.constants.consts import CONFIG_FILES_PATH, CONFIG_PATH
from apps.common.utils.file_helpers.json_handler import read_project_config_file, read_json_file, write_json_file
from apps.directory_management.core.directory_management_service import DirectoryManager
from apps.common.constants.enums.ResourceCategory import ResourceCategory

def generate_layout_route_key():
    # Generate a unique key for layout routes
    return f"/layout__{''.join(random.choices(string.ascii_lowercase + string.digits, k=9))}__"

def include_all_routes_accessory_data(project_name, nodes):
    app_config_dir = f"{CONFIG_PATH}/{project_name}"
    comp_config_index = read_json_file(f"{app_config_dir}/{ResourceCategory.COMPONENTS.value}/index")
    
    for route_obj in nodes:
        route_obj['componentName'] = comp_config_index[route_obj['componentId']]
    return nodes

def process_route_config(project_name, routing_config={}):
    try:
        app_config_dir = f"{CONFIG_PATH}/{project_name}"
        app_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        comp_config_index = read_json_file(f"{app_config_dir}/{ResourceCategory.COMPONENTS.value}/index")
        if routing_config == {}:
            routing_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['ROUTING_CONFIG'])
        react_code = get_routing_code(app_config, routing_config, comp_config_index, )
        directory_manager= DirectoryManager(project_name)
        directory_manager.save_file("ROUTE_COMPONENT",react_code)
        
    except Exception as e:
        print("Error while processing and saving config file.")
        print("Error: ", e)
        raise e
           
def get_filtered_object(data, exclude_keys):
    return {key: value for key, value in data.items() if key not in exclude_keys}


def get_routing_config(project_id="", routing_config={}):
    if routing_config == {}:
        if project_id == "":
            raise ValueError("project id is missing")
        routing_config = read_project_config_file(f"{CONFIG_PATH}/{project_id}", CONFIG_FILES_PATH['ROUTING_CONFIG'])
    return routing_config
    
def rewrite_clean_route_config(project_name, updated_route_config, route_id):
    for route in list(updated_route_config.values()):
        if route_id == route.get('id'):
            keys_to_remove = [key for key, val in route.items() if val is None or val == [] or val == ""]
            for key in keys_to_remove:
                del route[key]
            break
        
    # line as per this scenario: project_id and project are same for the time being
    routing_config_path = f"{CONFIG_PATH}/{project_name}/{CONFIG_FILES_PATH['ROUTING_CONFIG']}"
    write_json_file(f"{routing_config_path}.json", updated_route_config)
    
def extract_function_details(js_function, id):
    function_pattern = r'(async\s+)?(?:function\s+(\w+)\s*)?\(([^)]*)\)\s*{([^}]*)}'
    match_function = re.search(function_pattern, js_function, re.DOTALL)
    arrow_function_pattern = r'(async\s+)?\s*\(\s*({[^}]*}|[^)]*)\s*\)\s*=>\s*(\{.*\}|[^{]*)\s*$'
    
    js_Arrow_function = js_function[1:-1] if js_function.startswith('{') else js_function
    match_arrow_function = re.search(arrow_function_pattern, js_Arrow_function, re.DOTALL)
    if match_function:
        is_async = bool(match_function.group(1))
        function_name = match_function.group(2) or ''
        parameters = match_function.group(3).strip()
        body = match_function.group(4).strip()

        if parameters:
            if parameters.startswith('{'):
                # Destructured parameters
                parameter_list = []
                for param in parameters[1:-1].split(','):
                    name = param.split(':')[0].strip()
                    parameter_list.append({'name': name})
                destructured = True
            else:
                # Non-destructured parameters
                parameter_list = [{'name': param.strip()} for param in parameters.split(',')]
                destructured = False
        else:
            # No parameters
            parameter_list = []
            destructured = False

    elif match_arrow_function:
        is_async = bool(match_arrow_function.group(1))
        function_name = ''
        parameters = match_arrow_function.group(2).strip()
        body = match_arrow_function.group(3).strip()
        body_match = re.search(r'\{([^{}]*)\}$|([^{}]*)$', body)
        if (body_match.group(1) != None):
            body = body_match.group(1)
        elif (body_match.group(2) != None):
            body = body_match.group(2)
        else:
            body = ''

        if parameters.startswith('{'):
            # Destructured parameters
            parameter_list = []
            for param in parameters[1:-1].split(','):
                name = param.split(':')[0].strip()
                parameter_list.append({'name': name})
            destructured = True
        else:
            # Non-destructured parameters
            parameter_list = [{'name': param.strip()} for param in parameters.split(',')]
            destructured = False

    else:
        return None  # No match found

    if body.startswith('{') and body.endswith('}'):
        body = body[1:-1]
    return {
        'implementation': {
            # we are using anonymous function only but we can have 
            # named functions as well, so keeping the name key blank 
            # and function type anonymous for now
            
            'name': "",
            'isAnonymous': True,
            
            # 'name': function_name,
            # 'isAnonymous': not function_name,
            
            '$id': f'FUNCTIONS-{id}',
            'parameters': {
                'destructured': destructured,
                'list': parameter_list
            },
            'isAsync': is_async,
            'functionBody': body
        }
    }
    
def create_route_property_sub_config(function, id):
    if function == None or function == '':
        return None
    elif isinstance(function, dict) and function['implementation']:
        print("===========function===========")
        print(function)
        return function
    else:
        print("----------------extract_function_details(function)--------------------")
        try:
            return extract_function_details(function, id)
        except Exception as e:
            print("error in extract_function_details")
            print(e)
            print('function: ', function, 'id: ', id)
        return None

def transform_route_config(original_config, route_id):
    for route in list(original_config.values()):
        if route_id == route.get('id'):
            print("==========transform_route_config============")
            print(route)
            route["action"] = create_route_property_sub_config(route.get("action", None), route['path']+'-action')
            route["loader"] = create_route_property_sub_config(route.get("loader", None), route['path']+'-loader')
            route["lazy"] = create_route_property_sub_config(route.get("lazy", None), route['path']+'-lazy')
            route["shouldRevalidate"] = create_route_property_sub_config(route.get("shouldRevalidate", None), route['path']+'-shouldRevalidate')
            break

def handle_advance_prop_details(route_config, route_obj):
    props_to_be_handled = ["action", "loader", "lazy", "shouldRevalidate"]
    for route in list(route_config.values()):
        if route['id'] == route_obj.get('id'):
            for prop in props_to_be_handled:
                if route.get(prop) != None:
                    route[prop] = route_obj[prop]
            break