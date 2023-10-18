# from component_generator import write_components
import subprocess
import json
from utils import formatter


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

from utils.config_reader import read_config_file, read_file_json, write_file
from utils.app_consts import CONFIG_FILES_PATH, APP_CONFIG_PATH
from component_generator import ComponentGenerator, gen_single_import
from reducer_generator import ReducerGenerator
from redux_store_generator import ReduxStoreGenerator

class AppGenerator:

    app_config_dir = None
    app_config = None
    comp_config = None 
    routing_config = None
    reducer_config = None
    redux_store_config = None


    def __init__(self, app_config_dir):
        self.app_config_dir = app_config_dir
        self.read_configs()

    def read_configs(self):
        self.app_config = read_config_file(CONFIG_FILES_PATH['APP_CONFIG'])
        self.comp_config = read_config_file(CONFIG_FILES_PATH['COMPONENT_CONFIG'])
        self.context_comp_config = read_config_file(CONFIG_FILES_PATH['CONTEXT_COMPONENT_CONFIG'])
        self.reducer_config = read_config_file(CONFIG_FILES_PATH['REDUCER_CONFIG'])
        self.redux_store_config = read_config_file(CONFIG_FILES_PATH['REDUX_STORE_CONFIG'])

        print(self.comp_config)
        self.routing_config = read_config_file(CONFIG_FILES_PATH['ROUTING_CONFIG'])

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

            formatted_code = formatter.format_by_prettier(component_code)
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


    def write_components(self):
        comp_generator = ComponentGenerator(all_comp_config=self.comp_config, app_config=self.app_config,all_context_comp_config=self.context_comp_config,all_store_config=self.redux_store_config)
        comp_generator.write_all_components()
        comp_generator.write_all_contexts()

    def write_reducers(self):
        reducer_generator = ReducerGenerator(all_reducer_config=self.reducer_config, app_config=self.app_config)
        reducer_generator.write_all_reducers()

    def write_redux_store(self):
        redux_store_generator = ReduxStoreGenerator(all_redux_store_config=self.redux_store_config,all_reducer_config=self.reducer_config, app_config=self.app_config,all_comp_config=self.comp_config)
        redux_store_generator.write_all_store()


app_generator = AppGenerator(APP_CONFIG_PATH)
app_generator.generate_app()
