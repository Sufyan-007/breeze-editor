import os, uuid
import shutil
import random
import string
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
from apps.api_client_generator.utils.uuid_as_key import generate_uuid_as_key
from apps.directory_management.core.directory_management_service import DirectoryManagementGenerator

## should be added later to common.utils.app_consts
NEW_COMP_FORMAT={
    "name": "$NAME",
    "file_id":"$FILE_ID",
    # "containingFile":"components/$NAME",
    "propsVars": [],
    "resources": [],
    "componentType" : "CUSTOM",
    "$id":"$NAME",
    "html": {"_id":"$NAME"},
    "wrapper_store": None,
    "imports": { "components": [], "other": [
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
                "className": { "type": "LITERAL", "value": "" }
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
                "className": { "type": "LITERAL", "value": "" }
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
    usage_config = {}
    routing_helper_data = {}
    # mapping_config = {}
    routing_config = None
    reducer_config = None
    redux_store_config = None
    
    def __init__(self,project_name):
        # self.project_name = project_name
        
        self.project_name= project_name
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
           " ".join(["npm", "install"]),shell=True,
           cwd=f"{self.app_config['path']}/{self.app_config['name']}",
           stdout=subprocess.PIPE,
           stderr=subprocess.PIPE,
           universal_newlines=True,
           text=True, 
       )
       ProjectGenerationProgress.store_process(project_name, process, "installing_dependencies")
       process.wait()
       if package_json['dependencies'].get('bootstrap') is not None:
           DependencyManager().handle_bootstrap(self.directory_manager.get_path_from_file_id("PROJECT_ROOT_FILE"))

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
        
        self.usage_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['USAGE_CONFIG'])
      
        self.directory_management_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['DIRECTORY_MANAGEMENT'])

        
        # self.prepare_comp_config()
        self.context_comp_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['CONTEXT_COMPONENT_CONFIG'])
        self.reducer_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['REDUCER_CONFIG'])
        self.redux_store_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['REDUX_STORE_CONFIG'])
        self.app_config['MAPPINGS'] = {}
        self.app_config['CSS_CONFIG'] = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['CSS_CONFIG'])
        # self.prepare_path_mappings() 
        
        self.directory_manager = DirectoryManagementGenerator(self.project_name)
        
        self.app_root_comp_path = self.directory_manager.get_path_from_file_id("MAIN_COMPONENT") 
        
        self.routing_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['ROUTING_CONFIG'])
    
    
    def modify_main_component(self):
        route_handler = RouteHandler(self.app_config, self.routing_config, self.comp_config)
        react_code = route_handler.handle_routing_code()
        print("------")
        print(react_code)
        
        self.directory_manager.save_file("MAIN_COMPONENT",react_code)
    
    
    
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
        print(comp, "comp")
       
        # Updating component_config.json
        print(comp['name'])
        used_route = comp.get('route_path', None)
        if (used_route):
            del comp['route_path']
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
        print(comp_generator,"222222")
        comp_generator.write_component(comp)
        if self.usage_config == {}:
            self.usage_config = {
                "components": {
                        f"{self.app_config['defaultComponent']}": {
                            "imports": {},
                            "props": {},
                            "variables": {},
                            "usedRoutes": {},
                            "functions": {},
                            "lifecycle": {},
                            "hooks": {},
                            "css": {},
                            "usage": {}
                        }
                    },
                "contexts": {},
                "reducers": {},
                "reduxStore": {},
                "routes": {},
                "imports": {},
                "css": {},
            }
        if not self.usage_config.get('components').get(comp['name']):
            self.usage_config['components'][comp['name']] = {
                "imports": {},
                "props": {},
                "variables": {},
                "usedRoutes":  {used_route: {}} if used_route else {},
                "functions": {},
                "lifecycle": {},
                "hooks": {},
                "css": {},
                "usage": {}
            }
            usage_config_path = f"{self.app_config_dir}/{CONFIG_FILES_PATH['USAGE_CONFIG']}"
            write_file(f"{usage_config_path}.json", json.dumps(self.usage_config))
        return conf
    
    # Creates a new component based on NEW_COMP_FORMAT with given name 
    # use write_component() to make changes
    def add_component(self ,name, comp_type, route_path):
        print(name, comp_type , "name , comp_type 33333333")
        name=name.replace(' ',"")
        comp=copy.deepcopy(NEW_COMP_FORMAT)
        
        
        
        file_name = name + (".tsx" if self.app_config.get("language")=="typescript" else ".jsx")
        
        
        node = self.directory_manager.add_node_to_config(
            parent_id="COMPONENTS",
            tag="COMPONENT",
            node_type="FILE",
            name=file_name
        )
        replace_variable(comp,"$NAME",name)
        replace_variable(comp, "$FILE_ID", node["id"])
        
        comp["type"] = comp_type
        # self.add_component_directory_management(file_name,file_id)
        comp["route_path"] = route_path
        
        config=self.write_component(comp)
        
        return {"config":config, "comp":name}
         
            
    
    
    
    def post_success_function(self, config):
        # Function to run after a successful post request
        print("This function runs after returning a 200 response.")
        print("=================config========================") 
        print(config) 
        print("------------config----------------") 
        print(self.process_and_save_config_file()) 
    
    def generate_layout_route_key(self):
        # Generate a unique key for layout routes
        return f"/layout__{''.join(random.choices(string.ascii_lowercase + string.digits, k=9))}__"
    
    def process_and_save_config_file(self):
        try:
            route_handler = RouteHandler(self.app_config, self.routing_config, self.comp_config)
            react_code = route_handler.handle_routing_code()
            self.directory_manager.save_file("MAIN_COMPONENT",react_code)
            
            return {'case': True, 'res' : { 'config': self.routing_config, 'helper_data' : self.routing_helper_data}}
        except Exception as e:
            print("Error while processing and saving config file.")
            print("Error: ", e)
            return {'case' : False, 'res' : 'Error while processing file'}
    
    def generate_full_path(self, route_obj):
        if route_obj.get('parentPath') not in [None, 'none']:
            return f"{route_obj['parentPath']}{route_obj['path']}"
        else:
            return route_obj.get('path')
    
    def get_full_parent_path_from_child_route(self, child_route):
        path_length = len(child_route.get('path', ''))
        full_path_length = len(child_route.get('fullPath', ''))
        full_parent_path = child_route.get('fullPath', '')[:(full_path_length - path_length)] or ""
        return full_parent_path
    
    def set_parent_initial_parent(self, route_obj, intial_parent_path):
        if route_obj.get('childRoutes'):
            for path in route_obj.get('childRoutes').keys():
                child_obj = self.routing_config["routes"][path]
                child_obj['initialParentPath'] = intial_parent_path
                if route_obj['path'] != child_obj['parentPath']:
                    child_obj['parentPath'] = route_obj['path']    
                self.set_parent_initial_parent(child_obj, intial_parent_path)
                       
    def clean_dict_value(self, input_dict):
        cleaned_dict = {}
        print(input_dict)
        print(type(input_dict))
        for key, value in input_dict.items():
            # Check if value is a string and contains extra quotes
            if isinstance(value, str):
                # Remove leading and trailing single or double quotes
                cleaned_value = value.strip("'\"")
                cleaned_dict[key] = cleaned_value
            else:
                cleaned_dict[key] = value
        
        return cleaned_dict
    
    def replace_first_instance(self, text, old_path, new_path):
        index = text.find(old_path)
        if index != -1:
            return text[:index] + new_path + text[index + len(old_path):]
        return text
    
    def handle_route_path_change_in_child(self, route_obj, prev_path, new_path, parent_path, initial_parent_path):
        if route_obj.get('childRoutes'):
            keys_to_modify = [path for path in route_obj.get('childRoutes').keys()]
            for child_path in keys_to_modify:
                new_child_path = self.replace_first_instance(child_path, prev_path, new_path)
                if self.routing_config['routes'].get(new_child_path):
                    return {'case': False, 'res': 'error: route with same path already exists'}

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
                    return {'case': False, 'res': 'error: route with same path already exists'}

                self.handle_route_path_change_in_child_for_child(
                    self.routing_config['routes'][child_path],
                    child_path,
                    new_child_path
                )
                route_obj.get('childRoutes')[new_child_path] = route_obj.get('childRoutes')[child_path]
                del route_obj.get('childRoutes')[child_path] 
        self.routing_config['routes'][new_full_path] = route_obj
        del self.routing_config['routes'][prev_full_path]
     
    def get_config_obj(self, route, selected_route):
        # selectedRoute and RouterProviderSection are being devoid from route object
        route_section = ['propDetails', 'advancePropDetails']
        prop_name_map = {'parent path': 'parentPath',  "error-element": 'errorElement', "element": 'component', "elementProp": 'props'}
        route_obj = {}
        for section in route_section:
            for prop in route[section]['props']:
                # if value is empty it won't include the key in route object
                # so we use default value while getting the key's value
                print(prop)
                if prop['value']:
                    if prop_name_map.get(prop['name']):
                        prop['name'] = prop_name_map.get(prop['name'])
                    if prop.get('type') == 'key-value-pair':
                        rectified_pair = {}
                        for pair in prop['value']:
                            rectified_pair.update(self.clean_dict_value({pair : prop['value'][pair]})) 
                        prop['value'] = rectified_pair
                    route_obj[prop['name']] = prop['value']
        if not route_obj.get('path', "").strip():
            # here write a functino that returns path 
            route_obj['path'] = self.generate_layout_route_key()
        else:
            route_obj['path'] = route_obj.get('path').strip()
            route_obj['path'] = "/" + route_obj['path'].strip('/')
        if not route_obj.get('component', "").strip():
            route_obj['component'] = ""
        else:
            route_obj['component'] = route_obj.get('component').strip()
        
        if selected_route:
            route_obj['fullPath'] = selected_route.get('fullPath')
            prev_route_parent_path = selected_route.get('parentPath')
            if selected_route.get('childRoutes'):
                route_obj['childRoutes'] = selected_route.get('childRoutes')
            # here parentPath key has full parent path value
            if route_obj.get('parentPath', 'none') != 'none':
                # it is a base route converted to child -> base_edit
                if not prev_route_parent_path:
                    route_obj['newFullParentPath'] = route_obj.get('parentPath')
                    route_obj['prevPath'] = selected_route.get('path')
                # it is a child route updated to a child -> child_edit
                else:
                    route_obj['prevPath'] = selected_route.get('path') 
                    route_obj['fullParentPath'] = self.get_full_parent_path_from_child_route(selected_route) 
                    route_obj['newFullParentPath'] = route_obj.get('parentPath')
            else:
                # it is a base route updated to base route -> base_edit
                if prev_route_parent_path in [None, "none"]:
                    route_obj['newFullParentPath'] = route_obj.get('parentPath')
                    route_obj['prevPath'] = selected_route.get('path')
                # it is a child route converted to base route -> edit_child
                else:
                    route_obj['prevPath'] = selected_route.get('path') 
                    route_obj['fullParentPath'] = self.get_full_parent_path_from_child_route(selected_route) 
                    route_obj['newFullParentPath'] = route_obj.get('parentPath')
        else:
            if route_obj.get('parentPath', 'none') != 'none':
                route_obj['fullParentPath'] = route_obj['parentPath']
        
        self.routing_helper_data['recently_saved_route_fullpath'] = self.generate_full_path(route_obj)
        if route_obj.get('parentPath', "none") != "none":
            route_obj['parentPath'] = self.routing_config['routes'][route_obj['parentPath']].get('path')
        return route_obj
    
    # Adds a new route to specified component,
    #!!! routes preferably placed in a new file that's imported to App.js to avoid re-writing it
    def add_edit_route(self, route):
        print(route)
        route_obj = self.get_config_obj(route, route.get('selectedRoute'))
        print("=============route_obj======================")
        print(route_obj)
        print("=============route_obj======================")
        if not route_obj['component']:
            return {'case': False, 'res': 'error: please select an element!'}
        if route_obj.get('index') and route_obj.get('childRoutes'):
            return {'case': False, 'res': 'error: index routes can\'t have child routes'}
        
        if route.get('selectedRoute') :
            if route_obj.get('parentPath', 'none') != 'none':
                if not route['selectedRoute'].get('parentPath'):
                    return self.add_edit_base_route(route_obj)
                else:
                    return self.edit_child_route(route_obj)
            else:
                if route['selectedRoute'].get('parentPath') in [None, "none"]:
                    return self.add_edit_base_route(route_obj)
                else:
                    return self.edit_child_route(route_obj)
        else:
            if route_obj.get('parentPath'):
                return self.add_child_route(route_obj)
            else:
                return self.add_edit_base_route(route_obj)
    
    def add_edit_base_route(self, route_obj):
        print(route_obj)
        if route_obj.get('path'):
            route_obj['path'] = route_obj.get('path').strip()
            route_obj['path'] = "/" + route_obj['path'].strip('/')     
        if route_obj.get('component'):
            route_obj.pop('redirectTo') if route_obj.get('redirectTo') else ''
        elif route_obj.get('redirectTo'):
            route_obj.pop('component') if route_obj.get('component') else ''
        
        if route_obj.get("prevPath"):
            prev_path = route_obj.pop('prevPath', None)
            route_obj.pop('fullPath', None)
            if route_obj.get('newFullParentPath') not in [None, 'none']:
                parent_obj = self.routing_config['routes'][route_obj['newFullParentPath']]
                route_obj['parentPath'] = parent_obj['path']
                route_obj['initialParentPath'] = parent_obj['initialParentPath'] if parent_obj.get('initialParentPath') else parent_obj['path']
                new_full_path = route_obj['newFullParentPath'] + route_obj['path']
                prev_full_path = prev_path if route_obj['path'] != prev_path else route_obj['path']
                
                if self.routing_config['routes'].get(new_full_path):
                    return {'case': False, 'res': 'error: route with same path already exists'}
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
                route_obj.pop('newFullParentPath', None)                    
            
            elif route_obj['path'] != prev_path:
                if self.routing_config['routes'].get(route_obj['path']):
                    return {'case': False, 'res': 'error: route with same path already exists'}
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
                return {'case': False, 'res': 'error: route with same path already exists'}
            self.routing_config["routes"][route_obj['path']] = route_obj 
            self.routing_config["baseRoutes"][route_obj['path']] = {} 
        
        return {'case': True, 'res': { 'config': self.routing_config, 'helper_data' : self.routing_helper_data}}
    
    def add_child_route(self, child_object):
        if route := self.routing_config['routes'].get(child_object['fullParentPath']):
            fullParentPath = child_object.pop('fullParentPath', None)
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
                return {'case': False, 'res': 'error: route with same path already exists'}
            
            child_routes = self.routing_config['routes'][fullParentPath].get('childRoutes')
            if child_routes is None:
                child_routes = {}
                self.routing_config['routes'][fullParentPath]['childRoutes'] = child_routes
            child_routes[full_child_path] = {}
            
            self.routing_config['routes'][full_child_path] = child_object
            
            return {'case': True, 'res' : { 'config': self.routing_config, 'helper_data' : self.routing_helper_data}}
        return {'case' : False, 'res' : 'No matching parent route was present'}
    
    def edit_child_route(self, child_object):
        if child_object.get("prevPath"):
            child_object['path'] = child_object['path'] if child_object['path'][0]=='/' else '/'+child_object['path']
            child_object['path'] = child_object['path'][:-1] if child_object['path'][-1]=='/' else child_object['path']
            if childs_initial_parent_path := self.routing_config['routes'][child_object.get('fullParentPath')].get('initialParentPath'):
                child_object['initialParentPath'] = childs_initial_parent_path
            else:
                child_object['initialParentPath'] = child_object.get('fullParentPath')
            
            if child_object.get('newFullParentPath') == 'none':
                if self.routing_config['routes'].get(child_object['path']):
                    return {'case': False, 'res': 'error: route with same path already exists'}
                
                self.routing_config['baseRoutes'][child_object['path']] = {}
                prev_parent_obj = self.routing_config['routes'][child_object['fullParentPath']]
                del prev_parent_obj['childRoutes'][child_object['fullPath']]
                del child_object['parentPath']
                child_object.pop('initialParentPath', None)
                
                self.handle_route_path_change_in_child_for_child(
                    child_object,
                    child_object['fullPath'],
                    child_object['path']
                )
                
                self.set_parent_initial_parent(child_object, child_object['path'])
                child_object.pop('newFullParentPath', None)
                    
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
                    child_object.pop('newFullParentPath', None)
                    return {'case': False, 'res': 'error: route with same path already exists'}
                self.handle_route_path_change_in_child_for_child(
                    child_object,
                    child_object['fullPath'],
                    new_full_path
                )
                
                self.set_parent_initial_parent(child_object, child_object['initialParentPath'])
                child_object.pop('newFullParentPath', None)
                
            elif child_object['path'] != child_object['prevPath']:
                new_full_child_path = child_object['fullParentPath'] + child_object['path']
                old_full_child_path = child_object['fullParentPath'] + child_object['prevPath']
                if self.routing_config['routes'].get(new_full_child_path):
                    return {'case': False, 'res': 'error: route with same path already exists'}
        
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
            child_object.pop('prevPath', None)
            child_object.pop('fullPath', None)
            child_object.pop('fullParentPath', None)
            child_object.pop('newFullParentPath', None)
            return {'case': True, 'res' : { 'config': self.routing_config, 'helper_data' : self.routing_helper_data}}
                
        else:
            return {'case' : False, 'res' : 'Invalid data sent'}
    
    def delete_route(self, route):
        if route.get('path') == '/':
            return {'case' : False, 'res' : "root path can't be deleted"}
        if route.get('parentPath'):
            return self.delete_child_route(route)
        else:
            return self.delete_base_route(route)
    
    def delete_base_route(self, route):
        if route['fullPath'] in self.routing_config['baseRoutes'].keys() and self.routing_config['routes'][route['fullPath']]:
            self.delete_all_child(route['fullPath'])
            del self.routing_config['baseRoutes'][route['fullPath']]
        return {'case': True, 'res' : { 'config': self.routing_config, 'helper_data' : self.routing_helper_data}}
    
    def delete_child_route(self, route):
        full_parent_path = self.replace_last_instance(route['fullPath'], route['path'], '')
        del self.routing_config['routes'][full_parent_path]['childRoutes'][route['fullPath']]
        self.delete_all_child(route['fullPath'])
        return {'case': True, 'res' : { 'config': self.routing_config, 'helper_data' : self.routing_helper_data}}
    
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
        if os.path.exists(f"{self.app_config['APP_CONFIG_PATH']}/yaml/sample_swagger.yml"):
            with open(f"{self.app_config['APP_CONFIG_PATH']}/yaml/sample_swagger.yml") as file:
                service_config = yaml.full_load(file)
        else:
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
        StyleHandler.generate_styles_code(self.app_config, self.directory_management_config)
