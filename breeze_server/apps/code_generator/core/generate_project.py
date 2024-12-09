import os
import shutil
import re
import json
import subprocess
import pathlib

from apps.common.constants.consts import JSX_TEMPLATE_PATH, TSX_TEMPLATE_PATH, CONFIG_FILES_PATH, CONFIG_PATH
from apps.common.utils.formatter import format_by_prettier
from apps.common.utils.file_helpers.json_handler import read_project_config_file, read_json_file
from apps.common.utils.file_helpers.config_handler import read_config_file
from apps.common.utils.file_helpers import file_handler
from apps.common.constants.enums.ResourceCategory import ResourceCategory

from apps.project_config_management.route_management.core.post_edit_operations import get_routing_code
from apps.directory_management.core.directory_management_service import DirectoryManager

from .new_component_generator import write_component
from .project_generation_progress import ProjectGenerationProgress
from ..utils.dependencies_manager import DependencyManager
from ..utils import static_code
from apps.project_management.core.resource_upload_service import save_file
from apps.code_generator.utils.static_code import SANDBOX_CODE
from apps.file_management.core.file_management import add_code_file
from apps.common.middlewares.TransactionMiddleware import get_transaction_id

def generate_project(project_config):

    project_name = project_config['name']
    app_config_dir = f"{CONFIG_PATH}/{project_name}"
    app_config = read_project_config_file(
        app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])

    # reading routing config
    config_data_obj = read_config_file(
        project_name, "routing_config", "routing_config")
    if config_data_obj.get('err'):
        raise Exception(config_data_obj['message'],
                        ": not able to read routing_config..")
    routing_config = config_data_obj.get('data')
    # routing_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['ROUTING_CONFIG'])

    ProjectGenerationProgress.store_func_progress(app_config['name'], 10)
    # Create React App using create-react-app
    create_react_app(app_config)
    ProjectGenerationProgress.store_func_progress(app_config['name'], 20)

    # Install dependecies
    install_dependencies(app_config)

    # Set base path for the components
    setup_base_path_for_comps(app_config)
    ProjectGenerationProgress.store_func_progress(app_config['name'], 80)

    add_sandbox(app_config)
    ProjectGenerationProgress.store_func_progress(app_config['name'], 90)

    # Modify main component (App.js)
    write_main_app_and_routing_component(app_config, routing_config)

    # the required main component is already created so no need to
    # implement this function as no other component is present or required
    # Write All components
    # write_components()

    # Generate API client from yaml
    try:
        # TODO: need to add it later
        generate_api_client(app_config)
    except:
        print("----------------------")
        print("No YAML file")
    modify_index_html_with_project_name(app_config)

    # Conditionally modify index.html with logo
    project_id = app_config.get('name')
    logoId = app_config.get('logoId')
    if logoId:
        directory_manager = DirectoryManager(project_name=project_id)
        image_path = directory_manager.get_path_from_file_id(logoId)
        save_file(project_id, logoId, image_path)
        modify_index_html_with_logo(app_config)

# create a new project by copying the present template


def create_react_app(app_config):

    project_name = app_config['name']
    destination_path = app_config['path']
    src_folder = TSX_TEMPLATE_PATH if app_config.get(
        "language") == "typescript" else JSX_TEMPLATE_PATH

    for item in os.listdir(src_folder):
        src_item = os.path.join(src_folder, item)
        dest_item = os.path.join(destination_path, item)
        if os.path.isdir(src_item):
            # If it's a directory, copy it recursively
            shutil.copytree(src_item, dest_item)
        else:
            # If it's a file, copy it
            shutil.copy2(src_item, dest_item)


def add_sandbox(app_config):
    with open(f"{app_config['path']}/src/SandBox.jsx", "w") as component_file:
        component_code = SANDBOX_CODE
        formatted_code = format_by_prettier(component_code)
        component_file.write(formatted_code)

# it add main component to route_config with "/" path and to component_config
# name it to ->


def write_main_app_and_routing_component(app_config, routing_config):
    app_config_dir = f"{CONFIG_PATH}/{app_config['name']}"
    
    config_index = read_json_file(f"{app_config_dir}/{ResourceCategory.CODE_FILE.value}/index")
    # reading routing config
    config_data_obj = read_config_file(
        app_config['name'], "routing_config", "routing_config")
    if config_data_obj.get('err'):
        raise Exception(config_data_obj['message'],
                        ": not able to read routing_config..")
    routing_config = config_data_obj.get('data')
    # routing_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['ROUTING_CONFIG'])
    
    # writing Main.jsx component (in src/components folder of generated project) AND ITS CONFIG ALSO..!?
    _id = app_config['defaultCompId']
    name = config_index.get(_id)
    transaction_id = get_transaction_id()
    add_code_file(f"{app_config['name']}", name, "SRC", f"{_id}", "COMPONENTS", f"{_id}", transaction_id)    
    
    directory_manager= DirectoryManager(app_config['name'])
    
    # write App.jsx component (in src/components folder of generated project)
    app_comp_code = static_code.Root_App_Code
    directory_manager.save_file("MAIN_COMPONENT", app_comp_code)

    # write Routing.jsx component (in src/components folder of generated project)
    routing_code = get_routing_code(app_config, routing_config, config_index, )
    directory_manager.save_file("ROUTE_COMPONENT", routing_code)


def setup_base_path_for_comps(app_config):
    with open(f"{app_config['path']}/jsconfig.json", "w+") as jsconfig_file:
        conf = f'''{{
            "compilerOptions": {{
                "baseUrl": "src"
            }},
            "include": ["src"]
        }}'''

        jsconfig_file.write(conf)

