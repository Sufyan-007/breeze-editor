**Project setup steps**
-

1. Clone editor branch
2. Installing python requirements: In the root folder of repository, run **_pip3 install -r requirements.txt_**
3. To run the server, navigate to _**breeze**_ folder and execute _**python3 manage.py runserver**_
4. Installing frontend libraries: Navigate to **_editor_ui_** folder and execute **_npm i_** 
5. In the same folder, execute **_npm start_** to run the frontend

**NOTE**
- 

- The configuration files for generated project will be stored in **_breezeui/configurations_** folder 
- By default, New projects would be generated in a folder named **_generated_projects_**  in the parent folder of the project
- For existing project configuration, the project will be generated in the path specified in the _**app_basic_config.json**_ file. Edit this path to generate the project in the desired directory


---------------------

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


