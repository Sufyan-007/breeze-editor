import json
import re
from apps.common.constants.consts import CONFIG_FILES_PATH, CONFIG_PATH
from apps.common.utils.file_helpers.json_handler import write_json_file
from apps.code_generator.core.generate_routing_code import get_routing_code

def RouteHandler():
    _app_config = None
    _route_config = None
    _comp_config_index = None

    def initialize(app_config, route_config, comp_config_index):
        nonlocal _app_config
        nonlocal _route_config
        nonlocal _comp_config_index
        _app_config = app_config
        _route_config = route_config
        _comp_config_index = comp_config_index        
    
    def add_params_to_route_object():
        for full_path_route_key in _route_config.get('routes'):
            params = []
            for i in full_path_route_key.split('/'):
                if len(i) > 1 and i[0] == ':':
                    params.append(i[1:])
            _route_config['routes'][full_path_route_key]['params'] = params
      
    def rewrite_clean_route_config(updated_route_config):
        for route in list(updated_route_config.get('routes').values()):
            keys_to_remove = [key for key, val in route.items() if val is None or val == []]
            for key in keys_to_remove:
                del route[key]
            
        routing_config_path = f"{CONFIG_PATH}/{_app_config['name']}/{CONFIG_FILES_PATH['ROUTING_CONFIG']}"
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
    
    def transform_route_config(original_config):
        for route in list(original_config.get('routes').values()):
            print("==========transform_route_config============")
            print(route)
            route["action"] = create_route_property_sub_config(route.get("action", None), route['path']+'-action')
            route["loader"] = create_route_property_sub_config(route.get("loader", None), route['path']+'-loader')
            route["lazy"] = create_route_property_sub_config(route.get("lazy", None), route['path']+'-lazy')
            route["shouldRevalidate"] = create_route_property_sub_config(route.get("shouldRevalidate", None), route['path']+'-shouldRevalidate')
    
    def handle_routing_code(_app_config, _route_config, _comp_config_index):
        
        # create clean and properly formatted config for code generation
        transform_route_config(_route_config)
        add_params_to_route_object()
        rewrite_clean_route_config(_route_config)
        
        # get the generated code from code_generator module
        generated_routing_code = get_routing_code(_route_config, _comp_config_index, _app_config)
        return generated_routing_code
    
    return initialize, handle_routing_code
    
    