# TODO: add it later


def generate_api_client(app_config):
    # api_client_generator = GenerateAPIClient(app_config=app_config)
    # api_client_generator.read_yaml()
    pass


def install_dependencies(app_config):
    app_dependencies = app_config['dependencies']
    project_name = app_config['name']
    directory_manager = DirectoryManager(project_name)
    package_json_path = directory_manager.get_path_from_file_id(
        "PACKAGE_CONFIG")

    package_json = read_json_file(package_json_path, "")
    package_json['dependencies'] = {}
    for dep in app_dependencies:
        package_json['dependencies'][dep] = app_dependencies[dep]

    package_json['devDependencies']['web-vitals'] = "^3.5.0"

    package_json['scripts']['dev'] = "vite --mode default"
    package_json['name'] = project_name
    directory_manager.save_file(
        "PACKAGE_CONFIG", json.dumps(package_json), formatted=False)

    # subprocess.run(["npm", "install"], cwd=f"{app_config['path']}/{app_config['name']}")
    process = subprocess.Popen(
        " ".join(["npm", "install"]), shell=True,
        cwd=app_config['path'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True,
        text=True,
    )
    ProjectGenerationProgress.store_process(
        project_name, process, "installing_dependencies")
    process.wait()
    if package_json['dependencies'].get('bootstrap') is not None:
        DependencyManager().handle_bootstrap(
            directory_manager.get_path_from_file_id("PROJECT_ROOT_FILE"))


def read_components_configs_path(app_config):
    comp_config_path = f"{app_config['APP_CONFIG_PATH']}/app_components"
    all_comp_path = []
    all_comp_path = pathlib.Path(comp_config_path)
    all_comp_path = list(all_comp_path.rglob("component_*.json"))
    return all_comp_path


def prepare_comp_config(app_config):
    comp_paths = read_components_configs_path(app_config)
    for comp_path in comp_paths:
        comp_config = read_json_file(comp_path)

        comp_config[comp_config['$id']] = comp_config

# this function is useful when we want to generate multiple components and there corresponding lifecycle methods
# def write_components(app_config, comp_configcontext_comp_config, redux_store_config, reducer_config):
#     prepare_comp_config(app_config)
#     comp_generator = ComponentGenerator(
#         all_comp_config=comp_config,
#         app_config=app_config,
#         all_context_comp_config=context_comp_config,
#         all_store_config=redux_store_config,
#         all_reducer_config=reducer_config,
#         # mapping_config=mapping_config
#         )
#     comp_generator.write_all_components()
#     # comp_generator.write_all_contexts()


def modify_index_html_with_project_name(app_config):
    project_name = app_config['name']
    directory_manager = DirectoryManager(project_name)
    index_html_path = directory_manager.get_path_from_file_id("INDEX_HTML")

    # Modify the index.html to reference the new project name
    with open(index_html_path, 'r') as index_file:
        index_content = index_file.read()

    # Use regex to find and replace the title content
    title_pattern = re.compile(r'<title>(.*?)</title>')
    modified_content = title_pattern.sub(
        f'<title>{app_config["projectName"]}</title>',
        index_content
    )
    with open(index_html_path, 'w') as index_file:
        index_file.write(modified_content)


def modify_index_html_with_logo(app_config):
    project_name = app_config['name']
    directory_manager = DirectoryManager(project_name)
    index_html_path = directory_manager.get_path_from_file_id("INDEX_HTML")

    logo_id = app_config.get('logoId')
    app_config_dir = f"{CONFIG_PATH}/{project_name}"
    resource_config_path = f"{app_config_dir}/{CONFIG_FILES_PATH['RESOURCE_CONFIG']}"

    resource_config_file = read_json_file(resource_config_path)
    logo_object = resource_config_file.get(logo_id)
    logo_file_name = logo_object.get('name', 'default.ico')

    # Define the public logo path
    public_logo_path = os.path.join(
        app_config['path'], 'public', logo_file_name)

    if logo_id:
        # Download the file
        downloaded_file_path = file_handler.get_file_path(
            logo_id, project_name)

        if downloaded_file_path:
            # Copy the downloaded file to the public folder with the appropriate extension
            shutil.copy(downloaded_file_path, public_logo_path)

            # Modify the index.html to reference the new favicon
            with open(index_html_path, 'r') as index_file:
                index_content = index_file.read()

            modified_content = re.sub(
                r'<link rel="icon" type="image/svg\+xml" href=".*?" />',
                f'<link rel="icon" type="image/svg+xml" href="/{logo_file_name}" />',
                index_content
            )

            with open(index_html_path, 'w') as index_file:
                index_file.write(modified_content)

            print(
                f"Modified {index_html_path} to include logo from {public_logo_path}")
        else:
            print(f"Failed to download the logo with ID {logo_id}")
    else:
        # If logo is deleted, remove existing logo file if exists
        if os.path.exists(public_logo_path):
            os.remove(public_logo_path)
            print(f"Deleted logo file from {public_logo_path}")

        # Modify the index.html to reset to the default favicon
        with open(index_html_path, 'r') as index_file:
            index_content = index_file.read()

        modified_content = re.sub(
            r'<link rel="icon" type="image/svg\+xml" href=".*?" />',
            '<link rel="icon" type="image/svg+xml" href="/vite.svg" />',
            index_content
        )

        with open(index_html_path, 'w') as index_file:
            index_file.write(modified_content)

        print(f"Modified {index_html_path} to reset to default favicon")
