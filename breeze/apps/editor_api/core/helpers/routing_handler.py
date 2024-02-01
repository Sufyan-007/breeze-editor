from common.utils.path_extractor import get_path_without_ext
from common.utils.app_consts import NEW_LINE_CHAR
from .function_code_generator import FunctionCodeGenerator

class RouteHandler:
    app_config = None
    route_config = None
    # route_config_with_nested = None
    comp_config = None

    def __init__(self, app_config, route_config, comp_config):
        self.app_config = app_config
        self.route_config = route_config
        self.comp_config = comp_config
    

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
                "childRoutes": [],
                "redirectTo" : route.get("redirectTo", None),
                "action" : route.get("action", None),
                "loader" : route.get("loader", None)
            }

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
        imported_components = []
        print("----")
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
            if route['redirectTo']:
                code += f'''<Route path="{route['path']}" element={{<Navigate to='{route['redirectTo']}' />}} {props_code} />'''
            else:
                code += f'''
                <Route path="{route['path']}" element={{<{self.get_comp_name_by_id(route['component'])} />}}{' index' if route['path'] == '/' else ''} {'/' if not route['childRoutes'] else ''} {props_code}>
                '''
                if route['childRoutes']:
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
            code += FunctionCodeGenerator.generate_function(route_config['action']['implementation'], None)
            code += "\n }"
            props_code.append(code)

        print(props_code)
        return "  ".join(props_code)

    def get_app_routing_code(self, routing_code):
        react_code = f'''
        import React, {{useEffect}} from 'react';
        import {{ Routes, Route, Navigate, BrowserRouter, createBrowserRouter, createRoutesFromElements, RouterProvider }} from "react-router-dom";
        
        const routes = createBrowserRouter (
          createRoutesFromElements(
          <Route>
                {routing_code}
                </Route>
            )
        );
        function App() {{
                
            useEffect(() => {{
                        const handleMessage = (event) => {{
                            if (event.origin === 'http://localhost:3000') {{
                            const id = event.data.id;
                            const highlight = event.data.highlight
                            const elem = document.getElementById(event.data.id)
                            if (elem) {{
                            if (highlight) {{
                                elem.classList.add("custom-highlight")
                            }}
                            else {{
                                elem.classList.remove("custom-highlight")
                            }}
                            }}
                        }}
                                        }};
                        window.addEventListener('message', handleMessage);
                        return () => {{
                        window.removeEventListener('message', handleMessage);
                        }};
            }}, []);
            return (
            <div>
                    <RouterProvider router={{routes}} />
            </div>
            );
        }}

        export default App;
        '''

        # print(react_code)

        return react_code

