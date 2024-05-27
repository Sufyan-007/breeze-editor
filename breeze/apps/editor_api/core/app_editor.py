
from .api_client_generator import GenerateAPIClient
from .reducer_generator import ReducerGenerator
from .redux_store_generator import ReduxStoreGenerator
from common.utils.config_reader import read_config_file, read_file_json, write_file
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
from .component_generator import ComponentGenerator, gen_single_import
from .helpers.routing_handler import RouteHandler
import json
from common.utils.formatter import format_by_prettier,format_val
import yaml
from common.utils.file_helper import create_parent_dir_if_not_exists
import copy
from .helpers.replace_variable import replace_variable

## should be added later to common.utils.app_consts
NEW_COMP_FORMAT={
    "name": "$NAME",
    "containingFile": "components/$NAME.js",
    "stateVars": [],
    "propsVars": [],
    "otherVars": [],
    "refVars": [],
    "componentType" : "CUSTOM",
    "functions": [],
    "$id":"$NAME",
    "html": {"_id":"$NAME"},
    "wrapper_store": None,
    "imports": { "components": [], "other": [
        {
            "TYPE": "THIRD_PARTY",
            "from": "react-bootstrap",
            "import_entity": "Container",
            "import_type": "SINGLE"
        },
        {
          "TYPE": "THIRD_PARTY",
          "from": "react",
          "import_entity": "useEffect",
          "import_type": "SINGLE"
        }] 
    },
    "hooks": [],
    "html_elements":{
        "$NAME":{
            "type": "Element",
            "elementType": "HTML",
            "typeId": "DIV",
            "tagName": "div",
            "attributes": {
                "className": { "type": "LITERAL", "value": "" },
                "id": { "type": "LITERAL", "value": "$NAME" }
            },
            "children": [
                {"_id":"$NAME-0"},
                {"_id":"$NAME-1"}
            ]
        },
        "$NAME-0":{
            "type": "text", 
            "text": "Hello world" 
        },
        "$NAME-1":{
            "type":"Element",
            "elementType":"HTML",
            "typeId":"DIV",
            "tagName":"div",
            "attributes": {
                "className": { "type": "LITERAL", "value": "" },
                "id": { "type": "LITERAL", "value": "$NAME-1" }
            },
            "children":[
                {"_id":"$NAME-1-0"}
            ]
        },
        "$NAME-1-0":{
            "type":"text",
            "text": "BYe"
        }
    }
}


