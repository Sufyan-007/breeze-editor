

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
    return app_config, react_app_dir

def write_config_file(path, data):
    with open(path, "w") as file:
        json.dump(data, file, indent=4)

def check_existing_folder(project_name, file_name):
    extracted_dir = os.path.join(CONFIG_PATH, project_name, EXTERNAL_COMPONENTS_CONFIG)
    
    # Check if the extracted_zip_folder directory exists
    if not os.path.exists(extracted_dir):
        return False  # If the directory doesn't exist, the folder can't exist either

    # List all folders in the extracted_zip_folders directory
    existing_folders = [f for f in os.listdir(extracted_dir) if os.path.isdir(os.path.join(extracted_dir, f))]

    # Return True if a folder with the same name exists
    return file_name in existing_folders

def upload_file(project_name, file, fileName):
    if project_name is not None:
        app_config, react_app_dir = get_project_config(project_name)
        
        # Save the zip file to a temporary location
        temp_dir = os.path.join(CONFIG_PATH, project_name, "temp")
        create_dir_if_not_exists(temp_dir)
        temp_zip_path = os.path.join(temp_dir, fileName)
        save_extracted_file(file, temp_zip_path)


        # After saving the file, extract its contents
        extract_result = extract_zip_file(project_name, temp_zip_path, fileName)
        if 'error' in extract_result:
            raise Exception(extract_result['error'])

        # Clean up: Remove the zip file after extraction
        os.remove(temp_zip_path)
        return extract_result  # Returning the result of extraction

    else:
        raise Exception('Project name is required to upload and extract files.')

def extract_zip_file(project_name, zip_file_path, fileName):
    try:
        extract_dir = os.path.join(CONFIG_PATH, project_name, EXTERNAL_COMPONENTS)
        zip_dir_path = os.path.join(extract_dir,fileName)
        # Ensure the extraction directory exists
        if not os.path.exists(extract_dir):
            os.makedirs(extract_dir)
            

        folder_name = os.path.splitext(fileName)[0]
        folder_for_files = os.path.join(extract_dir, folder_name)
        
        contains_folder = False
        
        with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
            for zip_info in zip_ref.infolist():
                if zip_info.is_dir():
                    contains_folder = True
                    break
                
            if not contains_folder:
                os.makedirs(folder_for_files, exist_ok=True)
                for zip_info in zip_ref.infolist():
                    extracted_path = os.path.join(folder_for_files, zip_info.filename)
                    if zip_info.is_dir():
                        os.makedirs(extracted_path, exist_ok=True)
                    else:
                        zip_ref.extract(zip_info, folder_for_files)
            else:
                os.makedirs(folder_for_files, exist_ok=True)
                zip_ref.extractall(folder_for_files)
        
        print("start")
        #generate JSON structure of the uploaded zip files
        directory_manager = DirectoryManager(project_name)
        result = create_json_structure(directory_manager,zip_dir_path,parent_id="EXTERNAL_COMPONENTS",tag="ZIP")
        print(result,"result")
        
        app_config, react_app_dir = get_project_config(project_name)
        
        print(react_app_dir,"react app dir ")
        
        if not os.path.exists(react_app_dir):
            os.makedirs(react_app_dir)
        
        if not contains_folder:
            destination_path = os.path.join(react_app_dir, folder_name)
            shutil.copytree(folder_for_files, destination_path)
        else:
            destination_path = os.path.join(react_app_dir, EXTERNAL_COMPONENTS)
            shutil.copytree(extract_dir, destination_path, dirs_exist_ok=True)
        
        print(f"Extracted files to {extract_dir}")
        return {'message': 'Files extracted successfully.', 'extracted_to': extract_dir}
    
    except Exception as e:
        print(f"An error occurred while extracting the zip file: {str(e)}")
        return {'error': str(e)}

def get_zip_files(project_name):
    try:
        extracted_dir = os.path.join(CONFIG_PATH, project_name, EXTERNAL_COMPONENTS)
    
        if not os.path.exists(extracted_dir):
            return {'folders': []}

        extracted_folders = [
            {
                "name": folder,
                "lastModified": datetime.fromtimestamp(
                    os.path.getmtime(os.path.join(extracted_dir, folder))
                ).astimezone(timezone.utc).strftime('%Y-%m-%d ')
            }
            for folder in os.listdir(extracted_dir)
            if os.path.isdir(os.path.join(extracted_dir, folder))
        ]
        
        return {
            'folders': extracted_folders
        }
    except Exception as e:
        raise Exception(f"An error occurred while retrieving extracted folders: {str(e)}")
        
def delete_file(project_name, fileName):
    try:
        app_config, react_app_dir = get_project_config(project_name)
        
        extracted_dir = os.path.join(CONFIG_PATH, project_name, EXTERNAL_COMPONENTS)
        uploaded_file_path = os.path.join(extracted_dir, fileName)
        react_app_file_path = os.path.join(react_app_dir, EXTERNAL_COMPONENTS, fileName)
        customized_proj_config_path = os.path.join(CONFIG_PATH, project_name, "customized_proj_config", fileName)
        
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

        delete_path(uploaded_file_path, EXTERNAL_COMPONENTS)
        delete_path(react_app_file_path, "React app")
        delete_path(customized_proj_config_path, EXTERNAL_COMPONENTS_CONFIG)

    except Exception as e:
        print(f"Error deleting file or directory: {e}")

