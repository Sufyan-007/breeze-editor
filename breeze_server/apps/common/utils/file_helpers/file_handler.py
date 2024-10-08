import os
import uuid
from apps.common.constants.consts import GLOBAL_RESOURCES_PATH
from apps.common.constants.consts import CONFIG_PATH
from .dir_handler import create_parent_dir_if_not_exists,create_dir_if_not_exists 

def get_filename_without_ext(file_path):
    return os.path.splitext(os.path.basename(file_path))[0]

def save_file(file, path):
    print(path)
    create_parent_dir_if_not_exists(path)

    with open(path, "wb") as destination:
        for chunk in file.chunks():
            destination.write(chunk)
            
def upload_file(file, projectName=None):
    file_id = str(uuid.uuid4())
    file_path_full = os.path.join(GLOBAL_RESOURCES_PATH, file_id)

    if projectName is not None:
        assets_upload_dir = os.path.join(
            CONFIG_PATH, projectName, "uploaded_assets"
        )
        create_dir_if_not_exists(assets_upload_dir)
        file_path_full = os.path.join(assets_upload_dir, file_id)
        save_file(file, file_path_full)
    else:
        save_file(file, file_path_full)
        
    return file_id

def delete_file(file_id, projectName):
    try:
        if projectName is not None:
            assets_upload_dir = os.path.join(
                CONFIG_PATH, projectName, "uploaded_assets"
            )
            uploaded_file_path = os.path.join(assets_upload_dir, file_id)

            if os.path.exists(uploaded_file_path):
                os.remove(uploaded_file_path)

            uploaded_file_path = os.path.join(GLOBAL_RESOURCES_PATH, file_id)
            if os.path.exists(uploaded_file_path):
                os.remove(uploaded_file_path)
    except Exception as e:
        print(f"Error deleting file: {e}")

def download_file(file_id, project_name):
    try:
        if project_name:
            assets_upload_dir = os.path.join(
                CONFIG_PATH, project_name, "uploaded_assets"
            )
            uploaded_file_path = os.path.join(assets_upload_dir, file_id)
        else:
            uploaded_file_path = os.path.join(GLOBAL_RESOURCES_PATH, file_id)

        if os.path.exists(uploaded_file_path):
            return uploaded_file_path
        else:
            return None
    except Exception as e:
        print(f"Error downloading file: {e}")
        return None
