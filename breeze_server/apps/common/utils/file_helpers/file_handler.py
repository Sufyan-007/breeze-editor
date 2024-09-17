import os
import uuid
from apps.common.consts import GLOBAL_RESOURCES_PATH
from apps.common.device_spec_consts import CONFIG_PATH
from .dir_handler import create_parent_dir_if_not_exists 

def get_filename_without_ext(file_path):
    return os.path.splitext(os.path.basename(file_path))[0]

def save_file(file, path):
    print(path)
    create_parent_dir_if_not_exists(os.path.dirname(path))

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
            create_parent_dir_if_not_exists(assets_upload_dir)
            file_path_full = os.path.join(assets_upload_dir, file_id)
            save_file(file, file_path_full)
        else:
            save_file(file, file_path_full)
            
        return file_id
