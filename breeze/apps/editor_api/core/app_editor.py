
from common.utils.config_reader import read_config_file, read_file_json, write_file
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
from .component_generator import ComponentGenerator, gen_single_import
from .helpers.routing_handler import RouteHandler
import json
from common.utils.formatter import format_by_prettier,format_val


## should be added later to common.utils.app_consts
NEW_COMP_FORMAT={
    "name": "Comp",
    "containingFile": "components/Comp.js",
    "stateVars": [],
    "propsVars": [],
    "otherVars": [],
    "functions": [],
    "html": {
      "type": "Element",
      "tagName": "Container",
      "attributes": {
        "className": { "type": "LITERAL", "value": "" },
        "id": { "type": "LITERAL", "value": "" }
      },
      "children": [{ "type": "text", "text": "Hello world" }]
    },
    "wrapper_store": None,
    "imports": { "components": [], "other": [
        {
            "TYPE": "THIRD_PARTY",
            "from": "react-bootstrap",
            "import_entity": "Table, Container, Button, Row, Col, Form, Modal",
            "import_type": "SINGLE"
        },
        {
          "TYPE": "THIRD_PARTY",
          "from": "react",
          "import_entity": "useEffect",
          "import_type": "SINGLE"
        }] 
    },
    "hooks": []
}


# Can be merged with app_generator
# __init__(), modify_main_component() and read_config() carried over from app_generator
# all other functions are newly added and should work within app_generator without changes 
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
    
    # returns /configurations/<project>/routing_config.json
    def get_router_config(self):
        
        return self.routing_config
    
    
    # Writes or OverWrites component 'comp' in /configurations/<project>/component_config.json 
    # Triggers re-write of the <comp>.js file in generated project
    # Differes from write_components in app_generator, only for writing single specified component
    def write_component(self,comp):
        
        # Updating component_config.json
        print(comp['name'])
        self.comp_config[comp['name']] = comp
        comp_config_path = f"{self.app_config_dir}/{CONFIG_FILES_PATH['COMPONENT_CONFIG']}"
        write_file(f"{comp_config_path}.json", json.dumps(self.comp_config))
        
        
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
        
        return self.comp_config
    
    # Creates a new component based on NEW_COMP_FORMAT with given name 
    # use write_component() to make changes
    def add_component(self,name):
        name=name.replace(' ',"").title()
        comp=NEW_COMP_FORMAT.copy()
        comp['name'] = name
        comp['containingFile'] = "components/"+name+".js"
        comp["html"]["attributes"]["id"]["value"]=name
        config=self.write_component(comp)
        
        return {"config":config, "comp":name}
    
    # Adds a new route to specified component,
    #!!! routes preferably placed in a new file that's imported to App.js to avoid re-writing it
    def add_route(self,route,component,redirect_url=None):
        if route[0]!='/':
            route = "/"+route
        
        
        if component:
            route_={"path":route,"component":component}
        elif redirect_url:
            route_={"path":route,"redirectTo":redirect_url}
        for i,routes in enumerate(self.routing_config["routes"]):
            if routes["path"] ==route:
                self.routing_config["routes"][i] = route_
                break
        else:
            self.routing_config["routes"].append(route_)
        
        routing_config_path = f"{self.app_config_dir}/{CONFIG_FILES_PATH['ROUTING_CONFIG']}"
        write_file(f"{routing_config_path}.json", json.dumps(self.routing_config))
        self.modify_main_component()
        return self.routing_config
