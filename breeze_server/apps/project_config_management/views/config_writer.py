import json
from django.views.decorators.csrf import csrf_exempt

from apps.common.constants.consts import CONFIG_FILES_PATH, CONFIG_PATH
from apps.common.utils.file_helpers.dir_handler import create_parent_dir_if_not_exists
from apps.common.utils.file_helpers.json_handler import read_json_file, write_json_file
from apps.code_generator.core.generate_project import generate_project
from ..core.config_files_handlers import write_basic_config_files, write_basic_main_comp_config, create_directory_management_file, update_directory_management_file


def create_or_update_app_config(data):
    if data["name"] == "":
        raise ValueError("Name must be specified")
    app_config_dir = f"{CONFIG_PATH}/{data['name']}"

    # Create Dir if not exists for config folder
    create_parent_dir_if_not_exists(app_config_dir)
    # for storing intermediate service config
    create_parent_dir_if_not_exists(
        f"{app_config_dir}/api_client_intermediate_json")
    # for storing schemas retrieved form swagger file
    create_parent_dir_if_not_exists(f"{app_config_dir}/swagger_schema")
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

    # TODO: write all configuration part ASA other dependent module gets ready

    write_json_file(f"{app_config_path}.json", json.dumps(app_current_config))

    create_directory_management_file(app_current_config)
    update_directory_management_file(app_current_config)
    write_basic_main_comp_config(app_current_config)

    write_basic_config_files(app_current_config)

    generate_project(app_current_config, app_current_config.get("logo"))

@csrf_exempt 
def manage_configs(request):
    return ""