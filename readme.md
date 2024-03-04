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
