from common.utils.path_extractor import get_path_without_ext
from common.utils.app_consts import NEW_LINE_CHAR
from .function_code_generator import FunctionCodeGenerator
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
from common.utils.config_reader import write_file
import json
import re
class RouteHandler:
    app_config = None
    route_config = None
    # route_config_with_nested = None
    comp_config = None

    def __init__(self, app_config, route_config, comp_config):
        self.app_config = app_config
        self.route_config = route_config
        self.comp_config = comp_config
        
    def generate_new_route_config(self, new_route_config):
        required_route_config = [
            {key: val for key, val in route.items() if val is not None and val != []} 
            for route in new_route_config['routes']
        ]
        
        for route in required_route_config:
            self.remove_empty_child_route_keys(route.get('childRoutes', []))
            
        print("=================required_route_config============================")
        print(required_route_config)
        routing_config_path = f"{CONFIG_PATH}/{self.app_config['name']}/{CONFIG_FILES_PATH['ROUTING_CONFIG']}"
        write_file(f"{routing_config_path}.json", json.dumps({ 'routes': required_route_config}))

    def remove_empty_child_route_keys(self, routes_array):
        for route in routes_array:
            keys_to_remove = [key for key, val in route.items() if val is None or val == []]
            for key in keys_to_remove:
                del route[key]
            for child_route in route.get('childRoutes', []):
                self.remove_empty_child_route_keys(child_route.get('childRoutes', []))
    
    def extract_function_details(self, js_function, id):
        function_pattern = r'(async\s+)?(?:function\s+(\w+)\s*)?\(([^)]*)\)\s*{([^}]*)}'
        match_function = re.search(function_pattern, js_function, re.DOTALL)
        arrow_function_pattern = r'(async\s+)?\s*\(\s*({[^}]*}|[^)]*)\s*\)\s*=>\s*(\{.*\}|[^{]*)\s*$'
        match_arrow_function = re.search(arrow_function_pattern, js_function, re.DOTALL)

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
            # body = match_arrow_function.group(3).strip()
            body_match = re.search(r'\{([^{}]*)\}$|([^{}]*)$', match_arrow_function.group(3).strip())
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
                'body': body
            }
        }

        
    def create_route_property_sub_config(self, function, id):
        if function == None or function == '':
            return None
        elif isinstance(function, dict) and function['implementation']:
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
    
    def transform_child_route(self, child_route):
        for route in child_route:
            child_route_path = route['path']
            route["action"] = self.create_route_property_sub_config(route.get("action", None), child_route_path+'-action')
            route["loader"] = self.create_route_property_sub_config(route.get("loader", None), child_route_path+'-loader')
            route["lazy"] = self.create_route_property_sub_config(route.get("lazy", None), child_route_path+'-lazy')
            route["shouldRevalidate"] = self.create_route_property_sub_config(route.get("shouldRevalidate", None), child_route_path+'-shouldRevalidate')
            if route.get("childRoutes"):
                route["childRoutes"] = self.transform_child_route(route["childRoutes"])
    
    def transform_route_config(self, original_config):

        route_config_with_nested = {"routes": []}

        # Create a dictionary to map paths to their respective configurations
        path_to_config = {}
        # Populate path_to_config with initial configurations
        for route in original_config["routes"]:
            path = route["path"]
            path_to_config[path] = {
                "path": path,
                "component": route.get("component"),
                "childRoutes": route.get("childRoutes", []),
                "redirectTo" : route.get("redirectTo", None),
                "action" : self.create_route_property_sub_config(route.get("action", None), path+'-action'),
                "loader" : self.create_route_property_sub_config(route.get("loader", None), path+'-loader'),
                "lazy" : self.create_route_property_sub_config(route.get("lazy", None), path+'-lazy'),
                "shouldRevalidate" : self.create_route_property_sub_config(route.get("shouldRevalidate", None), path+'-shouldRevalidate')
            }
            
            if route.get("childRoutes"):
                self.transform_child_route(route.get("childRoutes", []))

        # Iterate through the routes to add child routes
        for route in original_config["routes"]:
            path = route["path"]
            parent_path = "/".join(path.split("/")[:-1])

            if parent_path in path_to_config:
                path_to_config[parent_path]["childRoutes"].append(path_to_config[path])
            else:
                route_config_with_nested["routes"].append(path_to_config[path])
    
        return route_config_with_nested

    def get_comp_name_by_id(self, cmp_id):
        return self.comp_config[cmp_id]['name']
    
    # def generate_routing_code(self):
    #     converted_route_config = self.transform_route_config(self.route_config)

    #     routing_code = self.generate_routing_code(converted_route_config['routes'])

    def handle_routing_code(self):
        converted_route_config = self.transform_route_config(self.route_config)
        # write the implementation object in the routing_config
        self.generate_new_route_config(converted_route_config)
        print("--------------converted_route_config-----------------")
        print(converted_route_config)
        imported_components = []
        print("-----------------route_config--------------------")
        print(self.route_config)
        for rt in self.route_config['routes']:
            if rt.get('component') is not None and rt['component'] not in imported_components:
                imported_components.append(rt['component'])

        import_statements = []

        # Handle import for components
        for ic in imported_components:
            related_comp = self.comp_config[ic]
            comp_path = get_path_without_ext(related_comp['containingFile'])

            import_statement = f'import {related_comp["name"]} from \'{comp_path}\';'
            import_statements.append(import_statement)

        print(import_statements)

        routing_code = self.generate_routing_code(converted_route_config['routes'])
        
        generated_code = self.get_app_routing_code(routing_code)

        print("--------")
        print(generated_code)
        generated_code =  f'''
            {NEW_LINE_CHAR.join(import_statements)}

            {generated_code}    
        '''

        return generated_code

    def generate_routing_code(self, routes):

        # print(routes)
        code = ""
        for route in routes:
            # print(route)
            props_code = self.generate_route_props(route)
            print(props_code)
            if route.get('redirectTo'):
                code += f'''<Route path="{route['path']}" element={{<Navigate to='{route['redirectTo']}' />}} {props_code} />'''
            else:
                route_end = ' index ' if route['path'] == '/' else ''
                route_end = route_end + '/' if not route.get('childRoutes') else route_end
                code += f'''
                <Route path="{route['path']}" element={{<{self.get_comp_name_by_id(route['component'])} />}} {props_code} {route_end}>
                '''
                if route.get('childRoutes', None):
                    for childRoute in route['childRoutes']:
                        code += f'''
                        {"".join(self.generate_routing_code([childRoute]) )}
                        '''
                    code += '</Route>'
            
        return code


    def generate_route_props(self, route_config):
        
        props_code = []

        print("ROUTE_CONFIG")

        print(route_config)

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
        import {{ Routes, Route, Navigate, BrowserRouter, createBrowserRouter, createRoutesFromElements, RouterProvider }} from "react-router-dom";
        
        export const router = createBrowserRouter (
          createRoutesFromElements(
          <Route>
                {routing_code}
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

        # print(react_code)

        return react_code

