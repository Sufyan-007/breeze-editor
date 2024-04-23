APP_BASIC = {
    "name": "Name of the project" ,
    "description": "description of the project",
    "author": "Your Name",
    "type" : "V_0",
    "defaultComponent": "main_comp",
    "strictMode" : False,
    "path" : "/home/yash/Documents/Projects/bridge_generated_projects",
    "components_src_dir" : "src",
    "dependencies" : {
        "axios" : "^1.5.1",
        "react-router-dom" : "*",
        "react-redux": "^7.1.3",
        "@reduxjs/toolkit": "^1.4.0",
        "bootstrap": "^5.3.2"

    }

}
    
class AppBasicConfig:
    # Name of the project 
    # Required
    name:str #"ProjectName"

    # description
    # Required
    description:str #"This is project description"

    author:str

    type:str

    defaultComponent:str

    strictMode : bool

    path:str


    components_src_dir:str


    dependencies:dict    


