import subprocess
import json
from utils import formatter

def create_react_app_with_config_and_component(project_name, config):
    component_name = config.get("defaultComponent", "DefaultComponent")
    config.pop("defaultComponent", None)  # Remove the component name from config

    config_json = json.dumps(config)
    subprocess.run(["npx", "create-react-app", project_name, "--template", "cra-template", "--use-npm"], text=True, input=config_json)

    # Create the default component
    with open(f"{project_name}/src/{component_name}.js", "w") as component_file:
        component_code = f"""
import React from 'react';

function {component_name}() {{
    return (
        <div>
            <p>This is the {component_name} component.</p>
        </div>
    );
}}

export default {component_name};
"""
        component_file.write(component_code)


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

# Call the function to create the React app with custom configurations and default component
# create_react_app_with_config_and_component(project_name, config)




def change_main_component(project_name):
    comp_config_file = open('./configurations/component_config.json')
    component_config = json.load(comp_config_file)

    app_config_file = open('./configurations/app_basic_config.json')
    app_config = json.load(app_config_file)

 
    with open(f"../{project_name}/src/App.js", "w") as component_file:
        component_code = f"""
            import React from 'react';

            function App() {{
                return (
                    <{component_config[app_config['defaultComponent']]['name']} />
                );
            }}

            export default App;
        """

        formatted_code = formatter.format_by_prettier(component_code)
        component_file.write(formatted_code)


change_main_component("my_react_app")
# {
#     "name": "MyReactApp",
#     "version": "1.0.0",
#     "description": "A custom React app",
#     "author": "Your Name",
#     "template": "cra-template",
#     "useNpm": true,
#     "typescript": true,
#     "eslint": "react-app",
#     "stylelint": true,
#     "jest": true,
#     "jestTimeout": 5000,
#     "testingLibrary": true,
#     "cypress": true,
#     "useTemplate": true,
#     "usePnp": true,
#     "useEslint": true,
#     "useFlow": false,
#     "useTs": false,
#     "useTslint": false
# }

