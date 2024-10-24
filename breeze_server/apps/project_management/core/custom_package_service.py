

import os
import shutil
import zipfile
import json
from datetime import datetime, timezone
from apps.common.constants.consts import CONFIG_PATH, CONFIG_FILES_PATH, CUSTOM_UPLOADS, CUSTOMIZED_PROJ
from apps.common.utils.file_helpers.dir_handler import create_parent_dir_if_not_exists,create_dir_if_not_exists
from apps.common.utils.file_helpers.json_handler import read_project_config_file
from apps.directory_management.core.directory_management_service import DirectoryManager
from .custom_uploads_directory_config import create_json_structure, save_json_to_file
def save_extracted_file(file, path):
    create_parent_dir_if_not_exists(path)

    with open(path, "wb") as destination:
        for chunk in file.chunks():
            destination.write(chunk)

def get_project_config(project_name):
    app_config_dir = f"{CONFIG_PATH}/{project_name}"
    app_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
    app_config['PATH'] = f"{app_config['path']}"
    react_app_dir = app_config['PATH']
    return app_config, react_app_dir , app_config_dir

def write_config_file(path, data):
    with open(path, "w") as file:
        json.dump(data, file, indent=4)

def check_existing_folder(project_name, file_name):
    try:
        
        app_config, react_app_dir, app_config_dir = get_project_config(project_name)
        uploaded_resources_config_path = os.path.join(app_config_dir,'uploaded_resources_config,json')
        
        # Check if the config file exists
        if not os.path.exists(uploaded_resources_config_path):
            return False 
        
        # Load the JSON content from the config file
        with open(uploaded_resources_config_path, 'r') as config_file:
            resources_config = json.load(config_file)
            
        for resource_info in resources_config.values():
            if resource_info.get('zip_file_name') == file_name:
                return True
            
        return False

    except Exception as e:
        raise Exception(f"An error occurred while checking for the existing folder: {str(e)}")


def upload_file(project_name, file, fileName):
    if project_name is not None:       
        # Save the zip file to a temporary location
        temp_dir = os.path.join(CONFIG_PATH, project_name, "temp")
        create_dir_if_not_exists(temp_dir)
        temp_zip_path = os.path.join(temp_dir, fileName)
        save_extracted_file(file, temp_zip_path)

        try:
            extract_result = extract_zip_file(project_name, temp_zip_path, fileName)
            if 'error' in extract_result:
                raise Exception(extract_result['error'])
            
            os.remove(temp_zip_path)

            return extract_result  
        
        finally:
            #deleting the temp dir
            if os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)
                print(f"{temp_dir} has been removed")
    else:
        raise Exception('Project name is required to upload and extract files.')


def extract_zip_file(project_name, zip_file_path, fileName):
    try:
        # Directory for the React app
        app_config, react_app_dir, app_config_dir= get_project_config(project_name)
        
        # Ensure the React app directory exists
        if not os.path.exists(react_app_dir):
            os.makedirs(react_app_dir)
            
        custom_uploads_dir = os.path.join(react_app_dir, CUSTOM_UPLOADS)
        if not os.path.exists(custom_uploads_dir):
            os.makedirs(custom_uploads_dir)

        folder_name = os.path.splitext(fileName)[0]
        destination_path = os.path.join(custom_uploads_dir, folder_name)

        contains_folder = False
        
        with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
            # Check if the zip contains a folder
            for zip_info in zip_ref.infolist():
                if zip_info.is_dir():
                    contains_folder = True
                    break

            # If the zip does not contain a folder, create a folder in the React app and extract files
            if not contains_folder:
                os.makedirs(destination_path, exist_ok=True)
                for zip_info in zip_ref.infolist():
                    extracted_path = os.path.join(destination_path, zip_info.filename)
                    if zip_info.is_dir():
                        os.makedirs(extracted_path, exist_ok=True)
                    else:
                        zip_ref.extract(zip_info, destination_path)
            else:
                # If the zip contains a folder, extract everything directly into the destination path
                zip_ref.extractall(destination_path)

        # Generate JSON structure of the uploaded zip files (optional step based on your app's requirement)
        directory_manager = DirectoryManager(project_name)
        result = create_json_structure(directory_manager, destination_path, parent_id="CUSTOM_UPLOAD", tag="ZIP")

        print(f"Extracted files to {destination_path}")
        return {'message': 'Files extracted successfully.'}

    except Exception as e:
        print(f"An error occurred while extracting the zip file: {str(e)}")
        return {'error': str(e)}

