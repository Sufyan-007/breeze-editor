from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
from common.utils.file_helper import read_json_file, write_file, create_parent_dir_if_not_exists
import json,os
from common.utils.request_code import REQUEST
from .generate_project import GenerateProject
from apps.api_client_generator.utils.uuid_as_key import generate_uuid_as_key
class AppConfigWriter:
    def __init__(self):
        pass
    
    def write_basic_config_files(self, app_config):
        app_config_dir = f"{CONFIG_PATH}/{app_config['name']}"
        basic_routing_config = {
            "routes":
                {
                    "/" : {
                        "path": "/",
                        "component": f"{app_config['defaultComponent']}"
                    }
                },
            "baseRoutes": {
                "/": {},
            }
        }
        write_file(f"{app_config_dir}/{CONFIG_FILES_PATH['CONTEXT_COMPONENT_CONFIG']}.json", json.dumps({}))
        write_file(f"{app_config_dir}/{CONFIG_FILES_PATH['ROUTING_CONFIG']}.json", json.dumps(basic_routing_config))
        write_file(f"{app_config_dir}/{CONFIG_FILES_PATH['REDUCER_CONFIG']}.json", json.dumps({}))
        write_file(f"{app_config_dir}/{CONFIG_FILES_PATH['REDUX_STORE_CONFIG']}.json", json.dumps({}))
        write_file(f"{app_config_dir}/{CONFIG_FILES_PATH['CSS_CONFIG']}.json", json.dumps({}))
        write_file(f"{app_config_dir}/react_request_code.py", REQUEST)

    def write_basic_main_comp_config(self, app_config, file_id):
        main_comp_config = {
            app_config['defaultComponent'] : {
                "name": app_config['defaultComponent'],
                "id":app_config['defaultComponent'].upper(),
                "file_id":file_id,
                "imports": {
                    "components": [
                    ],
                    "other": [
                    ]
                },
                "propsVars": [],
                "resources": [],
                "html": { "_id": "Main" },
                "wrapper_store": None,
                "html_elements": {
                    "Main": {
                        "type": "Element",
                        "elementType": "HTML",
                        "typeId": "DIV",
                        "tagName": "div",
                        "attributes": {
                        "className": { "type": "LITERAL", "value": "" }
                        },
                        "children": [{ "_id": "Main-0" }]
                    },
                    "Main-0": { "type": "text", "text": "Hello world" }
                }
            }
        }

        app_config_dir = f"{CONFIG_PATH}/{app_config['name']}"

        comp_config = f"{app_config_dir}/{CONFIG_FILES_PATH['COMPONENT_CONFIG']}"

        write_file(f"{comp_config}.json", json.dumps(main_comp_config))

    def create_directory_management_file(self,app_config):
        selected_template = "temp2.json"
        templates_path = f"breeze/apps/directory_management/const/{selected_template}"

        if not os.path.exists(templates_path):
            raise FileNotFoundError(f"Template file {templates_path} does not exist")

        with open(templates_path, 'r') as template_file:
            template_content = json.load(template_file)
            
        app_config_dir = f"{CONFIG_PATH}/{app_config['name']}"
        
        directory_management_path =  f"{app_config_dir}/{CONFIG_FILES_PATH['DIRECTORY_MANAGEMENT']}.json"
        print(directory_management_path,"directory management file path")
        with open(directory_management_path, 'w') as dir_mgmt_file:
            json.dump(template_content, dir_mgmt_file, indent=4)
        
        # Call the function to update component_config.json
        # self.update_component_config(selected_template, template_content)
        # return template_content
    
    # def update_component_config(self,selected_template, template_content):
    #     components_config_path = os.path.join(self.app_config['APP_CONFIG_PATH'],"component_config.json")
        
    #     component_configs = []
        
    #     # Iterate over the template_content dictionary to find files tagged as COMPONENTS
    #     for file_id, file_info in template_content.items():
    #         new_id = generate_uuid_as_key();
    #         if file_info['type'] == 'FILE' and file_info['tag'] == 'COMPONENTS':
    #             # Extract the component name from the file name (without the .js extension)
    #             component_name = os.path.splitext(file_info['name'])[0]
              
    #             component_config = {
    #                 component_name: {
    #                     "name": component_name,
    #                     "file_id": new_id,
    #                     "propsVars": [],
    #                     "resources": [],
    #                     "componentType":"CUSTOM",
    #                     "id": component_name,
    #                     "html": {"_id": component_name},
    #                     "wrapper_store": None,
    #                     "imports": {
    #                         "components": [], 
    #                         "other": [
    #                             {
    #                                 "TYPE": "THIRD_PARTY",
    #                                 "from": "react-bootstrap",
    #                                 "import_entity": "Container",
    #                                 "import_type": "SINGLE"
    #                             },
    #                             {
    #                                 "TYPE": "THIRD_PARTY",
    #                                 "from": "react",
    #                                 "import_entity": "useEffect",
    #                                 "import_type": "SINGLE"
    #                             }
    #                         ]
    #                     },
    #                     "html_elements": {
    #                         component_name: {
    #                             "type": "Element",
    #                             "elementType": "HTML",
    #                             "typeId": "DIV",
    #                             "tagName": "div",
    #                             "attributes": {
    #                                 "className": {"type": "LITERAL", "value": ""},
    #                             },
    #                             "children": [
    #                                 {"_id": f"{component_name}-0"},
    #                                 {"_id": f"{component_name}-1"}
    #                             ]
    #                         },
    #                         f"{new_id}-0": {"type": "text", "text": "Hello world"},
    #                         f"{component_name}-1": {
    #                             "type": "Element",
    #                             "elementType": "HTML",
    #                             "typeId": "DIV",
    #                             "tagName": "div",
    #                             "attributes": {
    #                                 "className": {"type": "LITERAL", "value": ""}
    #                             },
    #                             "children": [
    #                                 {"_id": f"{component_name}-1-0"}
    #                             ]
    #                         },
    #                         f"{component_name}-1-0": {
    #                             "type": "text",
    #                             "text": "BYe"
    #                         }
    #                     },
    #                     "type": "CUSTOM"
    #                     },
    #                 }
                
    #             component_configs.append(component_config)
        
    #     # Load existing component_config.json if it exists
    #     existing_config = {}
    #     if os.path.exists(components_config_path):
    #         with open(components_config_path, 'r') as comp_config_file:
    #             existing_config = json.load(comp_config_file)

    #     # Update existing_config with new component_configs
    #     for config in component_configs:
    #         existing_config.update(config)

    #     # Write updated component_config.json
    #     with open(components_config_path, 'w') as comp_config_file:
    #         json.dump(existing_config, comp_config_file, indent=4)
    
    def update_directory_management_file(self,app_config):
        app_config_dir = f"{CONFIG_PATH}/{app_config['name']}"
        directory_management_path =  f"{app_config_dir}/{CONFIG_FILES_PATH['DIRECTORY_MANAGEMENT']}.json"
        
        with open(directory_management_path, "r") as dir_mgmt_file:
            content= json.load(dir_mgmt_file)
        
        file_id_temp = None
        #replace 'main.js' with default_component in the content
        for file_id,file_info in content.items():
           if file_info.get('name') == 'Main.js':
             file_info['name'] = f"{app_config['defaultComponent']}.js"
             file_id_temp= file_id
        #write the updated content back to the file 
        with open(directory_management_path,'w') as dir_mgmt_file:
            json.dump(content, dir_mgmt_file, indent=4)
        
        return file_id_temp
    
    def create_or_update_app_config(self, data):
        if data["name"]=="":
            raise ValueError("Name must be specified")
        app_config_dir = f"{CONFIG_PATH}/{data['name']}"

        # Create Dir if not exists for config folder
        create_parent_dir_if_not_exists(app_config_dir)
        create_parent_dir_if_not_exists(f"{app_config_dir}/generated_intermediate_json")
        create_parent_dir_if_not_exists(data["path"])

        app_config_path = f"{app_config_dir}/{CONFIG_FILES_PATH['APP_CONFIG']}"

        # Read old config
        try:
            app_current_config = read_json_file(app_config_path)
        except FileNotFoundError as e:
            print(e)
            app_current_config = {}


        app_current_config = data

        app_current_config['components_src_dir'] = 'src'

        print(app_current_config)
        app_current_config["dependencies"] = {
            "react-router-dom": "*",
            "bootstrap": "^5.3.2",
            "react-bootstrap": "*"

        }
        
        # write configuration
        # first check for an existing auth.json file
        auth_json_path = f"{app_config_dir}/generated_intermediate_json/auth.json"
        if not os.path.exists(auth_json_path):
            write_file(auth_json_path, json.dumps({}))
            
        write_file(f"{app_config_path}.json", json.dumps(app_current_config))
        
        self.create_directory_management_file(app_current_config)
        
        main_comp_file_id = self.update_directory_management_file(app_current_config)
        print(main_comp_file_id,"file id of main_comp ")
        self.write_basic_main_comp_config(app_current_config,main_comp_file_id )
        
        self.write_basic_config_files(app_current_config)
        
        GenerateProject.generate_project(app_current_config)
    
