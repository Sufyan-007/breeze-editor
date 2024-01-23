# from component_generator import write_components
import subprocess
import json
from common.utils.formatter import format_by_prettier,format_val
import pathlib

# JSON input with custom configurations and default component name
config_input = '''
{
    "name": "my_react_app",
    "description": "A custom React app",
    "author": "Your Name",
    "defaultComponent": "MyDefaultComponent"
}
'''

config = json.loads(config_input)
project_name = config["name"]

from common.utils.config_reader import read_config_file, read_file_json, write_file
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
from .component_generator import ComponentGenerator, gen_single_import
from .api_client_generator import GenerateAPIClient
from .helpers.api_parameters_mapping import APIParametersMapping


from .helpers.routing_handler import RouteHandler
from .reducer_generator import ReducerGenerator
from .redux_store_generator import ReduxStoreGenerator
from .service_generator import ServiceHandler
from .helpers.import_helper import ImportHelper
from .helpers.dependencies_manager import DependencyManager
from .helpers.style_handler import StyleHandler
import sys
import pathlib

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


    def __init__(self, app_config_dir):
        self.app_config_dir = f"{CONFIG_PATH}/{app_config_dir}"
        self.app_config['APP_CONFIG_PATH'] = f"{CONFIG_PATH}/{app_config_dir}"
        self.read_configs()

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
        self.prepare_path_mappings() 
        # self.prepare_mapping_config()

        self.routing_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['ROUTING_CONFIG'])

    def generate_app(self):
        project_name = self.app_config['name']

        # Create React App using create-react-app 
        self.create_react_app()

        # Install dependecies
        self.install_dependencies()

        # Set base path for the components
        self.setup_base_path_for_comps()

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

        # Write All components
        self.write_components()

        # Write All services
        self.write_services()

        # Write All reducer
        self.write_reducers()
        # # Write All reducer
        # self.write_redux_store()

        # Generate API client from yaml
        self.generate_api_client()





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
        app_config_dump = json.dumps(self.app_config)
        subprocess.run(["npx", "create-react-app", project_name, "--template",
                    "cra-template", "--use-npm"], text=True, input=app_config_dump, cwd=self.app_config['path'])


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

    def setup_base_path_for_comps(self):
        with open(f"{self.app_config['path']}/{self.app_config['name']}/jsconfig.json", "w+") as jsconfig_file:
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
        app_dependencies = self.app_config['dependencies']
        package_json = read_file_json(f"{self.app_config['path']}/{self.app_config['name']}/package.json")

        print(package_json)
        for dep in app_dependencies:
            package_json['dependencies'][dep] = app_dependencies[dep]  
        
        package_json['devDependencies'] = {}
        package_json['devDependencies']['web-vitals'] = "^3.5.0"

        write_file(f"{self.app_config['path']}/{self.app_config['name']}/package.json", json.dumps(package_json))

        subprocess.run(["npm", "install"], cwd=f"{self.app_config['path']}/{self.app_config['name']}")

        if package_json['dependencies'].get('bootstrap') is not None:
            DependencyManager().handle_bootstrap(app_config=self.app_config)

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


