import uuid
from common.utils.config_reader import read_config_file, read_file_json, write_file
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
from .app_editor import AppEditor
from .helpers.html_config_generator import HtmlConfigGenerator
import json
class ComponentConfigService:
    def __init__(self,projectId):
        self.projectId = projectId
        self.app_config_dir = f"{CONFIG_PATH}/{projectId}"
        self.app_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        self.comp_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['COMPONENT_CONFIG'])
        self.css_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['CSS_CONFIG'])
        self.usage_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['USAGE_CONFIG'])
        
    def get_html_by_id(self,component,id):
        html= self.comp_config.get(component).get("html_elements").get(id)
        # self.map_children(component,html)
        return html
    
    
    def update_html_config(self,component,id,html):
        self.comp_config.get(component).get("html_elements")[id] = html
        print("Updated html")
        appEditor=AppEditor(self.projectId)
        appEditor.write_component(self.comp_config.get(component))
        return self.comp_config
    
    def delete_html_config(self,component,id):
        ids = id.split("-")
        if len(ids)<2:
            raise IndexError("Invalid Id")
        parent_id = ("-").join(ids[:-1])
        self.delete_html_recursive(component,id)
        parent_html= self.comp_config.get(component).get("html_elements").get(parent_id)
        for x in parent_html.get("children",[]):
            if x["_id"]==id:
                parent_html["children"].remove(x)
        print(self.comp_config.get(component).get("html_elements"))
        return self.update_html_config(component,parent_id,parent_html)[component]
        
    def delete_html_recursive(self,component,id):
        html= self.comp_config.get(component).get("html_elements").get(id)
        self.comp_config.get(component).get("html_elements").pop(id)
        if html["type"]=="Element":
            for x in html["children"]:
                self.delete_html_recursive(component,x["_id"])
    
    def map_children(self,component,html):
        if html.get("children"):
            for i,x in enumerate(html["children"]):
                elemType= self.comp_config[component]["html_elements"][x["_id"]]["type"]
                html["children"][i]["type"]=elemType
                if elemType=="Element":
                    html["children"][i]["tagName"]=self.comp_config[component]["html_elements"][x["_id"]]["tagName"]
    
    def add_child_html(self,component,parent_html_id,child):
        parent_html= self.comp_config.get(component).get("html_elements").get(parent_html_id)
        if parent_html["elementType"] =="HTML" or parent_html["elementType"] =="THIRD_PARTY" or parent_html["element"]=="CUSTOM":
            print(parent_html)
            children = parent_html["children"]
            new_elem_id = parent_html_id+"-"+ str(max([int(child["_id"].split("-")[-1]) for child in children],default=0)+1)
            
            child_config = HtmlConfigGenerator.generate_config(child,new_elem_id)
            children.append({"_id":new_elem_id})
            self.comp_config[component]["html_elements"][new_elem_id] = child_config
                
            appEditor=AppEditor(self.projectId)
            appEditor.write_component(self.comp_config.get(component))
            return new_elem_id,child_config,parent_html
        else:
            raise NotImplementedError()

    def generate_id(self, resource_type):
        type_map = {
            "propsVars": "PROP_VARS",
            "stateVars": "STATE_VARS",
            "refVars": "REF_VARS",
            "otherVars": "OTHER_VARS",
            "function": "FUNCTION",
            "lifecycle": "LIFECYCLE",
            "hook": "HOOK",
        }
        type_prefix = type_map.get(resource_type, "UNKNOWN")
        return f"{type_prefix}/{uuid.uuid4()}"

    def check_usage(self, comp_name, config_data):
        if config_data['type'] == "propsVars":
            if config_data['id'] in self.usage_config['components'][comp_name]['props'].keys():
                dependent_comps = self.usage_config['components'][comp_name]['props'][config_data['id']].get('usageInOtherComponents', [])
                print("dependent_comps")
                print(dependent_comps)
                if len(dependent_comps) > 0:
                    return {'res':dependent_comps, 'status':222}
        return None
    
    def update_component(self, comp_name, config_data):        
        config = self.comp_config.get(comp_name)
        config_type = config_data["type"]
        
        def handle_props_vars():
            props_vars = config["propsVars"]

            if "id" in config_data:
                for prop in props_vars:
                    if prop.get("id") == config_data["id"]:
                        prop.update(config_data)
                        break
                else:
                    raise ValueError("Prop with the specified ID not found.")
            else:
                existing_names = [prop["name"] for prop in props_vars]
                if config_data["name"] in existing_names:
                    raise ValueError("Resource name already exists for propsVars.")

                if "id" not in config_data:
                    config_data["id"] = self.generate_id(config_data["type"])
                self.usage_config['components'][comp_name]['props'][config_data['id']] = {}
                self.usage_config['components'][comp_name]['props'][config_data['id']]['usageInOtherComponents'] = []                
                usage_config_path = f"{self.app_config_dir}/{CONFIG_FILES_PATH['USAGE_CONFIG']}"
                write_file(f"{usage_config_path}.json", json.dumps(self.usage_config))
                props_vars.append(config_data)

            config["propsVars"] = props_vars

        def handle_resources():
            # Array containing all variables, functions, life-cycles and hooks
            resources = config["resources"]

            if "id" in config_data:
                for resource in resources:
                    if resource["id"] == config_data["id"]:
                        resource.update(config_data)
                        break
                else:
                    raise ValueError("Resource with the specified ID not found.")
            else:
                existing_names = {resource["name"] for resource in resources}
                if config_data["name"] in existing_names:
                    raise ValueError("Resource name already exists.")

                if "id" not in config_data:
                    config_data["id"] = self.generate_id(config_data["type"])
                resources.append(config_data)

            config["resources"] = resources

        def handle_imports():
            new_import = config_data["body"]
            new_import_entity = new_import["import_entity"]
            new_import_from = new_import["from"]

            other_imports = config["imports"].get("other", [])
            
            for imp in other_imports:
                if imp["import_entity"] == new_import_entity and imp["from"] == new_import_from:
                    raise ValueError(f"Import {new_import_entity} from {new_import_from} is already imported.")
            
            other_imports.append(new_import)
            config["imports"]["other"] = other_imports

        def handle_wrappers():
            wrappers = config["wrapper_store"]
            # Add/update the wrapper logic here

        switch = {
            "propsVars": handle_props_vars,
            "stateVars": handle_resources,
            "otherVars": handle_resources,
            "refVars": handle_resources,
            "function": handle_resources,
            "lifecycle": handle_resources,
            "hook": handle_resources,
            "imports": handle_imports,
            "wrappers": handle_wrappers,
        }

        if config_data.get('checkUsage'):
            del config_data['checkUsage']
            response = self.check_usage(comp_name, config_data)
            if response != None:
                print('response')
                
                return response
           
        handler = switch.get(config_type)
        if not handler:
            raise ValueError("Invalid resource type.")
        handler()
        self.comp_config[comp_name] = config
        appEditor = AppEditor(self.projectId)
        appEditor.write_component(config)

        return {'res':config, 'status':200}
    
    def reorder_component_actions(self, comp_name, config_data):
        if "type" not in config_data or "data" not in config_data:
            raise ValueError("Invalid config_data: 'type' and 'data' keys are required.")

        config = self.comp_config.get(comp_name)
        action_type = config_data["type"]
        data = config_data["data"]

        if action_type == 'propsVars':
            config["propsVars"] = data
        elif action_type == 'resources':
            config["resources"] = data
        else:
            raise ValueError(f"Invalid action type '{action_type}'. Must be 'propsVars' or 'resources'.")
        
        self.comp_config[comp_name] = config

        appEditor = AppEditor(self.projectId)
        appEditor.write_component(config)
        return True

    def get_resource(self, comp_name, resource_id=None):  
        resources = []
        resources.extend(self.comp_config[comp_name].get("resources"))
        resources.extend(self.comp_config[comp_name].get("propsVars", []))
        
        if resource_id:
            for resource in self.comp_config[comp_name].get("resources", []):
                if resource.get("id") == resource_id:
                    return resource
            else:
                raise IndexError("Resource %s not found" % resource_id)
        else:
            return {
                "resources": resources
            }
