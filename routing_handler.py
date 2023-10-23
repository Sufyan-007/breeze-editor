from utils.path_extractor import get_path_without_ext
from component_generator import generate_imports_code
from utils.app_consts import NEW_LINE_CHAR

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
                "redirectTo" : route.get("redirectTo", None)
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

            if route['redirectTo']:
                code += f'''<Route path="{route['path']}" element={{<Navigate to='{route['redirectTo']}' />}} />'''
            else:
                code += f'''
                <Route path="{route['path']}" element={{<{self.get_comp_name_by_id(route['component'])} />}}{' index' if route['path'] == '/' else ''} {'/' if not route['childRoutes'] else ''}>
                '''
                if route['childRoutes']:
                    for childRoute in route['childRoutes']:
                        code += f'''
                        {"".join(self.generate_routing_code([childRoute]) )}
                        '''
                    code += '</Route>'
            
        return code


    def get_app_routing_code(self, routing_code):
        react_code = f'''
        import React from 'react';
        import {{ Routes, Route, Navigate, BrowserRouter }} from 'react-router-dom';

        function App() {{
            return (
            <BrowserRouter>
                <Routes>
                    {routing_code}
                </Routes>
            </BrowserRouter>
            );
        }}

        export default App;
        '''

        # print(react_code)

        return react_code

