import uuid
from common.utils.config_reader import read_config_file, read_file_json, write_file
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
from .app_editor import AppEditor
from .helpers.html_config_generator import HtmlConfigGenerator
import re
class ComponentConfigService:
    def __init__(self,projectId):
        self.projectId = projectId
        self.app_config_dir = f"{CONFIG_PATH}/{projectId}"
        self.app_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        self.comp_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['COMPONENT_CONFIG'])
        self.css_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['CSS_CONFIG'])
        
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

        handler = switch.get(config_type)

        if not handler:
            raise ValueError("Invalid resource type.")

        handler()

        self.comp_config[comp_name] = config

        appEditor = AppEditor(self.projectId)
        appEditor.write_component(config)

        return config
    
    # def edit_component_name(self, component_id, new_name):
    #     component = next((comp for comp in self.comp_config.values() if comp.get('file_id') == component_id), None)
    #     print(component,"component")
        
    #     if not component:
    #         raise ValueError("Component not found.")
        
    #     old_name = component.get('name')
    #     print(old_name,"old name")
    #     if old_name:
    #         component['name'] = new_name
    #         print(component['name'],"changed name")
    #     else:
    #         raise ValueError("Component name not found.")
        
    #     print(self.comp_config,"see the name")
    #     appEditor = AppEditor(self.projectId)
    #     appEditor.write_component(self.comp_config)
        
    #     write_file(self.app_config_dir, CONFIG_FILES_PATH['COMPONENT_CONFIG'], self.comp_config)
    #     return self.comp_config
        
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

    def get_resource(self , comp_name, resource_id):
        print("get_resource")
        if resource_id:
            for resource in self.comp_config[comp_name].get("resources"):
                if resource.get("id") == resource_id:
                    return resource
            else:
                raise IndexError("Resource %s not found" % resource_id)
        else:
            return {"resoureces":self.comp_config[comp_name].get("resources")}

    # def add_lifecycle(self, lifecycle_data):
    #     hooks = self.comp_config.get(lifecycle_data["comp_name"], {}).setdefault(
    #         "hooks", []
    #     )
    #     if any(hook["name"] == lifecycle_data["hook_name"] for hook in hooks):
    #         raise ValueError("Hook name already exists.")

    #     new_hook = {
    #         "name": lifecycle_data["hook_name"],
    #         "type": lifecycle_data["type"],
    #         "lifecycleType": lifecycle_data["lifecycleType"],
    #         "dependentVars": lifecycle_data["dependentVars"],
    #         "implementation": {
    #             "body": lifecycle_data["body"],
    #             "returnBody": lifecycle_data.get("return_body", ""),
    #         },
    #     }
    #     hooks.append(new_hook)
    #     appEditor = AppEditor(self.projectId)
    #     appEditor.write_component(self.comp_config.get(lifecycle_data["comp_name"]))
    #     return new_hook

    # def update_lifecycle(self, updates):
    #     hooks = self.comp_config.get(updates["comp_name"], {}).get("hooks", [])
    #     for hook in hooks:
    #         if hook["name"] == updates["hook_name"]:
    #             hook.update(
    #                 {
    #                     "type": updates["type"],
    #                     "lifecycleType": updates["lifecycleType"],
    #                     "dependentVars": updates["dependentVars"],
    #                     "implementation": {
    #                         "body": updates["body"],
    #                         "returnBody": updates.get("return_body", ""),
    #                     },
    #                 }
    #             )
    #             appEditor = AppEditor(self.projectId)
    #             appEditor.write_component(self.comp_config.get(updates["comp_name"]))
    #             return hook
    #     raise LookupError("Hook not found")

    # def get_lifecycle(self, comp_name=None, hook_name=None):
    #     hooks = self.comp_config.get(comp_name, {}).get("hooks", [])
    #     if hook_name is not None:
    #         for hook in hooks:
    #             if hook["name"] == hook_name:
    #                 return hook
    #         return None
    #     return hooks

    # def delete_lifecycle(self, comp_name, hook_name):
    #     hooks = self.comp_config.get(comp_name, {}).get("hooks", [])

    #     new_hooks = [hook for hook in hooks if hook["name"] != hook_name]

    #     if len(hooks) != len(new_hooks):
    #         self.comp_config[comp_name]["hooks"] = new_hooks

    #         appEditor = AppEditor(self.projectId)
    #         appEditor.write_component(self.comp_config.get(comp_name))
    #         return True 
    #     else: 
    #        return False 
    
    # def get_variables(self, comp_name=None, variable_id=None):
    #     state_variables = self.comp_config.get(comp_name, {}).get("stateVars", [])
    #     prop_variables = self.comp_config.get(comp_name, {}).get("propsVars", [])
    #     other_variables = self.comp_config.get(comp_name, {}).get("otherVars", [])
    #     ref_variables = self.comp_config.get(comp_name, {}).get("refVars", [])

    #     variables = state_variables + prop_variables + other_variables + ref_variables

    #     if variable_id is not None:
    #         for var in variables:
    #             if var["$id"] == variable_id:
    #                 return var
    #         return None
    #     return variables
    
    # def add_variable(self, comp_name, variable_config):
    #     component = self.comp_config.get(comp_name)
    #     state_variables = component["stateVars"]
    #     prop_variables = component["propsVars"]
    #     # other_variables = component["otherVars"]
    #     # ref_variables = component["refVars"]

    #     variables = state_variables + prop_variables + other_variables + ref_variables

    #     for var in variables:
    #         if var["name"] == variable_config["name"]:
    #             raise IndexError("Variable has already been declared")

    #     def generate_unique_id(variable_list, prefix):
    #         max_id = 0
    #         pattern = r'\d+$'
    #         for var in variable_list:
    #             match = re.search(pattern, var["$id"])
    #             if match:
    #                 max_id = max(max_id, int(match.group()))
    #         return f"{prefix}/UUID{max_id + 1}"

    #     new_variable = {
    #         'name': variable_config["name"],
    #         'type': variable_config["type"],
    #         'datatype': variable_config["datatype"],
    #         'defaultValue': variable_config.get("defaultValue", None),
    #         'description': variable_config.get("description", "")
    #     }

    #     if variable_config["type"] == "stateVars":
    #         new_id = generate_unique_id(state_variables, "STATE_VARS")
    #         new_variable["$id"] = new_id
    #         state_variables.append(new_variable)

    #     elif variable_config["type"] == "propsVars":
    #         new_id = generate_unique_id(prop_variables, "PROPS_VARS")
    #         new_variable["$id"] = new_id
    #         prop_variables.append(new_variable)

    #     elif variable_config["type"] == "otherVars":
    #         new_id = generate_unique_id(other_variables, "OTHER_VARS")
    #         new_variable["$id"] = new_id
    #         other_variables.append(new_variable)
            
    #     elif variable_config["type"] == "refVars":
    #         new_id = generate_unique_id(ref_variables, "REF_VARS")
    #         new_variable["$id"] = new_id
    #         ref_variables.append(new_variable)

    #     else:
    #         raise ValueError("Invalid variable type specified")

    #     app_editor = AppEditor(self.projectId)
    #     app_editor.write_component(self.comp_config.get(comp_name))

    #     return new_variable
    
    # def update_variable(self, comp_name, new_variable_config):
    #     component = self.comp_config.get(comp_name)
    #     state_variables = component["stateVars"]
    #     prop_variables = component["propsVars"]
    #     other_variables = component["otherVars"]
    #     ref_variables = component["refVars"]

    #     variables = state_variables + prop_variables + other_variables + ref_variables

    #     variable_found = False
    #     for var in variables:
    #         if var["$id"] == new_variable_config["$id"]:
    #             var.update(new_variable_config)
    #             variable_found = True
    #             break
            
    #     if not variable_found:
    #         raise IndexError("Variable not found")
        
    #     app_editor = AppEditor(self.projectId)
    #     app_editor.write_component(component)

    #     return new_variable_config
    
    # def delete_variable(self, comp_name, variable_id):
    #     component = self.comp_config.get(comp_name)
    #     state_variables = component["stateVars"]
    #     prop_variables = component["propsVars"]
    #     other_variables = component["otherVars"]
    #     ref_variables = component["refVars"]
        

    #     def delete_from_list(variable_list, variable_id):
    #         for var in variable_list:
    #             if var["$id"] == variable_id:
    #                 variable_list.remove(var)
    #                 return True
    #         return False

    #     if delete_from_list(state_variables, variable_id) or \
    #        delete_from_list(prop_variables, variable_id) or \
    #        delete_from_list(other_variables, variable_id) or \
    #        delete_from_list(ref_variables, variable_id):
    #         app_editor = AppEditor(self.projectId)
    #         app_editor.write_component(component)
    #         return True
    #     else:
    #         raise IndexError("Variable not found")
    

    # def add_function(self,comp_name,function_config):
    #     functions =  self.comp_config.get(comp_name)["functions"]
        
    #     id=0
    #     for func in functions:
    #         if func["name"] == function_config["name"]:
    #             raise IndexError("Duplicate function name")
    #         else:
    #             pattern = r'\d+$'
    #             match = re.search(pattern, func["$id"])
    #             if match :
    #                 id = max(id, int(match.group()))
    #     id = "FUNCTION/UUID"+str(id+1)
        
    #     new_func_config ={
    #         "name": function_config["name"],
    #         "$id": id,
    #         "parameters": function_config.get("parameters",{"list":[]}),
    #         "isAnonymous":  function_config.get("isAnonymous",False),
    #         "isAsync": function_config.get("isAsync",False),
    #         "body": function_config["body"],
    #         "description":  function_config.get("description",False),
    #     }
    #     functions.append(new_func_config)
    #     appEditor=AppEditor(self.projectId)
    #     appEditor.write_component(self.comp_config.get(comp_name))
    #     return new_func_config
                
    # def update_function(self,comp_name,function_config):
    #     functions =  self.comp_config.get(comp_name)["functions"]
    #     function_to_update = None
    #     for func in functions:
    #         if func["name"] == function_config["name"]:
    #             function_to_update=func
    #             break
    #     else:
    #         raise IndexError("Could not find function")
        
    #     function_to_update["body"] = function_config.get("body",function_to_update["body"] )
    #     function_to_update["parameters"] = function_config.get("parameters",function_to_update["parameters"])
    #     function_to_update["isAnonymous"] = function_config.get("isAnonymous",function_to_update["isAnonymous"])
    #     function_to_update["isAsync"] = function_config.get("isAsync",function_to_update["isAsync"] )
    #     function_to_update["description"] = function_config.get("description","" )
    #     appEditor=AppEditor(self.projectId)
    #     appEditor.write_component(self.comp_config.get(comp_name))
    #     return function_to_update
            