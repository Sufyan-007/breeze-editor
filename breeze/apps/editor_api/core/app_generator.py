# from component_generator import write_components
import subprocess
import json, os , uuid
from common.utils.formatter import format_by_prettier,format_val
import pathlib
import shutil
import re
from .files_upload_service import FileService
# JSON input with custom configurations and default component name

from common.utils.config_reader import read_config_file, read_file_json, write_file
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH, JSX_TEMPLATE_PATH,TSX_TEMPLATE_PATH
from .component_generator import ComponentGenerator, gen_single_import
from .api_client_generator import GenerateAPIClient
from .helpers.api_parameters_mapping import APIParametersMapping
from .project_generation_progress import ProjectGenerationProgress


from .helpers.routing_handler import RouteHandler
from .reducer_generator import ReducerGenerator
from .redux_store_generator import ReduxStoreGenerator
from .service_generator import ServiceHandler
from .helpers.import_helper import ImportHelper
from .helpers.dependencies_manager import DependencyManager
from .helpers.style_handler import StyleHandler
import sys
import pathlib
from apps.directory_management.core.directory_management_service import DirectoryManager
# APP_CONFIG_PATH =  f"{CONFIG_PATH}/{sys.argv[1]}"
# print("-------------", APP_CONFIG_PATH)

