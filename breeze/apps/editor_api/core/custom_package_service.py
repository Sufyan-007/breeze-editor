import os
import shutil
import zipfile
import json
from datetime import datetime, timezone
from common.utils.app_consts import CONFIG_PATH, GLOBAL_RESOURCES_PATH
from common.utils.file_helper import create_parent_dir_if_not_exists


def save_extracted_file(file, path):
    print(path)
    create_parent_dir_if_not_exists(os.path.dirname(path))

    with open(path, "wb") as destination:
        for chunk in file.chunks():
            destination.write(chunk)
        
class CustomPackageService:
    @staticmethod
    def read_config_file(path):
        if os.path.exists(path):
            with open(path, "r") as file:
                return json.load(file)
        return {}

    @staticmethod
    def write_config_file(path, data):
        with open(path, "w") as file:
            json.dump(data, file, indent=4)

    @staticmethod
    def upload_file(file, fileName, projectName):
        if projectName is not None:
            # Save the zip file to a temporary location
            temp_dir = os.path.join(CONFIG_PATH, projectName, "temp")
            create_parent_dir_if_not_exists(temp_dir)
            temp_zip_path = os.path.join(temp_dir, fileName)
            save_extracted_file(file, temp_zip_path)
            
            # After saving the file, extract its contents
            extract_result = CustomPackageService.extract_zip_file(projectName, temp_zip_path)
            if 'error' in extract_result:
                raise Exception(extract_result['error'])
            
            # Clean up: Remove the zip file after extraction
            os.remove(temp_zip_path)
            
            return extract_result  # Returning the result of extraction
        
        else:
            raise Exception('Project name is required to upload and extract files.')
    
    @staticmethod
    def extract_zip_file(projectName, zip_file_path):
        try:
            # Define extraction path
            extract_dir = os.path.join(CONFIG_PATH, projectName, "extracted_zip_files")
            
            # Ensure the extraction directory exists
            if not os.path.exists(extract_dir):
                os.makedirs(extract_dir)
                
            # Extract the contents of the zip file
            with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
                zip_ref.extractall(extract_dir)
                
            print(f"Extracted files to {extract_dir}")
            return {'message': 'Files extracted successfully.', 'extracted_to': extract_dir}
    
        except Exception as e:
            print(f"An error occurred while extracting the zip file: {str(e)}")
            return {'error': str(e)}
        
        
    
    def get_zip_files(projectName):
        try:
            # Directory where zip files are extracted
            extracted_dir = os.path.join(CONFIG_PATH, projectName, "extracted_zip_files")
        
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
        
    @staticmethod
    def delete_file(fileName, projectName):
        try:
            extracted_dir = os.path.join(CONFIG_PATH, projectName, "extracted_zip_files")
            uploaded_file_path = os.path.join(extracted_dir, fileName)

            # Log the paths and check if the path exists
            print(f"Trying to delete: {uploaded_file_path}")

            if os.path.exists(uploaded_file_path):
                if os.path.isfile(uploaded_file_path):
                    os.remove(uploaded_file_path)
                    print(f"File {fileName} deleted successfully.")
                elif os.path.isdir(uploaded_file_path):
                    shutil.rmtree(uploaded_file_path)
                    print(f"Directory {fileName} deleted successfully.")
                else:
                    print(f"{fileName} is neither a file nor a directory.")
            else:
                print(f"{fileName} not found at {uploaded_file_path}.")
                raise FileNotFoundError(f"{fileName} does not exist at {uploaded_file_path}.")
                
        except Exception as e:
            print("In exception")
            print(f"Error deleting file or directory: {e}")
