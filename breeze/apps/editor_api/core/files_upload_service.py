import os
import uuid
import json
from common.utils.app_consts import CONFIG_PATH, GLOBAL_RESOURCES_PATH
from common.utils.file_helper import create_parent_dir_if_not_exists

def save_file(file, path):
    print(path)
    create_parent_dir_if_not_exists(os.path.dirname(path))

    with open(path, 'wb') as destination:
        for chunk in file.chunks():
            destination.write(chunk)

class FileService:
    @staticmethod
    def read_config_file(path):
        if os.path.exists(path):
            with open(path, 'r') as file:
                return json.load(file)
        return {}

    @staticmethod
    def write_config_file(path, data):
        with open(path, 'w') as file:
            json.dump(data, file, indent=4)

    @staticmethod
    def upload_file(file, projectName):
        file_id = str(uuid.uuid4())
        file_path_full = os.path.join(GLOBAL_RESOURCES_PATH, file_id)

        if projectName is not None:
            assets_upload_dir = os.path.join(CONFIG_PATH, projectName,'uploaded_assets')
            create_parent_dir_if_not_exists(assets_upload_dir)
            file_path_full = os.path.join(assets_upload_dir, file_id)
            save_file(file, file_path_full)
        else:
            save_file(file, file_path_full)
            return
        
        return file_id

    @staticmethod
    def delete_file(file_id, projectName):
        try:
            if projectName is not None:
                assets_upload_dir = os.path.join(CONFIG_PATH, projectName,'uploaded_assets')
                uploaded_file_path = os.path.join(assets_upload_dir, file_id)
                print(f"Attempting to delete file: {uploaded_file_path}")

                if os.path.exists(uploaded_file_path):
                    os.remove(uploaded_file_path)

                uploaded_file_path = os.path.join(GLOBAL_RESOURCES_PATH, file_id)
                if os.path.exists(uploaded_file_path):
                    os.remove(uploaded_file_path)
        except Exception as e:
            print(f"Error deleting file: {e}")
