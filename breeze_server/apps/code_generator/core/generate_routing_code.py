import re
from apps.code_generator.utils.function_code_generator import FunctionCodeGenerator
from apps.directory_management.core.directory_management_service import DirectoryManager
from apps.common.utils.path_extractor import get_path_without_ext
from apps.common.constants.consts import NEW_LINE_CHAR, CONFIG_PATH
from apps.common.constants.enums.ResourceCategory import ResourceCategory
from apps.common.utils.file_helpers.config_handler import read_config_file

def get_base_route_list(route_config):
    base_route_ids_list = []
    for route_obj in list(route_config.values()):
        if route_obj.get('parentId') in [None, ""]:
            base_route_ids_list.append(route_obj.get('id'))
    return base_route_ids_list
        
    
def get_routing_code(_route_config, _comp_config_index, _app_config):
    # handle imports for the code generation
    imported_components = []
    print("-----------------_route_config--------------------")
    print(_route_config)
    for rt in list(_route_config.values()):
        if rt.get('componentId') is not None and rt['componentId'] not in imported_components:
            imported_components.append(rt['componentId'])
        if rt.get('errorElementId') is not None and rt['errorElementId'] not in imported_components and rt.get('errorElementId'):
            imported_components.append(rt['errorElementId'])
        if rt.get('hydrateFallbackElementId') is not None and rt['hydrateFallbackElementId'] not in imported_components:
            imported_components.append(rt['hydrateFallbackElementId'])

    
    # Handle import for components
    app_config_dir = f"{CONFIG_PATH}/{_app_config.get('name')}"
    import_statements = []
    for ic_id in imported_components:
        related_comp = _comp_config_index[ic_id]
        directory_manager= DirectoryManager(_app_config["name"])
        related_comp_file = read_config_file(_app_config.get('name'), ResourceCategory.COMPONENTS.value, ic_id)
        file_id = related_comp_file.get('data', {}).get(related_comp, {}).get("file_id")
        comp_path = directory_manager.get_path_from_file_id(file_id,relative_path=True)
        comp_path = get_path_without_ext(comp_path)

        import_statement = f'import {related_comp} from \'/{comp_path}\';'
        import_statements.append(import_statement)
    print(import_statements)
    base_route_ids_list = get_base_route_list(_route_config)
    routing_code = generate_routing_code(_route_config, _comp_config_index, base_route_ids_list, False)
    print("---------routing_code---------")
    print(routing_code)
    
    generated_code = get_app_routing_code(routing_code)

    print("---------generated_code---------")
    print(generated_code)
    generated_code =  f'''
        {NEW_LINE_CHAR.join(import_statements)}

        {generated_code}    
    '''

    return generated_code

def generate_routing_code(_route_config, _comp_config_index, route_ids, is_child=False):
    code = ""
    for route_id in route_ids:
        route=_route_config[route_id]
        props_code = generate_route_props(route, _comp_config_index)
        element_prop = []
        if route.get("props", None) is not None:
            for obj in route["props"]:
                print("id:", obj['id'], "Value:", obj['value'], "name:", obj['name'])
                element_prop_code = f"{obj['name']}={{{obj['value']}}}"
                element_prop.append(element_prop_code)
            element_prop = " ".join(element_prop)
            print(element_prop)
            
        if route.get('redirectTo'):
            code += f'''<Route path="{route['path']}" element={{<Navigate to='{route['redirectTo']}' />}} {props_code} />'''
        else:
            path = route['path'][1:] if is_child and route['path'].startswith('/') else route['path']
            route_end = '/' if not route.get('children', None) else ""
            layout_route_pattern = re.compile(r'^/?layout__[\w-]{9}__$')
            path_attribute = f'path="{path}"' if not layout_route_pattern.match(path) else ''
            code += f'''
            <Route {path_attribute} element={{<{get_comp_name_by_id(route['componentId'], _comp_config_index)} {element_prop if element_prop else ''} />}} {props_code} {route_end}>
            '''
            if route.get('children', None):
                for child_route_id in route['children']:
                    code += f'''
                    {"".join(generate_routing_code(_route_config, _comp_config_index, [child_route_id], is_child=True))}
                    '''
                code += '</Route>'
    return code

def generate_route_props(_route_config, _comp_config_index):
    props_code = []
    print("_route_config")
    print(_route_config)

    if _route_config.get('caseSensitive'):
        props_code.append('caseSensitive')
    
    if _route_config.get('index'):
        props_code.append('index')
        
    if _route_config.get("action", None):
        if type(_route_config['action']) != str and _route_config['action'].get('implementation'):
            code = "action = {"
            code += FunctionCodeGenerator.generate_function(_route_config['action']['implementation'])
            code += "\n }"
            props_code.append(code)
        else:
            props_code.append(f"action={{{_route_config['action']}}}")

    if _route_config.get("loader",  None):
        if type(_route_config['loader']) != str and _route_config['loader'].get('implementation'):
            code = "loader = {"
            code += FunctionCodeGenerator.generate_function(_route_config['loader']['implementation'])
            code += "\n }"
            props_code.append(code)
        else:
            props_code.append(f"loader={{{_route_config['loader']}}}")
        
    if _route_config.get("errorElementId", None):
        code = f" errorElement={{<{get_comp_name_by_id(_route_config['errorElementId'], _comp_config_index)} />}} "
        props_code.append(code)

    if _route_config.get("hydrateFallbackElementId", None):
        code = f" hydrateFallbackElement={{<{get_comp_name_by_id(_route_config['hydrateFallbackElementId'], _comp_config_index)} />}} "
        props_code.append(code)

    if _route_config.get("shouldRevalidate", None):
        if type(_route_config['shouldRevalidate']) != str and _route_config['shouldRevalidate'].get('implementation'):
            code = "shouldRevalidate = {"
            code += FunctionCodeGenerator.generate_function(_route_config['shouldRevalidate']['implementation'])
            code += "\n }"
            props_code.append(code)
        else:
            props_code.append(f"shouldRevalidate={{{_route_config['shouldRevalidate']}}}")

    if _route_config.get("lazy", None):
        if type(_route_config['lazy']) != str and _route_config['lazy'].get('implementation'):
            code = "lazy = {"
            code += FunctionCodeGenerator.generate_function(_route_config['lazy']['implementation'])
            code += "\n }"
            props_code.append(code)
        else:
            props_code.append(f"lazy={{{_route_config['lazy']}}}")

    print(props_code)
    return "  ".join(props_code)

def get_app_routing_code(routing_code):
    react_code = f'''
        import SandBox from './SandBox.jsx';
        import {{ Routes, Route, Navigate, BrowserRouter, createBrowserRouter, createRoutesFromElements }} from "react-router-dom";
    
        const router = createBrowserRouter(
            createRoutesFromElements(
                <Route>
                    {routing_code}
                    <Route path="breeze/sandbox" element={{ <SandBox /> }} />
                </Route>
            )
        );
        
        export default router;
    '''
    return react_code

def get_comp_name_by_id(cmp_id, _comp_config_index):
    return _comp_config_index[cmp_id]