def get_zip_files(project_name):
    try:
        app_config, react_app_dir, app_config_dir = get_project_config(project_name)
        uploaded_resources_config_path = os.path.join(app_config_dir,'uploaded_resources_config.json')

        # custom_uploads_path = os.path.join(react_app_dir,CUSTOM_UPLOADS)
        if not os.path.exists(uploaded_resources_config_path):
            return {'folders': []}

        with open(uploaded_resources_config_path,'r') as config_file:
            resources_config = json.load(config_file)
            
        extracted_folders = [
            {
                'zip_file_name': resource_info.get('zip_file_name'),
                "lastModified": datetime.fromtimestamp(
                    os.path.getmtime(os.path.join(uploaded_resources_config_path))
                ).astimezone(timezone.utc).strftime('%Y-%m-%d ')

            }
            for resource_info in resources_config.values()
            if 'zip_file_name' in resource_info
        ]
       
        return {
            'folders': extracted_folders
        }
    except Exception as e:
        raise Exception(f"An error occurred while retrieving extracted folders: {str(e)}")
                
def delete_file(project_name, fileName):
    try:
        app_config, react_app_dir, app_config_dir= get_project_config(project_name)
        react_app_file_path = os.path.join(react_app_dir, CUSTOM_UPLOADS , fileName)
        customized_proj_config_path = os.path.join(CONFIG_PATH, project_name, CUSTOMIZED_PROJ, fileName)
        
        def delete_path(file_path, location_name):
            if os.path.exists(file_path):
                if os.path.isfile(file_path):
                    os.remove(file_path)
                    print(f"File {fileName} deleted successfully from {location_name}.")
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
                    print(f"Directory {fileName} deleted successfully from {location_name}.")
                else:
                    print(f"{fileName} is neither a file nor a directory in {location_name}.")
            else:
                raise FileNotFoundError(f"{fileName} does not exist at {file_path} in {location_name}.")

        delete_path(react_app_file_path, "React app")
        delete_path(customized_proj_config_path, "customized_proj_config")

    except Exception as e:
        print(f"Error deleting file or directory: {e}")
    
def set_prop_config(project_name, file_name , component_id ,prop_id , new_prop_name=None, new_type=None, new_default_value=None ):
    try:
        #load the existing config for the project
        app_config, react_app_dir , app_config_dir = get_project_config(project_name)
        component_config_path= os.path.join(app_config_dir,"customized_proj_config",file_name,f"{component_id}.json")
        if not os.path.exists(component_config_path):
            raise FileNotFoundError("Component configuration file not found.")

        with open(component_config_path, 'r') as file:
            component_config= json.load(file)
            
         # Check if the prop exists in the configuration
        props = component_config.get('props', {})
        if prop_id not in props:
            raise KeyError("Prop not found in the configuration.")
        
         # Update the prop fields if provided
        if new_prop_name is not None:
            props[prop_id]['prop_name'] = new_prop_name
        if new_type is not None:
            props[prop_id]['type'] = new_type
        if new_default_value is not None:
            props[prop_id]['default_value'] = new_default_value
            
        # Save the updated configuration back to the file
        with open(component_config_path, 'w') as file:
            json.dump(component_config, file, indent=4)
            
        return component_config
    except Exception as e:
        print(f"Error editing the props: {e}")
        #raise exception errror

        
def update_resource_config(project_name, file_name ,file_id, status,  tag="ZIP"):
    resource_config_file_path= os.path.join(CONFIG_PATH, project_name, "uploaded_resources_config.json")
    
    if os.path.exists(resource_config_file_path):
        with open(resource_config_file_path, 'r') as config_file:
            config_data = json.load(config_file)
    else:
        config_data = {}
        
    # Update or add the new entry for the zip file
    config_data[file_id] = {
        "zip_file_name":file_name,
        "zip_file_id":file_id,
        "status": status,
        "tag": tag
    }

    # Write the updated config back to the file
    with open(resource_config_file_path, 'w') as config_file:
        json.dump(config_data, config_file, indent=4)
        
# def get_current_status(projectName, fileName):
#     resource_config_path = os.path.join(CONFIG_PATH,projectName, "uploaded_resources_config.json")

#     with open(resource_config_path, 'r') as f:
#         resource_config = json.load(f)
    
#     # Find the entry for the given fileName and return its status
#     if fileName in resource_config:
#         status = resource_config[fileName]['status']
#         return status
    
#     return 'status not found'