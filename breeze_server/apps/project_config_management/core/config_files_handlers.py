from apps.common.constants.consts import CONFIG_PATH,CLIENT_API
import json, os
from apps.common.constants.consts import CONFIG_FILES_PATH, JSX_DIRECTORY_CONFIG, TSX_DIRECTORY_CONFIG
from apps.common.utils.file_helpers.json_handler import read_json_file, write_json_file
from apps.common.utils.file_helpers.dir_handler import  create_dir_if_not_exists
from apps.common.utils.file_helpers.config_handler import write_config_file
from apps.common.constants.enums.ResourceCategory import ResourceCategory
from apps.common.utils.uuid_as_key import generate_uuid_as_key 
from apps.common.utils.tree_management import replace_node

def add_dirs_configs(data):
    if data["name"] == "":
        raise ValueError("Name must be specified")
    app_config_dir = f"{CONFIG_PATH}/{data['name']}"
    app_config_path = f"{app_config_dir}/{CONFIG_FILES_PATH['APP_CONFIG']}"
    
    # Create Dir if not exists for config folder
    create_dir_if_not_exists(app_config_dir)
    
    # for storing intermediate service config
    create_dir_if_not_exists(
        f"{app_config_dir}/{CLIENT_API}"
    )
    
    # for storing schemas retrieved form swagger file
    create_dir_if_not_exists(f"{app_config_dir}/swagger_schema")
    create_dir_if_not_exists(data["path"])

    app_current_config = data
    app_current_config['components_src_dir'] = 'src'
    app_current_config["dependencies"] = {
        "react-router-dom": "*",
        "bootstrap": "^5.3.2",
        "react-bootstrap": "*"
    }
    

    # TODO: write all configuration part ASA other dependent module gets ready

    # creating app_basic_config, component_config & routing config
    
    write_json_file(f"{app_config_path}.json", app_current_config)
    
    create_resource_directory(data['name'], ResourceCategory.COMPONENTS)
    app_current_config = write_basic_main_comp_config(app_current_config)
    write_routing_config(app_current_config)
    write_swagger_schema_config(app_config_dir)

    # entries in directory management
    create_directory_management_file(app_current_config)
    update_directory_management_file(app_current_config)
    return app_current_config

def write_basic_main_comp_config(app_config):
    _id = generate_uuid_as_key()
    name = app_config['defaultComponent']
    main_comp_config = {
        app_config['defaultComponent'] : {
            "name": name,
            "id": _id,
            "file_id":_id,
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

    app_config_path = f"{app_config_dir}/{CONFIG_FILES_PATH['APP_CONFIG']}"
    app_config['default_comp_id'] = _id
    del app_config['defaultComponent']
    write_json_file(f"{app_config_path}.json", app_config)
    write_config_file( f"{app_config['name']}", ResourceCategory.COMPONENTS.value, f"{_id}", main_comp_config)
    
    entry_in_config_index(app_config['name'], ResourceCategory.COMPONENTS, _id, name)
    return app_config
    

def write_routing_config(app_config):
    app_config_dir = f"{CONFIG_PATH}/{app_config['name']}"
    default_path_id = generate_uuid_as_key()
    basic_routing_config = {
        default_path_id : {
            "id": default_path_id,
            "path": "/",
            "componentId": f"{app_config['default_comp_id']}",
            "parentId": None
        }
    }
    write_json_file(f"{app_config_dir}/{CONFIG_FILES_PATH['ROUTING_CONFIG']}.json", basic_routing_config)

def write_swagger_schema_config(app_config_dir):
    write_json_file(f"{app_config_dir}/{CLIENT_API}/swagger_metadata.json", {
        "custom" : {
            "title" : "Custom",
            "auth_apis" : {}
        }
    })

def create_directory_management_file(app_config):
    template_path = ""
    template_content = ""
    if app_config.get('languages') =="typescript":
        template_path=TSX_DIRECTORY_CONFIG
    else:
        template_path= JSX_DIRECTORY_CONFIG
    
    if not os.path.exists(template_path):
        raise FileNotFoundError(f"Template file {template_path} does not exist")

    with open(template_path, 'r') as template_file:
        template_content = json.load(template_file)
        
    app_config_dir = f"{CONFIG_PATH}/{app_config['name']}"
    
    directory_management_path =  f"{app_config_dir}/{CONFIG_FILES_PATH['DIRECTORY_MANAGEMENT']}.json"
    with open(directory_management_path, 'w') as dir_mgmt_file:
        json.dump(template_content, dir_mgmt_file, indent=4)
    
def update_directory_management_file(app_config):
    app_config_dir = f"{CONFIG_PATH}/{app_config['name']}"
    directory_management_path =  f"{app_config_dir}/{CONFIG_FILES_PATH['DIRECTORY_MANAGEMENT']}"
    
    directory_management_config = read_json_file(directory_management_path)
    comp_index_file = read_json_file(f"{app_config_dir}/{ResourceCategory.COMPONENTS.value}/index")
    default_comp_name = comp_index_file[app_config['default_comp_id']] + (".tsx" if app_config.get("language") == "typescript" else ".jsx")
    main_comp_id = app_config['default_comp_id']
    template_content = replace_node("DEFAULT_COMP",main_comp_id,directory_management_config)
    
    template_content[main_comp_id]["name"] = default_comp_name
    
    write_json_file(f"{directory_management_path}.json", template_content)
    
# expecting enum object and project name i.e. is currently an ID itself
def create_resource_directory(project_id, resource_category):
    app_config_dir = f"{CONFIG_PATH}/{project_id}"
    create_dir_if_not_exists(f"{app_config_dir}/{resource_category.value}")
    write_json_file(f"{app_config_dir}/{resource_category.value}/index.json", {})
    create_dir_if_not_exists(f"{app_config_dir}/{resource_category.value}/versions")
    
def entry_in_config_index(project_id, resource_category, key, value):
    app_config_dir = f"{CONFIG_PATH}/{project_id}"
    index_file = read_json_file(f"{app_config_dir}/{resource_category.value}/index")
    index_file[key] = value
    write_json_file(f"{app_config_dir}/{resource_category.value}/index.json", index_file)