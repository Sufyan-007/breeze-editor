

import os
import shutil
import zipfile
import json
from datetime import datetime, timezone
from apps.common.constants.consts import CONFIG_PATH, CONFIG_FILES_PATH , EXTERNAL_COMPONENTS,EXTERNAL_COMPONENTS_CONFIG
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
        uploaded_resources_config_path = os.path.join(app_config_dir,'uploaded_resources_config.json')
        
        # Check if the config file exists
        if not os.path.exists(uploaded_resources_config_path):
            return False 
        
        # Load the JSON content from the config file
        with open(uploaded_resources_config_path, 'r') as config_file:
            resources_config = json.load(config_file)
            
        for resource_info in resources_config.values():
            if resource_info.get('name') == file_name:
                return True
            
        return False

    except Exception as e:
        raise Exception(f"An error occurred while checking for the existing folder: {str(e)}")


def upload_file(project_name, file, fileName,file_id):  
    if project_name is not None:       
        # Save the zip file to a temporary location
        temp_dir = os.path.join(CONFIG_PATH, project_name, "temp")
        create_dir_if_not_exists(temp_dir)
        temp_zip_path = os.path.join(temp_dir, fileName)
        save_extracted_file(file, temp_zip_path)

        try:
            extract_result = extract_zip_file(project_name, temp_zip_path, fileName,file_id)
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

def extract_zip_file(project_name, zip_file_path, fileName, file_id):
    try:
        app_config, react_app_dir, app_config_dir = get_project_config(project_name)
        if not os.path.exists(react_app_dir):
            os.makedirs(react_app_dir)

        # Define folder names
        folder_name = os.path.splitext(fileName)[0]
        folder_for_files = os.path.join(react_app_dir, EXTERNAL_COMPONENTS, folder_name)
        
        contains_folder = False
        
        with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
            # Check if the zip contains a root folder
            for zip_info in zip_ref.infolist():
                if zip_info.is_dir():
                    contains_folder = True
                    break
            
            # Extract directly to the final destination
            os.makedirs(folder_for_files, exist_ok=True)
            if not contains_folder:
                # Extract each file and directory manually without a top-level folder
                for zip_info in zip_ref.infolist():
                    extracted_path = os.path.join(folder_for_files, zip_info.filename)
                    if zip_info.is_dir():
                        os.makedirs(extracted_path, exist_ok=True)
                    else:
                        zip_ref.extract(zip_info, folder_for_files)
            else:
                zip_ref.extractall(folder_for_files)
        
        # Generate JSON structure of the uploaded zip files directly from the destination path
        directory_manager = DirectoryManager(project_name)
        result = create_json_structure(directory_manager, folder_for_files,file_id, parent_id="EXTERNAL_COMPONENTS", tag="ZIP")

        print(f"Extracted files to {folder_for_files}")
        return {'message': 'Files extracted successfully.', 'extracted_to': folder_for_files}
    
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
                'name': resource_info.get('name'),
                "zip_file_id":resource_info.get('zip_file_id'),
                "lastModified": datetime.fromtimestamp(
                    os.path.getmtime(os.path.join(uploaded_resources_config_path))
                ).astimezone(timezone.utc).strftime('%Y-%m-%d '),
                "status":resource_info.get('status')

            }
            for resource_info in resources_config.values()
            if 'name' in resource_info
        ]
       
        return {
            'folders': extracted_folders
        }
    except Exception as e:
        raise Exception(f"An error occurred while retrieving extracted folders: {str(e)}")
                
def delete_file(project_name, fileName, fileId):
    try:
        app_config, react_app_dir, app_config_dir = get_project_config(project_name)
        react_app_file_path = os.path.join(react_app_dir, EXTERNAL_COMPONENTS, fileName)
        external_components_config_path = os.path.join(CONFIG_PATH, project_name, "external_components_config", fileName)
        uploaded_resources_config_path = os.path.join(CONFIG_PATH,project_name,"uploaded_resources_config.json")
        
        def delete_path(file_path, location_name):
            if os.path.exists(file_path):
                if os.path.isfile(file_path):
                    os.remove(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
                else:
                    print(f"{fileName} is neither a file nor a directory in {location_name}.")
            else:
                print(f"{fileName} does not exist at {file_path} in {location_name}.")

        delete_path(react_app_file_path, "React app")
        delete_path(external_components_config_path, "external components config")
 
        #delete the file object from resource config 
        if os.path.exists(uploaded_resources_config_path):
            with open(uploaded_resources_config_path, 'r+') as config_file:
                data = json.load(config_file)
                
                # Check if the fileId exists and delete the object if found
                if fileId in data:
                    
                    del data[fileId]
                    print(f"File object with ID {fileId} deleted successfully from resource config.")
                    
                    # Write the updated data back to the JSON file
                    config_file.seek(0)
                    json.dump(data, config_file, indent=4)
                    config_file.truncate()
                else:
                    print(f"File object with ID {fileId} not found in resource config.")
        else:
            raise FileNotFoundError("Resource config file does not exist.")
    
    except Exception as e:
        raise Exception(f"Error deleting file or directory: {e}")
    
def set_prop_config(project_name, file_name , component_id ,prop_id , new_prop_name=None, new_type=None, new_default_value=None ):
    try:
        #load the existing config for the project
        app_config, react_app_dir , app_config_dir = get_project_config(project_name)
        component_config_path= os.path.join(app_config_dir,"external_components_config",file_name,f"{component_id}.json")
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
        raise Exception(f"Error editing the props: {e}")
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
        "name":file_name,
        "zip_file_id":file_id,
        "status": status,
        "tag": tag
    }

    # Write the updated config back to the file
    with open(resource_config_file_path, 'w') as config_file:
        json.dump(config_data, config_file, indent=4)
        