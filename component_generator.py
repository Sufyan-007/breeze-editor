import json
import subprocess


APP_NAME = "my_react_app"
SOURCE_DIR = "src/components"

COMPONENTS_PATH = f"{APP_NAME}/{SOURCE_DIR}"

def generate_react_component(config):
    component_uuid = config['component_uuid']
    name = component_uuid['name']
    state_vars = component_uuid['stateVars']
    props_vars = component_uuid['propsVars']
    html = component_uuid['html']
    functions = component_uuid['functions']

    state_vars_declaration = '\n'.join([f'const [{var["name"]}, set{var["name"].capitalize()}] = useState("{var["defaultValue"]}");' for var in state_vars])
    props_vars_declaration = '\n'.join([f'const {var["name"]} = props.{var["name"]};' for var in props_vars])
    # functions_code = '\n\n'.join()
    
    functions_definition = '\n\n'.join([f'def {func["name"]}(event):' for func in functions])
    functions_body = '\n'.join([f'    {func["body"]}' for func in functions])

    
    react_component = f'''
        import React, {{ useState }} from 'react';

        const {name} = (props) => {{
            {state_vars_declaration}
            {props_vars_declaration}
            

            return (
                <div>{html}</div>
            );
        }};

        export default {name};
    '''
    
    return react_component

# Sample component structure
# component_structure = {
#     "main" : {
#         "component" : "uuid1",
#         "childs" : [
#             {
#                 "component" : "uuid2",
#                 "childs" : ""
#             }
#         ]
#     }
# }

# Sample JSON configuration
json_config = '''
{
    "component_uuid": {
        "name": "ABC",
        "containingFile":"ABC.js",
        "stateVars": [
            {"name": "isLoggedIn", "type": "String", "defaultValue": "FALSE"}
        ],
        "propsVars": [
            {"name": "type", "type": "String", "defaultValue": "CHECKIN"}
        ],
        "functions": [
            {
                "name": "handleInputChange",
                "parameters": [
                    {
                        "name":"event"
                    }
                ],
                "body": "const newValue = event.target.value;setInputValue(newValue); "
            }
        ],
        "html": "<div> {{isLoggedIn}} - {{type}} <TEMP /> </div>"
    }
}
'''

json_config2 = '''
{
    "component_uuid": {
        "name": "TEMP",
        "containingFile":"common/TEMP.js",
        "stateVars": [
        ],
        "propsVars": [
        ],
        "functions":[
        ],
        "html": "<div> Temp component</div>"
    }
}
'''

jsons = [
    json_config, json_config2
]

import os

def get_dir_path_from_file(file_path):
    return os.path.dirname(file_path)

def create_dir_if_not_exists(file_path):
    dir_path = get_dir_path_from_file(file_path)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)

for component_config in jsons:
    config = json.loads(component_config)
    react_component_code = generate_react_component(config)
    print(react_component_code)

    # Get the output file name from the JSON configuration
    output_file = f"{COMPONENTS_PATH}/{config['component_uuid']['containingFile']}"

    formatted_code = subprocess.check_output(['npx', 'prettier', '--parser', 'babel'], input=react_component_code, text=True)

    # Create parent dir if not exists
    create_dir_if_not_exists(output_file)

    # Write the component code to the specified output file
    with open(output_file, 'w') as file:
        file.write(formatted_code)


    print(f"React component code has been written to '{react_component_code}'")


