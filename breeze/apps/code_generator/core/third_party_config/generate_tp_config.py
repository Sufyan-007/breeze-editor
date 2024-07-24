# File to generate the config

# To run this file

# Uncomment last line of this file which calls the call_node_script function
# NOTE: after running comment the last line which calls the call_node_script function 

# CD to the path where the apps folder is located

# Run  python3 -m apps.code_generator.core.third_party_config.generate_tp_config


import execjs
import os
import subprocess

from common.utils.app_consts import THIRD_PARTY_CONFIG_PATH, JS_FILE_PATH, JS_FUNCTION_NAME, DEFAULT_THIRD_PARTY_CONFIG_FOLDER_NAME


def call_config_generator(library_name):
    with open(JS_FILE_PATH, 'r') as parse_file:
        parse_script = parse_file.read()

    # Create a context using the default runtime
    context = execjs.compile(parse_script)

    # Call the generator function from file
    output = context.call(JS_FUNCTION_NAME, library_name)

    print(output)

    return output


# Generate ast from the given script path
def call_node_script(script_path, function_name, *args):
    command = ["node", script_path, function_name,  *args]
    # print(command)
    result = subprocess.run(" ".join(command), shell=True, capture_output=True, text=True)
    print(result)


    if result.returncode == 0:
        print("JavaScript function executed successfully.")
        print("Output:", result.stdout)
        return result.stdout
    else:
        print("Error executing JavaScript function.")
        print("Error:", result.stderr)


def get_path():
    if THIRD_PARTY_CONFIG_PATH is not None:

        # if not os.path.isdir(THIRD_PARTY_CONFIG_PATH):
        #     print("THIRD PARTY CONFIG FOLDER PATH DOES NOT EXISTS, CREATING ...")
        #     os.makedirs(THIRD_PARTY_CONFIG_PATH)

        return THIRD_PARTY_CONFIG_PATH

    default_path = os.path.abspath(os.path.join(os.path.dirname(__name__), '..', DEFAULT_THIRD_PARTY_CONFIG_FOLDER_NAME))
    print(f'Path not given, Storing config using default path {default_path}')

    
    return default_path

# call_node_script(JS_FILE_PATH, JS_FUNCTION_NAME, 'react-bootstrap', get_path())

