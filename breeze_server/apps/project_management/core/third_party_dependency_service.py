from apps.common.utils.file_helpers.config_handler import get_breeze_config_file, write_json_file
from apps.code_generator.core.generate_project import install_dependencies
from apps.common.constants.consts import CONFIG_PATH, CONFIG_FILES_PATH
import os, requests
from dotenv import load_dotenv

def get_app_config(project_id):
    return get_breeze_config_file(project_id, "APP_CONFIG")


def write_app_config(project_id, config):
    app_config_path = f"{CONFIG_PATH}/{project_id}/{CONFIG_FILES_PATH['APP_CONFIG']}.json"
    write_json_file(app_config_path, config)


def manage_dependencies(project_id, package_name, package_version=None, operation="add"):
    
    app_basic_config = get_app_config(project_id)

    if "dependencies" not in app_basic_config:
        if operation == "delete":
            raise ValueError("Dependencies not found in configuration.")
        app_basic_config["dependencies"] = {}

    dependencies = app_basic_config["dependencies"]
    
    load_dotenv()
    SERVER_HOST = os.getenv("SERVER_HOST") 
    THIRD_PARTY_PARSER_PORT = os.getenv("THIRD_PARTY_PARSER_PORT")
    api_url= f"http://{SERVER_HOST}:{THIRD_PARTY_PARSER_PORT}/"
    payload = {
            "category": "third_party",
            "fileName": package_name,
            "fileVersion":package_version
        }
    requests.post(api_url,json=payload)

    if operation == "add":
        dependencies[package_name] = package_version

    elif operation == "update":
        if package_name in dependencies:
            dependencies[package_name] = package_version
        else:
            raise ValueError(f"Package {package_name} not found in dependencies.")

    elif operation == "delete":
        if package_name in dependencies:
            del dependencies[package_name]
        else:
            raise ValueError(f"Package {package_name} not found in dependencies.")
    
    else:
        raise ValueError("Invalid operation. Use 'add', 'update', or 'delete'.")

    write_app_config(project_id, app_basic_config)
    install_dependencies(app_basic_config)

    return dependencies


def add_package_to_dependencies(project_id, package_name, package_version):
    return manage_dependencies(project_id, package_name, package_version, operation="add")


def update_package_in_dependencies(project_id, package_name, package_version):
    return manage_dependencies(project_id, package_name, package_version, operation="update")


def delete_package_from_dependencies(project_id, package_name):
    return manage_dependencies(project_id, package_name, operation="delete")
