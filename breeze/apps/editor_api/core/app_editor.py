from .helpers.style_handler import StyleHandler
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
import copy
import subprocess
from .project_generation_progress import ProjectGenerationProgress
from .helpers.dependencies_manager import DependencyManager



## should be added later to common.utils.app_consts
NEW_COMP_FORMAT={
    "name": "$NAME",
    "containingFile": "components/$NAME.js",
    "propsVars": [],
    "resources": [],
    "componentType" : "CUSTOM",
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
        
    def get_dependencies(self):
        return self.app_config.get('dependencies', {})

    def add_package_to_dependencies(self, package_name, package_version):
        # Check if dependencies key exists
        if 'dependencies' not in self.app_config:
            self.app_config['dependencies'] = {}
        
        # Add or update the package with its version
        self.app_config['dependencies'][package_name] = package_version
        
        # Write the updated configuration to the file
        write_file(f"{self.app_config_dir}/app_basic_config.json", json.dumps(self.app_config))
         
        # Install dependencies after adding the package
        self.install_dependencies()
        
        # Return the updated configuration
        return self.app_config
    
    def install_dependencies(self):
       project_name = self.app_config['name']
       app_dependencies = self.app_config['dependencies']
       package_json = read_file_json(f"{self.app_config['path']}/{self.app_config['name']}/package.json")
       print(package_json)
       for dep in app_dependencies:
           package_json['dependencies'][dep] = app_dependencies[dep]
       package_json['devDependencies'] = {}
       package_json['devDependencies']['web-vitals'] = "^3.5.0"
       write_file(f"{self.app_config['path']}/{self.app_config['name']}/package.json", json.dumps(package_json))
       process = subprocess.Popen(
           ["npm", "install"],
           cwd=f"{self.app_config['path']}/{self.app_config['name']}",
           stdout=subprocess.PIPE,
           stderr=subprocess.PIPE,
           universal_newlines=True,
           text=True, 
       )
       ProjectGenerationProgress.store_process(project_name, process, "installing_dependencies")
       process.wait()
       if package_json['dependencies'].get('bootstrap') is not None:
           DependencyManager().handle_bootstrap(app_config=self.app_config)

    def update_package_in_dependencies(self, package_name, package_version):
        # Check if dependencies key exists
        if 'dependencies' not in self.app_config:
            raise ValueError('Dependencies not found in configuration.')    
        
        # Update the package version if exists, otherwise raise error
        if package_name in self.app_config['dependencies']:
            self.app_config['dependencies'][package_name] = package_version
        else:
            raise ValueError(f'Package {package_name} not found in dependencies.')
        
        # Write the updated configuration to the file
        write_file(f"{self.app_config_dir}/app_basic_config.json", json.dumps(self.app_config))

        # Run npm install again to install dependencies
        self.install_dependencies()
         
        # Return the updated configuration
        return self.app_config
    
    def delete_package_in_dependencies(self, package_name):
       try:
           # Check if dependencies key exists
           if 'dependencies' not in self.app_config:
               raise ValueError('Dependencies not found in configuration.')
           # Delete the package if it exists, otherwise raise error
           if package_name in self.app_config['dependencies']:
               del self.app_config['dependencies'][package_name]
           else:
               raise ValueError(f'Package {package_name} not found in dependencies.')
           # Write the updated configuration to the file
           write_file(f"{self.app_config_dir}/app_basic_config.json", json.dumps(self.app_config))
           # Run npm install again to update dependencies
           self.install_dependencies()
           # Return the updated configuration
           return self.app_config
       except Exception as e:
           raise ValueError(f'Error deleting package in dependencies: {str(e)}')
        
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
        comp=copy.deepcopy(NEW_COMP_FORMAT)
        replace_variable(comp,"$NAME",name)
        comp["type"] = type
        config=self.write_component(comp)
        
        return {"config":config, "comp":name}
         
    def set_parent_initial_parent(self, route_obj, intial_parent_path):
        if route_obj.get('childRoutes'):
            for path in route_obj.get('childRoutes').keys():
                child_obj = self.routing_config["routes"][path]
                child_obj['initialParentPath'] = intial_parent_path
                if route_obj['path'] != child_obj['parentPath']:
                    child_obj['parentPath'] = route_obj['path']    
                self.set_parent_initial_parent(child_obj, intial_parent_path)
                   
    # Adds a new route to specified component,
    #!!! routes preferably placed in a new file that's imported to App.js to avoid re-writing it
    
    def add_edit_base_route(self, route_obj):
        print(route_obj)
        if route_obj.get('path')[0]!='/':
            route_obj['path'] = "/"+route_obj.get('path')
        if route_obj['path'][-1]=='/' and route_obj['path'][0] != '/':
            route_obj['path'] = route_obj['path'][:-1]      
        if route_obj.get('component'):
            route_obj.pop('redirectTo') if route_obj.get('redirectTo') else ''
        elif route_obj.get('redirectTo'):
            route_obj.pop('component') if route_obj.get('component') else ''
        
        if route_obj.get("prevPath"):
            prev_path = route_obj.pop('prevPath')
            route_obj.pop('fullPath')                
            if route_obj.get('newFullParentPath') not in [None, 'none']:
                parent_obj = self.routing_config['routes'][route_obj['newFullParentPath']]
                route_obj['parentPath'] = parent_obj['path']
                route_obj['initialParentPath'] = parent_obj['initialParentPath'] if parent_obj.get('initialParentPath') else parent_obj['path']
                new_full_path = route_obj['newFullParentPath'] + route_obj['path']
                prev_full_path = prev_path if route_obj['path'] != prev_path else route_obj['path']
                
                if self.routing_config['routes'].get(new_full_path):
                    return {'case': False, 'res': 'error: can\'t have two routes with same path'}
                self.handle_route_path_change_in_child_for_child(
                    route_obj,
                    prev_full_path,
                    new_full_path
                )
                
                self.set_parent_initial_parent(route_obj, route_obj['initialParentPath'])
                          
                # add this changed route's full path to the new parent's childRoutes Object
                parent_route = self.routing_config['routes'][route_obj['newFullParentPath']]
                if 'childRoutes' not in parent_route:
                    parent_route['childRoutes'] = {}
                parent_route['childRoutes'][new_full_path] = {}
                
                if route_obj['path'] != prev_path:
                    del self.routing_config["baseRoutes"][prev_path]
                else:
                    del self.routing_config["baseRoutes"][route_obj['path']]
                route_obj.pop('newFullParentPath')                    
            
            elif route_obj['path'] != prev_path:
                if self.routing_config['routes'].get(route_obj['path']):
                    return {'case': False, 'res': 'error: can\'t have two routes with same path'}
                # change parent path and initial parent path of all nested childs
                # replace all the parts of childRoute paths consisting prevPath
                self.handle_route_path_change_in_child(
                    route_obj,
                    prev_path,
                    route_obj["path"],
                    None,
                    route_obj["path"]
                )
                
                print("==========route_obj===================")
                print(route_obj)
                self.routing_config["baseRoutes"][route_obj['path']] = {}
                del self.routing_config["baseRoutes"][prev_path]
                
            else:
                self.routing_config["routes"][route_obj['path']] = route_obj        
        else:
            if self.routing_config['routes'].get(route_obj['path']):
                return {'case': False, 'res': 'error: can\'t have two routes with same path'}
            self.routing_config["routes"][route_obj['path']] = route_obj 
            self.routing_config["baseRoutes"][route_obj['path']] = {} 
        
        routing_config_path = f"{self.app_config_dir}/{CONFIG_FILES_PATH['ROUTING_CONFIG']}"
        write_file(f"{routing_config_path}.json", json.dumps(self.routing_config))
        self.modify_main_component()
        return {'case': True, 'res': self.routing_config}
    
    def handle_route_path_change_in_child(self, route_obj, prev_path, new_path, parent_path, initial_parent_path):
        if route_obj.get('childRoutes'):
            keys_to_modify = [path for path in route_obj.get('childRoutes').keys()]
            for child_path in keys_to_modify:
                new_child_path = self.replace_first_instance(child_path, prev_path, new_path)
                if self.routing_config['routes'].get(new_child_path):
                    return {'case': False, 'res': 'error: can\'t have two routes with same path'}

                self.handle_route_path_change_in_child(
                    self.routing_config['routes'][child_path],
                    child_path,
                    new_child_path,
                    new_path,
                    initial_parent_path
                )
                
                route_obj.get('childRoutes')[new_child_path] = route_obj.get('childRoutes')[child_path]
                del route_obj.get('childRoutes')[child_path] 
        if route_obj.get('parentPath'):
            route_obj['parentPath'] = parent_path
        if route_obj.get('initialParentPath'):
            route_obj['initialParentPath'] = initial_parent_path
        self.routing_config['routes'][new_path] = route_obj
        del self.routing_config['routes'][prev_path]
    
    def replace_first_instance(self, text, old_path, new_path):
        index = text.find(old_path)
        if index != -1:
            return text[:index] + new_path + text[index + len(old_path):]
        return text

    def add_child_route(self, child_object):
        if route := self.routing_config['routes'].get(child_object['fullParentPath']):
            fullParentPath = child_object.pop('fullParentPath')
            if child_object.get('component'):
                child_object.pop('redirectTo') if child_object.get('redirectTo') else ''
            elif child_object['redirectTo']: 
                child_object.pop('component') if child_object.get('component') else ''

            child_object['path'] = child_object['path'] if child_object['path'][0]=='/' else '/'+child_object['path']
            child_object['path'] = child_object['path'][:-1] if child_object['path'][-1]=='/' else child_object['path']
            child_object['parentPath'] = route['path']
            child_object['initialParentPath'] = route['initialParentPath'] if route.get('initialParentPath') else route['path']
            full_child_path = fullParentPath + child_object['path']
            
            if self.routing_config['routes'].get(full_child_path):
                return {'case': False, 'res': 'error: can\'t have two routes with same path'}
            
            child_routes = self.routing_config['routes'][fullParentPath].get('childRoutes')
            if child_routes is None:
                child_routes = {}
                self.routing_config['routes'][fullParentPath]['childRoutes'] = child_routes
            child_routes[full_child_path] = {}
            
            self.routing_config['routes'][full_child_path] = child_object
            
            route_handler = RouteHandler(self.app_config, self.routing_config, self.comp_config)
            react_code = route_handler.handle_routing_code()
            with open(f"{self.app_config['path']}/{self.app_config['name']}/src/App.js", "w") as component_file:
                formatted_code = format_by_prettier(react_code)
                component_file.write(formatted_code)
            return {'case': True, 'res' : self.routing_config}
        return {'case' : False, 'res' : 'No matching parent route was present'}
    
    def replace_last_instance(self, text, old_path, new_path):
        index = text.rfind(old_path)
        if index != -1:
            return text[:index] + new_path + text[index + len(old_path):]
        return text

    def handle_route_path_change_in_child_for_child(self, route_obj, prev_full_path, new_full_path):
        if route_obj.get('childRoutes'):
            keys_to_modify = [path for path in route_obj.get('childRoutes').keys()]
            for child_path in keys_to_modify:
                relative_child_path = self.routing_config['routes'][child_path]['path']
                new_full_parent_path = new_full_path
                new_child_path = new_full_parent_path + relative_child_path
                if self.routing_config['routes'].get(new_child_path):
                    return {'case': False, 'res': 'error: can\'t have two routes with same path'}

                self.handle_route_path_change_in_child_for_child(
                    self.routing_config['routes'][child_path],
                    child_path,
                    new_child_path
                )
                route_obj.get('childRoutes')[new_child_path] = route_obj.get('childRoutes')[child_path]
                del route_obj.get('childRoutes')[child_path] 
        self.routing_config['routes'][new_full_path] = route_obj
        del self.routing_config['routes'][prev_full_path]
        
    def edit_child_route(self, child_object):
        if child_object.get("prevPath"):
            child_object['path'] = child_object['path'] if child_object['path'][0]=='/' else '/'+child_object['path']
            child_object['path'] = child_object['path'][:-1] if child_object['path'][-1]=='/' else child_object['path']
            
            if child_object.get('newFullParentPath') == 'none':
                if self.routing_config['routes'].get(child_object['path']):
                    return {'case': False, 'res': 'error: can\'t have two routes with same path'}
                
                self.routing_config['baseRoutes'][child_object['path']] = {}
                prev_parent_obj = self.routing_config['routes'][child_object['fullParentPath']]
                del prev_parent_obj['childRoutes'][child_object['fullPath']]
                del child_object['parentPath']
                del child_object['initialParentPath']
                
                self.handle_route_path_change_in_child_for_child(
                    child_object,
                    child_object['fullPath'],
                    child_object['path']
                )
                
                self.set_parent_initial_parent(child_object, child_object['path'])
                child_object.pop('newFullParentPath')
                    
            elif child_object.get('newFullParentPath') not in [None, child_object['fullParentPath']]:
                
                prev_parent_obj = self.routing_config['routes'][child_object['fullParentPath']]
                new_full_path = child_object['newFullParentPath'] + child_object['path']                
                new_parent_obj = self.routing_config['routes'][child_object['newFullParentPath']]                
                if 'childRoutes' not in new_parent_obj:
                    new_parent_obj['childRoutes'] = {}
                new_parent_obj['childRoutes'][new_full_path] = prev_parent_obj['childRoutes'][child_object['fullPath']]
                del prev_parent_obj['childRoutes'][child_object['fullPath']]
                
                child_object['parentPath'] = new_parent_obj['path']
                child_object['initialParentPath'] = new_parent_obj['initialParentPath'] if new_parent_obj.get('initialParentPath') else new_parent_obj['path']
                
                if self.routing_config['routes'].get(new_full_path):
                    return {'case': False, 'res': 'error: can\'t have two routes with same path'}
                self.handle_route_path_change_in_child_for_child(
                    child_object,
                    child_object['fullPath'],
                    new_full_path
                )
                
                self.set_parent_initial_parent(child_object, child_object['initialParentPath'])
                child_object.pop('newFullParentPath')
                
            elif child_object['path'] != child_object['prevPath']:
                new_full_child_path = child_object['fullParentPath'] + child_object['path']
                old_full_child_path = child_object['fullParentPath'] + child_object['prevPath']
                if self.routing_config['routes'].get(new_full_child_path):
                    return {'case': False, 'res': 'error: can\'t have two routes with same path'}
        
                # change parent path and initial parent path of all nested childs
                # replace all the parts of childRoute paths consisting prevPath
                self.handle_route_path_change_in_child_for_child(
                    child_object,
                    old_full_child_path,
                    new_full_child_path
                )
                
                parent_object = self.routing_config["routes"][child_object['fullParentPath']]
                parent_object.get('childRoutes')[new_full_child_path] = parent_object.get('childRoutes')[old_full_child_path]
                del parent_object.get('childRoutes')[old_full_child_path]                
                
                if child_object.get('childRoutes'):
                    for path in child_object.get('childRoutes').keys():
                        self.routing_config["routes"][path]['parentPath'] = child_object["path"]
            else:
                self.routing_config["routes"][child_object['fullPath']] = child_object   
            child_object.pop('prevPath')
            child_object.pop('fullPath')
            child_object.pop('fullParentPath')
            
            route_handler = RouteHandler(self.app_config, self.routing_config, self.comp_config)
            react_code = route_handler.handle_routing_code()
            with open(f"{self.app_config['path']}/{self.app_config['name']}/src/App.js", "w") as component_file:
                formatted_code = format_by_prettier(react_code)
                component_file.write(formatted_code)
            return {'case': True, 'res' : self.routing_config}
        
        else:
            return {'case' : False, 'res' : 'Invalid data sent'}
    
    def delete_base_route(self, route):
        if route['fullPath'] in self.routing_config['baseRoutes'].keys() and self.routing_config['routes'][route['fullPath']]:
            self.delete_all_child(route['fullPath'])
            del self.routing_config['baseRoutes'][route['fullPath']]

        route_handler = RouteHandler(self.app_config, self.routing_config, self.comp_config)
        react_code = route_handler.handle_routing_code()
        with open(f"{self.app_config['path']}/{self.app_config['name']}/src/App.js", "w") as component_file:
            formatted_code = format_by_prettier(react_code)
            component_file.write(formatted_code)
        return {'case': True, 'res' : self.routing_config}
    
    def delete_child_route(self, route):
        full_parent_path = self.replace_last_instance(route['fullPath'], route['path'], '')
        del self.routing_config['routes'][full_parent_path]['childRoutes'][route['fullPath']]
        self.delete_all_child(route['fullPath'])
        route_handler = RouteHandler(self.app_config, self.routing_config, self.comp_config)
        react_code = route_handler.handle_routing_code()
        with open(f"{self.app_config['path']}/{self.app_config['name']}/src/App.js", "w") as component_file:
            formatted_code = format_by_prettier(react_code)
            component_file.write(formatted_code)
        return {'case': True, 'res' : self.routing_config}
    
    def delete_all_child(self, parent_path):
        if self.routing_config['routes'][parent_path].get('childRoutes'):
            for path in self.routing_config['routes'][parent_path].get('childRoutes').keys():
                self.delete_all_child(path)
        del self.routing_config['routes'][parent_path]
    
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
    
    def write_style_files(self):
        StyleHandler.generate_styles_code(self.app_config)