class AppGenerator:

    app_config_dir = None
    app_config = {}
    comp_config = {} 
    # mapping_config = {}
    routing_config = None
    reducer_config = None
    redux_store_config = None
    

    def __init__(self, app_config_dir, logo=None):
        self.app_config_dir = f"{CONFIG_PATH}/{app_config_dir}"
        self.app_config['APP_CONFIG_PATH'] = f"{CONFIG_PATH}/{app_config_dir}"
        self.read_configs()
        self.logo = logo
        self.directory_manager= DirectoryManager(self.project_name)
        
    def read_configs(self):
        self.app_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        self.app_config['APP_SOURCE_DIR'] = f"{self.app_config['path']}/{self.app_config['name']}/{self.app_config['components_src_dir']}"
        self.app_config['APP_CONFIG_PATH'] = self.app_config_dir
        # Read config of component written in component_config file
        self.comp_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['COMPONENT_CONFIG'])
        
        # Read component config from different files and prepare map of config for all
        self.prepare_comp_config()

        self.context_comp_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['CONTEXT_COMPONENT_CONFIG'])
        self.reducer_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['REDUCER_CONFIG'])
        self.redux_store_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['REDUX_STORE_CONFIG'])
        self.app_config['MAPPINGS'] = {}
        self.app_config['CSS_CONFIG'] = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['CSS_CONFIG'])
        
        self.project_name = self.app_config['name']
        # self.prepare_path_mappings() 
        # self.prepare_mapping_config()

        self.routing_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['ROUTING_CONFIG'])

    def generate_app(self):

        # Create React App using create-react-app 
        self.create_react_app()

        # Install dependecies
        self.install_dependencies()
       
        # Set base path for the components
        self.setup_base_path_for_comps()

        self.add_sandbox()

        # Modify main component (App.js)
        self.modify_main_component()

        # Write All components
        self.write_components()

        # Write All reducer
        self.write_reducers()

        # Write All reducer
        self.write_redux_store()
        # Write css
        self.write_style_files()


        # Write All services
        self.write_services()

        # Write All reducer
        self.write_reducers()
        
        self.create_styles_file()
        # # Write All reducer
        # self.write_redux_store()

        # Generate API client from yaml
        try:
            self.generate_api_client()
        except:
            print("----------------------")
            print("No YAML file")

        self.modify_index_html_with_project_name()

        # Conditionally modify index.html with logo
        if self.logo:
            self.modify_index_html_with_logo()

    def write_services(self):
        # imp_helper = ImportHelper()
        service_handler = ServiceHandler(self.app_config)
        service_handler.generate_services_code()
        # pass

    # Handle generation of style related files
    def write_style_files(self):
        StyleHandler.generate_style_code(self.app_config)
        

    def prepare_path_mappings(self):
        service_paths = self.read_all_services_path()
        self.app_config['MAPPINGS']['SERVICES'] = {}

        for service_path in service_paths:
            service_config = read_file_json(service_path)
            print(service_config['$id'])
            self.app_config['MAPPINGS']['SERVICES'][service_config['$id']] = service_config['path']

        
    def read_all_services_path(self):
        print("READ")
        service_config_path = f"{self.app_config['APP_CONFIG_PATH']}/services"

        all_services_path = pathlib.Path(service_config_path)

        all_services_path = list(all_services_path.rglob("*.json"))

        print(all_services_path)

        return all_services_path
    
    # Read components path
    def read_components_configs_path(self):
        comp_config_path = f"{self.app_config['APP_CONFIG_PATH']}/app_components"

        all_comp_path = []

        
        all_comp_path = pathlib.Path(comp_config_path)

        
        all_comp_path = list(all_comp_path.rglob("component_*.json"))

        return all_comp_path

    def create_react_app(self):
        project_name = self.app_config['name']
        destination_path = self.app_config['path']
        src_folder = TSX_TEMPLATE_PATH if self.app_config.get("language")=="typescript" else JSX_TEMPLATE_PATH
        
        for item in os.listdir(src_folder):
            src_item = os.path.join(src_folder, item)
            dest_item = os.path.join(destination_path, item)
            
            if os.path.isdir(src_item):
                # If it's a directory, copy it recursively
                shutil.copytree(src_item, dest_item)
            else:
                # If it's a file, copy it
                shutil.copy2(src_item, dest_item)
        

    def add_sandbox(self):
        with open(f"{self.app_config['path']}/src/SandBox.jsx", "w") as component_file:
            component_code = """
                import React, { useState, useEffect, Fragment } from "react";
                const SandBox = () => {
                    const [MyComponent, setMyComponent] = useState(() => () => <div>Sandbox</div>);
                    const [inputVal, setInputVal] = useState("");
                    const [componentDir, setComponentDir] = useState("");
                    const [customProps, setCustomProps] = useState({});

                    useEffect(() => {
                        const handleMessage = (event) => {
                            if (event.origin === "http://localhost:3000" || true) {
                                if (event.data.type === "resource") {
                                    const resource = event.data.resource;
                                    if (resource.type === "component") {
                                        setComponentDir(resource.component.containingFile);
                                    }
                                    if (resource.type === "props") {
                                        setCustomProps(resource.props);
                                    }
                                }
                            }
                        };
                        window.parent.postMessage(
                            { source: "APP", type: "request", request: { type: "component" } },
                            "*",
                        );
                        window.parent.postMessage(
                            { source: "APP", type: "request", request: { type: "props" } },
                            "*",
                        );

                        window.addEventListener("message", handleMessage);

                        return () => {
                            window.removeEventListener("message", handleMessage);
                        };
                    }, []);

                    useEffect(() => {
                        const loader = async () => {
                            try {
                                const comp = await import(`/${componentDir}`);
                                setMyComponent(() => comp.default || comp);
                                console.log(comp)
                            } catch (error) {
                                console.error("Failed to load component:", error);
                            }
                        };

                        if (componentDir) {
                            loader();
                        }
                    }, [componentDir]);

                    return (
                        <Fragment>
                            <div className="container-fluid" id="SandBox">
                                
                                <MyComponent {...customProps} id="SandBox-1-1" />

                            </div>
                        </Fragment>
                    );
                };

                export default SandBox;

            """

            formatted_code = format_by_prettier(component_code)
            component_file.write(formatted_code)
        

    def modify_main_component(self):
        

        route_handler = RouteHandler(self.app_config, self.routing_config, self.comp_config)
        react_code = route_handler.handle_routing_code()
        print("------")
        print(react_code)
        
        self.directory_manager.save_file("MAIN_COMPONENT",react_code)
        

    def setup_base_path_for_comps(self):
        with open(f"{self.app_config['path']}/jsconfig.json", "w+") as jsconfig_file:
            conf = f'''{{
                "compilerOptions": {{
                    "baseUrl": "src"
                }},
                "include": ["src"]
            }}'''

            jsconfig_file.write(conf)

    def generate_api_client(self):
        api_client_generator = GenerateAPIClient(app_config=self.app_config)
        api_client_generator.read_yaml()
        
    def install_dependencies(self):
        project_name = self.app_config['name']
        app_dependencies = self.app_config['dependencies']
        package_json_path = self.directory_manager.get_path_from_file_id("PACKAGE_CONFIG")
        
        package_json = read_file_json(package_json_path)

        print(package_json)
        for dep in app_dependencies:
            package_json['dependencies'][dep] = app_dependencies[dep]  
        
        package_json['devDependencies']['web-vitals'] = "^3.5.0"

        package_json['scripts']['dev'] = "vite --mode default"
        package_json['name'] = self.project_name
        self.directory_manager.save_file("PACKAGE_CONFIG",json.dumps(package_json),formatted=False)

        # subprocess.run(["npm", "install"], cwd=f"{self.app_config['path']}/{self.app_config['name']}")
        process = subprocess.Popen(
            " ".join(["npm", "install"]), shell=True,
            cwd=self.app_config['path'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True,
            text=True, 
        )
        ProjectGenerationProgress.store_process(project_name, process, "installing_dependencies")
        process.wait()
        if package_json['dependencies'].get('bootstrap') is not None:
            DependencyManager().handle_bootstrap(self.directory_manager.get_path_from_file_id("PROJECT_ROOT_FILE"))

    def prepare_comp_config(self):
        comp_paths = self.read_components_configs_path()

        for comp_path in comp_paths:
            comp_config = read_file_json(comp_path)
            print(comp_config['$id'])
            self.comp_config[comp_config['$id']] = comp_config


    def write_components(self):
        comp_generator = ComponentGenerator(
            all_comp_config=self.comp_config, 
            app_config=self.app_config,
            all_context_comp_config=self.context_comp_config,
            all_store_config=self.redux_store_config,
            all_reducer_config=self.reducer_config
            # mapping_config=self.mapping_config
            )
        comp_generator.write_all_components()
        # comp_generator.write_all_contexts()

    def write_reducers(self):
        reducer_generator = ReducerGenerator(all_reducer_config=self.reducer_config, app_config=self.app_config)
        reducer_generator.write_all_reducers()

    def write_redux_store(self):
        redux_store_generator = ReduxStoreGenerator(all_redux_store_config=self.redux_store_config,all_reducer_config=self.reducer_config, app_config=self.app_config,all_comp_config=self.comp_config)
        redux_store_generator.write_all_store()
        
    def create_styles_file(self):
        self.directory_manager.save_file("ALL_STYLES_FILE","")
     
    #create project file structure based on the pre defined folder structure
    # def create_directory_structure(self):
        
    #     directory_management_path = os.path.join(self.app_config['APP_CONFIG_PATH'], "directory_management.json")

    #     with open(directory_management_path, 'r') as dir_mgmt_file:
    #         structure = json.load(dir_mgmt_file)
        
    #     base_path = os.path.join(self.app_config['path'], self.app_config['name'])
    #     # Create a map of ID to path
    #     id_to_path = {}

    #     for item_id, item in structure.items():
    #         # Create the path based on lineage
    #         path_parts = [base_path] + [structure[ancestor]['name'] for ancestor in item['lineage']] + [item['name']]
    #         print(path_parts,"path parts")
    #         current_path = os.path.join(*path_parts)
    #         print(current_path,"current path")

    #         if item['type'] == 'DIRECTORY':
    #             os.makedirs(current_path, exist_ok=True)
    #         elif item['type'] == 'FILE':
    #             # Create a file 
    #             with open(current_path, 'w') as file:
    #                 file.write(f"// {item['name']} content")

    #         # Map the ID to the created path
    #         id_to_path[item_id] = current_path

    #     print("Project structure created successfully.")

    def modify_index_html_with_project_name(self):
        index_html_path = self.directory_manager.get_path_from_file_id("INDEX_HTML")
    
        # Modify the index.html to reference the new project name
        with open(index_html_path, 'r') as index_file:
            index_content = index_file.read()
    
        # Use regex to find and replace the title content
        title_pattern = re.compile(r'<title>(.*?)</title>')
        modified_content = title_pattern.sub(
            f'<title>{self.app_config["projectName"]}</title>',
            index_content
        )
        with open(index_html_path, 'w') as index_file:
            index_file.write(modified_content)


    def modify_index_html_with_logo(self):
        index_html_path =  self.directory_manager.get_path_from_file_id("INDEX_HTML")

        logo_id = self.app_config.get('logo')
        logo_file_name = self.app_config.get('logo_file_name', 'default.ico')  
        project_name = self.app_config['name']

        # Define the public logo path
        public_logo_path = os.path.join(self.app_config['path'], 'public', logo_file_name)

        if logo_id:
            # Download the file
            downloaded_file_path = FileService.download_file(logo_id, project_name)

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

                print(f"Modified {index_html_path} to include logo from {public_logo_path}")
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

