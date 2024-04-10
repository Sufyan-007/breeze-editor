**To Generate the third party config**

--- Set the variables in common/utils/app_consts.py ---

Change the following variables

THIRD_PARTY_CONFIG_PATH : Give full path where you want to store the configurations
ex. THIRD_PARTY_CONFIG_PATH = "/home/user/Desktop/bridge/processor/third_party_configs"

JS_FILE_PATH : Give the full path to index.js of third_party_config_generator folder, It's already  there inside a project you just need to give the path of it
ex. JS_FILE_PATH = '/home/raj/Desktop/bridge/breeze_ssh/breezeui/third_party_config_generator/index.js'


--- Run npm install in the node project ---

Go inside the third_party_config_generator

RUN npm install

--- Run the python file which executes the javascript ---

Find generate_tp_config.py file inside breeze/apps/code_generator/core/third_party_config

Open the file and follow the steps to run it
