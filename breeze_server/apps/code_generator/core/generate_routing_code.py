import re
from apps.code_generator.utils.function_code_generator import FunctionCodeGenerator
from apps.directory_management.core.directory_management_service import DirectoryManagementGenerator
from apps.common.utils.path_extractor import get_path_without_ext
from apps.common.constants.consts import NEW_LINE_CHAR, CONFIG_PATH
from apps.common.constants.enums.ResourceCategory import ResourceCategory
from apps.common.utils.file_helpers.config_handler import read_config_file

def get_routing_code(_route_config, _comp_config_index, _app_config):
    # handle imports for the code generation
    imported_components = []
    print("-----------------_route_config--------------------")
    print(_route_config)
    for rt in list(_route_config['routes'].values()):
        if rt.get('component_id') is not None and rt['component_id'] not in imported_components:
            imported_components.append(rt['component_id'])
        if rt.get('errorElement_id') is not None and rt['errorElement_id'] not in imported_components and rt.get('errorElement_id'):
            imported_components.append(rt['errorElement_id'])
        if rt.get('hydrateFallbackElement_id') is not None and rt['hydrateFallbackElement_id'] not in imported_components:
            imported_components.append(rt['hydrateFallbackElement_id'])

    
    # Handle import for components
    app_config_dir = f"{CONFIG_PATH}/{_app_config.get('name')}"
    import_statements = []
    for ic_id in imported_components:
        related_comp = _comp_config_index[ic_id]
        directory_manager= DirectoryManagementGenerator(_app_config["name"])
        related_comp_file = read_config_file(_app_config.get('name'), ResourceCategory.COMPONENTS.value, ic_id)
        file_id = related_comp_file.get('data', {}).get(related_comp, {}).get("file_id")
        comp_path = directory_manager.get_path_from_file_id(file_id,relative_path=True)
        comp_path = get_path_without_ext(comp_path)

        import_statement = f'import {related_comp} from \'/{comp_path}\';'
        import_statements.append(import_statement)
    print(import_statements)
    routing_code = generate_routing_code(_route_config, _comp_config_index, list(_route_config['baseRoutes'].keys()), False)
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
        route=_route_config['routes'][route_id]
        props_code = generate_route_props(route, _comp_config_index)
        element_prop = []
        if route.get("props", None) is not None:
            for key in route["props"].keys():
                print("Key:", key, "Value:", route["props"][key])
                if (route["props"][key].strip()):
                    element_prop_code = f"{key}={{{route['props'][key]}}}"
                    element_prop.append(element_prop_code)
            element_prop = " ".join(element_prop)
            print(element_prop)
            
        if route.get('redirectTo'):
            code += f'''<Route path="{route['path']}" element={{<Navigate to='{route['redirectTo']}' />}} {props_code} />'''
        else:
            path = route['path'][1:] if is_child and route['path'].startswith('/') else route['path']
            route_end = '/' if not route.get('childRoutes') else ""
            layout_route_pattern = re.compile(r'^/?layout__[\w-]{9}__$')
            path_attribute = f'path="{path}"' if not layout_route_pattern.match(path) else ''
            code += f'''
            <Route {path_attribute} element={{<{get_comp_name_by_id(route['component_id'], _comp_config_index)} {element_prop if element_prop else ''} />}} {props_code} {route_end}>
            '''
            if route.get('childRoutes', None):
                for child_route_id in list(route['childRoutes'].keys()):
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
        code = "action = {"
        code += FunctionCodeGenerator.generate_function(_route_config['action']['implementation'], None)
        code += "\n }"
        props_code.append(code)

    if _route_config.get("loader",  None):
        code = "loader = {"
        code += FunctionCodeGenerator.generate_function(_route_config['loader']['implementation'], None)
        code += "\n }"
        props_code.append(code)
        
    if _route_config.get("errorElement_id", None):
        code = f" errorElement={{<{get_comp_name_by_id(_route_config['errorElement_id'], _comp_config_index)} />}} "
        props_code.append(code)

    if _route_config.get("hydrateFallbackElement_id", None):
        code = f" hydrateFallbackElement={{<{get_comp_name_by_id(_route_config['hydrateFallbackElement_id'], _comp_config_index)} />}} "
        props_code.append(code)

    if _route_config.get("shouldRevalidate", None):
        code = " shouldRevalidate = {"
        code += FunctionCodeGenerator.generate_function(_route_config['shouldRevalidate']['implementation'], None)
        code += "\n } "
        props_code.append(code)

    if _route_config.get("lazy", None):
        code = " lazy = {"
        code += FunctionCodeGenerator.generate_function(_route_config['lazy']['implementation'], None)
        # code = f" lazy = {{ () => import({get_path_without_ext(_route_config['component'])})}} "
        code += "\n } "
        props_code.append(code)

    print(props_code)
    return "  ".join(props_code)

def get_app_routing_code(routing_code):
    react_code = f'''
    import './styles.js';
    import React, {{useEffect}} from 'react';
    import SandBox from "/src/SandBox";
    import {{ Routes, Route, Navigate, BrowserRouter, createBrowserRouter, createRoutesFromElements, RouterProvider }} from "react-router-dom";
    
    export const router = createBrowserRouter (
        createRoutesFromElements(
            <Route>
                {routing_code}
                <Route path="breeze/sandbox" element={{<SandBox />}} />
            </Route>
        )
    );
    function App() {{
            
        useEffect(() => {{
            const style = document.createElement("style");
            const cssClass =
            ".custom-highlight {{background-color: yellow;outline: red solid 3px ;}}";
            style.appendChild(document.createTextNode(cssClass));
            document.head.appendChild(style);
            const handleMessage = (event) => {{
            
            if (event.origin === "http://localhost:3000") {{
                console.log(event.data)
                if (event.data.func){{
                var fn;
                const functionString ="fn = " + event.data.func
                eval(functionString)
                fn()
                }}
            }}
            }};
            window.addEventListener("message", handleMessage);
            return () => {{
            window.removeEventListener("message", handleMessage);
            }};
        }}, []);
        return (
        <div>
                <RouterProvider router={{router}} />
        </div>
        );
    }}
    
    export default App;
    '''
    return react_code

def get_comp_name_by_id(cmp_id, _comp_config_index):
    return _comp_config_index[cmp_id]
