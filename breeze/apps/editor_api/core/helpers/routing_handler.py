from common.utils.path_extractor import get_path_without_ext
from common.utils.app_consts import NEW_LINE_CHAR
from .function_code_generator import FunctionCodeGenerator
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
from common.utils.config_reader import write_file
import json
import re
from apps.directory_management.core.directory_management_service import DirectoryManager
class RouteHandler:
    app_config = None
    route_config = None
    # route_config_with_nested = None
    comp_config = None

    def __init__(self, app_config, route_config, comp_config):
        self.app_config = app_config
        self.route_config = route_config
        self.comp_config = comp_config
    
    def add_params_to_route_object(self):
        for full_path_route_key in self.route_config.get('routes'):
            params = []
            for i in full_path_route_key.split('/'):
                if len(i) > 1 and i[0] == ':':
                    params.append(i[1:])
            self.route_config['routes'][full_path_route_key]['params'] = params
      
    def rewrite_clean_route_config(self, updated_route_config):
        for route in list(updated_route_config.get('routes').values()):
            keys_to_remove = [key for key, val in route.items() if val is None or val == []]
            for key in keys_to_remove:
                del route[key]
            
        routing_config_path = f"{CONFIG_PATH}/{self.app_config['name']}/{CONFIG_FILES_PATH['ROUTING_CONFIG']}"
        write_file(f"{routing_config_path}.json", json.dumps(updated_route_config))
        
    def extract_function_details(self, js_function, id):
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
        
    def create_route_property_sub_config(self, function, id):
        if function == None or function == '':
            return None
        elif isinstance(function, dict) and function['implementation']:
            print("===========function===========")
            print(function)
            return function
        else:
            print("----------------extract_function_details(function)--------------------")
            try:
                return self.extract_function_details(function, id)
            except Exception as e:
                print("error in extract_function_details")
                print(e)
                print('function: ', function, 'id: ', id)
            return None
    
    def transform_route_config(self, original_config):
        for route in list(original_config.get('routes').values()):
            print("==========transform_route_config============")
            print(route)
            route["action"] = self.create_route_property_sub_config(route.get("action", None), route['path']+'-action')
            route["loader"] = self.create_route_property_sub_config(route.get("loader", None), route['path']+'-loader')
            route["lazy"] = self.create_route_property_sub_config(route.get("lazy", None), route['path']+'-lazy')
            route["shouldRevalidate"] = self.create_route_property_sub_config(route.get("shouldRevalidate", None), route['path']+'-shouldRevalidate')

    def get_comp_name_by_id(self, cmp_id):
        return self.comp_config[cmp_id]['name']
    
    def handle_routing_code(self):
        self.transform_route_config(self.route_config)
        # write the implementation object in the routing_config
        self.add_params_to_route_object()
        self.rewrite_clean_route_config(self.route_config)
        imported_components = []
        print("-----------------route_config--------------------")
        print(self.route_config)
        for rt in list(self.route_config['routes'].values()):
            if rt.get('component') is not None and rt['component'] not in imported_components:
                imported_components.append(rt['component'])
            if rt.get('errorElement') is not None and rt['errorElement'] not in imported_components and rt.get('errorElement'):
                imported_components.append(rt['errorElement'])
            if rt.get('hydrateFallbackElement') is not None and rt['hydrateFallbackElement'] not in imported_components:
                imported_components.append(rt['hydrateFallbackElement'])

        import_statements = []
        
        
        # Handle import for components
        for ic in imported_components:
            related_comp = self.comp_config[ic]
            directory_manager= DirectoryManager(self.app_config["name"])
            comp_path = directory_manager.get_path_from_file_id(related_comp["file_id"],relative_path=True)
         
            
            
            
            comp_path = get_path_without_ext(comp_path)

            import_statement = f'import {related_comp["name"]} from \'/{comp_path}\';'
            import_statements.append(import_statement)

        print(import_statements)

        routing_code = self.generate_routing_code(list(self.route_config['baseRoutes'].keys()))
        print("---------routing_code---------")
        print(routing_code)
        
        generated_code = self.get_app_routing_code(routing_code)

        print("---------generated_code---------")
        print(generated_code)
        generated_code =  f'''
            {NEW_LINE_CHAR.join(import_statements)}

            {generated_code}    
        '''

        return generated_code
    
    def generate_routing_code(self, route_ids, is_child=False):

        code = ""
        for route_id in route_ids:
            route=self.route_config['routes'][route_id]
            props_code = self.generate_route_props(route)
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
                <Route {path_attribute} element={{<{self.get_comp_name_by_id(route['component'])} {element_prop if element_prop else ''} />}} {props_code} {route_end}>
                '''
                if route.get('childRoutes', None):
                    for child_route_id in list(route['childRoutes'].keys()):
                        code += f'''
                        {"".join(self.generate_routing_code([child_route_id], is_child=True))}
                        '''
                    code += '</Route>'
            
        return code


    def generate_route_props(self, route_config):
        
        props_code = []

        print("ROUTE_CONFIG")

        print(route_config)

        if route_config.get('caseSensitive'):
            props_code.append('caseSensitive')
        
        if route_config.get('index'):
            props_code.append('index')
            
        if route_config.get("action", None):
            code = "action = {"
            code += FunctionCodeGenerator.generate_function(route_config['action']['implementation'], None)
            code += "\n }"
            props_code.append(code)

        if route_config.get("loader",  None):
            code = "loader = {"
            code += FunctionCodeGenerator.generate_function(route_config['loader']['implementation'], None)
            code += "\n }"
            props_code.append(code)
            
        if route_config.get("errorElement", None):
            code = f" errorElement={{<{self.get_comp_name_by_id(route_config['errorElement'])} />}} "
            props_code.append(code)

        if route_config.get("hydrateFallbackElement", None):
            code = f" hydrateFallbackElement={{<{self.get_comp_name_by_id(route_config['hydrateFallbackElement'])} />}} "
            props_code.append(code)

        if route_config.get("shouldRevalidate", None):
            code = " shouldRevalidate = {"
            code += FunctionCodeGenerator.generate_function(route_config['shouldRevalidate']['implementation'], None)
            code += "\n } "
            props_code.append(code)

        if route_config.get("lazy", None):
            code = " lazy = {"
            code += FunctionCodeGenerator.generate_function(route_config['lazy']['implementation'], None)
            # code = f" lazy = {{ () => import({get_path_without_ext(route_config['component'])})}} "
            code += "\n } "
            props_code.append(code)

        print(props_code)
        return "  ".join(props_code)

    def get_app_routing_code(self, routing_code):
        react_code = f'''
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

