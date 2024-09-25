import os
import shutil
import zipfile
import json
from datetime import datetime, timezone
from common.utils.app_consts import CONFIG_PATH, CONFIG_FILES_PATH
from common.utils.file_helper import create_parent_dir_if_not_exists
from common.utils.config_reader import read_config_file

def save_extracted_file(file, path):
    create_parent_dir_if_not_exists(os.path.dirname(path))

    with open(path, "wb") as destination:
        for chunk in file.chunks():
            destination.write(chunk)

class CustomPackageService:
    def __init__(self, project_name):
        self.project_name = project_name
        self.app_config_dir = f"{CONFIG_PATH}/{project_name}"
        self.app_config = read_config_file(self.app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        self.app_config['PATH'] = f"{self.app_config['path']}"
        self.react_app_dir = os.path.join(self.app_config['PATH'], self.project_name)
    def read_config_file(self, path):
        if os.path.exists(path):
            with open(path, "r") as file:
                return json.load(file)
        return {}

    def write_config_file(self, path, data):
        with open(path, "w") as file:
            json.dump(data, file, indent=4)

    def upload_file(self, file, fileName):
        if self.project_name is not None:
            # Save the zip file to a temporary location
            temp_dir = os.path.join(CONFIG_PATH, self.project_name, "temp")
            create_parent_dir_if_not_exists(temp_dir)
            temp_zip_path = os.path.join(temp_dir, fileName)
            save_extracted_file(file, temp_zip_path)
            
            # After saving the file, extract its contents
            extract_result = self.extract_zip_file(temp_zip_path, fileName)
            if 'error' in extract_result:
                raise Exception(extract_result['error'])
            
            # Clean up: Remove the zip file after extraction
            os.remove(temp_zip_path)
            
            return extract_result  # Returning the result of extraction
        
        else:
            raise Exception('Project name is required to upload and extract files.')

    def extract_zip_file(self, zip_file_path, fileName):
        try:
            # Define extraction path
            extract_dir = os.path.join(CONFIG_PATH, self.project_name, "extracted_zip_files")
            
            # Ensure the extraction directory exists
            if not os.path.exists(extract_dir):
                os.makedirs(extract_dir)
                
            contains_folder = False 
            
            # Get zip file name without extension
            folder_name = os.path.splitext(fileName)[0]
            
            # Path for the newly created folder
            folder_for_files = os.path.join(extract_dir, folder_name)
            print(folder_for_files, "new folder created path")
            
            with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
                for zip_info in zip_ref.infolist():
                    if zip_info.is_dir():
                        contains_folder = True
                        break
                    
                # If no folders are found, create a new folder and extract files into it
                if not contains_folder:
                    os.makedirs(folder_for_files, exist_ok=True)
                    for zip_info in zip_ref.infolist():
                        extracted_path = os.path.join(folder_for_files, zip_info.filename)
                        if zip_info.is_dir():
                            os.makedirs(extracted_path, exist_ok=True)
                        else:
                            # Extract the file 
                            zip_ref.extract(zip_info, folder_for_files)
                else:
                    # If there are folders, extract normally to the main extract_dir
                    zip_ref.extractall(extract_dir)

            # Path to the React-generated apps 
            react_app_dir = os.path.join(self.app_config['PATH'], self.project_name)

            # Ensure the React app directory exists
            if not os.path.exists(react_app_dir):
                os.makedirs(react_app_dir)
                
            # Copy the extracted folder to the React app directory
            if not contains_folder:
                destination_path = os.path.join(react_app_dir, folder_name)
                shutil.copytree(folder_for_files, destination_path)
            else:
                destination_path = os.path.join(react_app_dir, "extracted_zip_files")
                shutil.copytree(extract_dir, destination_path, dirs_exist_ok=True)  # Copy the full directory tree
            
            print(f"Extracted files to {extract_dir}")
            return {'message': 'Files extracted successfully.', 'extracted_to': extract_dir}
    
        except Exception as e:
            print(f"An error occurred while extracting the zip file: {str(e)}")
            return {'error': str(e)}

    def get_zip_files(self):
        try:
            # Directory where zip files are extracted
            extracted_dir = os.path.join(CONFIG_PATH, self.project_name, "extracted_zip_files")
        
            if not os.path.exists(extracted_dir):
                return {'folders': []}

            # List all folders in the extraction directory with their last modified times
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
        

    def delete_file(self, fileName):
        try:
            # Paths for extracted zip files and React app files
            extracted_dir = os.path.join(CONFIG_PATH, self.project_name, "extracted_zip_files")
            uploaded_file_path = os.path.join(extracted_dir, fileName)
            react_app_file_path = os.path.join(self.react_app_dir, "extracted_zip_files", fileName)
            customized_proj_config_path = os.path.join(CONFIG_PATH, self.project_name,"customized_proj_config",fileName)
            # Helper function to handle file/directory deletion
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

            # Delete from both locations
            delete_path(uploaded_file_path, "extracted_zip_files")
            delete_path(react_app_file_path, "React app")
            delete_path(customized_proj_config_path, "customized_proj_config")

        except Exception as e:
            print(f"Error deleting file or directory: {e}")