class AppEditor:
    
    app_config_dir = None
    app_config = {}
    comp_config = {} 
    # mapping_config = {}
    routing_config = None
    reducer_config = None
    redux_store_config = None
    
    def __init__(self,project_name):
        # self.project_name = project_name
        self.app_config_dir = f"{CONFIG_PATH}/{project_name}"
        self.app_config['APP_CONFIG_PATH'] = f"{CONFIG_PATH}/{project_name}"
        self.read_config()
        
    
    def read_config(self):
        self.app_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        self.app_config['APP_SOURCE_DIR'] = f"{self.app_config['path']}/{self.app_config['name']}/{self.app_config['components_src_dir']}"
        self.app_config['APP_CONFIG_PATH'] = self.app_config_dir
        # Read config of component written in component_config file
        self.comp_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['COMPONENT_CONFIG'])
        # Read component config from different files and prepare map of config for all
        
        # self.prepare_comp_config()
        self.context_comp_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['CONTEXT_COMPONENT_CONFIG'])
        self.reducer_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['REDUCER_CONFIG'])
        self.redux_store_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['REDUX_STORE_CONFIG'])
        self.app_config['MAPPINGS'] = {}
        self.app_config['CSS_CONFIG'] = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['CSS_CONFIG'])
        # self.prepare_path_mappings() 
        
        self.routing_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['ROUTING_CONFIG'])
    
    
    def modify_main_component(self):
        default_comp_config = self.comp_config[self.app_config['defaultComponent']]
        with open(f"{self.app_config['path']}/{self.app_config['name']}/src/App.js", "w") as component_file:
            component_code = f"""
                import React from 'react';
                {gen_single_import(default_comp_config['name'], default_comp_config['containingFile'])}

                function App() {{
                    return (
                        <{default_comp_config['name']} />
                    );
                }}

                export default App;
            """

            formatted_code = format_by_prettier(component_code)
            component_file.write(formatted_code)
        route_handler = RouteHandler(self.app_config, self.routing_config, self.comp_config)
        react_code = route_handler.handle_routing_code()
        print("------")
        print(react_code)
        with open(f"{self.app_config['path']}/{self.app_config['name']}/src/App.js", "w") as component_file:
            formatted_code = format_by_prettier(react_code)
            component_file.write(formatted_code)
    
    
    
    # returns /configurations/<project>/component_config.json
    def get_comp_config(self):
        return self.comp_config
    
    def get_basic_config(self):
        return self.app_config
    
    # returns /configurations/<project>/routing_config.json
    def get_router_config(self):
        
        return self.routing_config
    
    # returns /configurations/<project>/reducer_config.json
    def get_reducer_config(self):
        return self.reducer_config
    
    # returns /configurations/<project>/redux_store_config.json
    def get_redux_store_config(self):
        return self.redux_store_config
    
    # Writes or OverWrites component 'comp' in /configurations/<project>/component_config.json 
    # Triggers re-write of the <comp>.js file in generated project
    # Differes from write_components in app_generator, only for writing single specified component
    def write_component(self,comp):
        
        # Updating component_config.json
        print(comp['name'])
        self.comp_config[comp['name']] = comp
        comp_config_path = f"{self.app_config_dir}/{CONFIG_FILES_PATH['COMPONENT_CONFIG']}"
        write_file(f"{comp_config_path}.json", json.dumps(self.comp_config))
        conf=copy.deepcopy(self.comp_config)
        # Writing target component in generated project 
        comp_generator = ComponentGenerator(
            all_comp_config=self.comp_config, 
            app_config=self.app_config,
            all_context_comp_config=self.context_comp_config,
            all_store_config=self.redux_store_config,
            all_reducer_config=self.reducer_config
            # mapping_config=self.mapping_config
            )
        comp_generator.write_component(comp)
        return conf
    
    # Creates a new component based on NEW_COMP_FORMAT with given name 
    # use write_component() to make changes
    def add_component(self,name,type):
        name=name.replace(' ',"")
        comp=NEW_COMP_FORMAT.copy()
        replace_variable(comp,"$NAME",name)
        comp["type"] = type
        config=self.write_component(comp)
        
        return {"config":config, "comp":name}
    
    # Adds a new route to specified component,
    #!!! routes preferably placed in a new file that's imported to App.js to avoid re-writing it
    def add_route(self,route_obj):
        print(route_obj)
        if route_obj.get('path')[0]!='/':
            route_obj['path'] = "/"+route_obj.get('path')        
        if route_obj.get('component'):
            route_obj.pop('redirectTo') if route_obj.get('redirectTo') else ''
        elif route_obj['redirectTo']:
            route_obj.pop('component') if route_obj.get('component') else ''
        for i,routes in enumerate(self.routing_config["routes"]):
            if routes["path"] ==route_obj['path']:
                # previous code : replacing the conflicting route
                # self.routing_config["routes"][i] = route_obj
                # break
                return {'error': 'can\'t have two routes with same path'}
        else:
            self.routing_config["routes"].append(route_obj)
        
        routing_config_path = f"{self.app_config_dir}/{CONFIG_FILES_PATH['ROUTING_CONFIG']}"
        write_file(f"{routing_config_path}.json", json.dumps(self.routing_config))
        self.modify_main_component()
        return self.routing_config
    
    def set_all_routes(self, allRoutes):
        try:
            is_unique = self.check_unique_route_paths(allRoutes)
            if is_unique is False:
                return {'error': 'Duplicate route paths are not allowed'}
            self.routing_config["routes"] = allRoutes
            routing_config_path = f"{self.app_config_dir}/{CONFIG_FILES_PATH['ROUTING_CONFIG']}"
            write_file(f"{routing_config_path}.json", json.dumps(self.routing_config))
        except Exception as e:
            print("Error route config ", e)
        self.modify_main_component()
        self.routing_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['ROUTING_CONFIG'])
        return self.routing_config
    
    def check_unique_route_paths(self, allRoutes):
        allPaths = [route['path'] for route in allRoutes]
        if len(allPaths) == len(list(set(allPaths))):
            return True
        else:
            return False
        
    def add_child_route(self, child_object):
        for route in self.routing_config['routes']:
            if route['path'] == child_object['parentPath']:
                child_object.pop('parentPath')
                if route.get('childRoutes') is None:
                    route['childRoutes'] = []
                if child_object['component']:
                    child_object.pop('redirectTo')
                elif child_object['redirectTo']: 
                    child_object.pop('component')
                    
                route['childRoutes'].append(child_object)
                route_handler = RouteHandler(self.app_config, self.routing_config, self.comp_config)
                react_code = route_handler.handle_routing_code()
                with open(f"{self.app_config['path']}/{self.app_config['name']}/src/App.js", "w") as component_file:
                    formatted_code = format_by_prettier(react_code)
                    component_file.write(formatted_code)
                return {'case': True, 'res' : self.routing_config}
        return {'case' : False, 'res' : 'No matching rounds were present'}
        
    def write_reducers(self):
        reducer_generator = ReducerGenerator(all_reducer_config=self.reducer_config, app_config=self.app_config)
        reducer_generator.write_all_reducers()

    def write_reducers_config(self,reducer_config):
        self.reducer_config = reducer_config
        reducer_config_path = f"{self.app_config_dir}/{CONFIG_FILES_PATH['REDUCER_CONFIG']}"
        write_file(f"{reducer_config_path}.json", json.dumps(self.reducer_config))
        self.write_reducers()
        return self.reducer_config

    def write_redux_store(self):
        redux_store_generator = ReduxStoreGenerator(all_redux_store_config=self.redux_store_config,all_reducer_config=self.reducer_config, app_config=self.app_config,all_comp_config=self.comp_config)
        redux_store_generator.write_all_store()
        
    def write_redux_config(self,redux_config):
        self.redux_store_config=redux_config
        redux_config_path = f"{self.app_config_dir}/{CONFIG_FILES_PATH['REDUX_STORE_CONFIG']}"
        write_file(f"{redux_config_path}.json", json.dumps(self.redux_store_config))
        self.write_redux_store()
        return self.redux_store_config
    
    def get_service_config(self):
        service_config = {
            "servers":[],
            "tags":[],
            "paths":{},
            "components":{"schemas":{}}
        }
        try:
            with open(f"{self.app_config['APP_CONFIG_PATH']}/yaml/sample_swagger.yml") as file:
                service_config = yaml.full_load(file)
        except:
            print ("Failed to load service config file")
        return service_config
    
    def write_services(self):
        api_client_generator = GenerateAPIClient(app_config=self.app_config)
        api_client_generator.read_yaml()
    
    def write_service_config(self, service_config):
        service_config_path = f"{self.app_config['APP_CONFIG_PATH']}/yaml"
        create_parent_dir_if_not_exists(service_config_path)
        with open(service_config_path+"/sample_swagger.yml", 'w') as file:
            yaml.dump(service_config, file,default_flow_style=False)
        self.write_services()
        return service_config