import os
import uuid
from apps.common.constants.consts import CONFIG_PATH
from .dir_handler import create_parent_dir_if_not_exists 
from apps.directory_management.core.directory_management_service import DirectoryManager

def get_filename_without_ext(file_path):
    return os.path.splitext(os.path.basename(file_path))[0]

def save_file(file, path):
    print(path)
    create_parent_dir_if_not_exists(path)

    with open(path, "wb") as destination:
        for chunk in file.chunks():
            destination.write(chunk)
            
def upload_file(projectId, file):
    file_id = str(uuid.uuid4())
    assets_upload_dir = os.path.join(CONFIG_PATH, projectId, "uploaded_assets")
    create_parent_dir_if_not_exists(assets_upload_dir)
    file_path_full = os.path.join(assets_upload_dir, file_id)
    save_file(file, file_path_full)

    return file_id

def delete_file(projectId, file_id):
    try:
        if projectId is not None:
            assets_upload_dir = os.path.join(CONFIG_PATH, projectId, "uploaded_assets")
            uploaded_file_path = os.path.join(assets_upload_dir, file_id)

            if os.path.exists(uploaded_file_path):
                os.remove(uploaded_file_path)
    except Exception as e:
        print(f"Error deleting file: {e}")


def get_file_path(projectId, file_id):
    try:
        assets_upload_dir = os.path.join(CONFIG_PATH, projectId, "uploaded_assets")
        uploaded_file_path = os.path.join(assets_upload_dir, file_id)

        if os.path.exists(uploaded_file_path):
            return uploaded_file_path
        else:
            return None
    except Exception as e:
        print(f"Error downloading file: {e}")
        return None

def empty_file_upload(file_name, parentFolderId, project_id):
    content = "// New File"
    file_name = file_name or "untitled.txt"
    file_id = str(uuid.uuid4())
    directory_manager = DirectoryManager(project_name=project_id)

    if not parentFolderId:
        return {"message": "Parent folder ID is missing or invalid."}, 400

    new_node = directory_manager.add_node_to_config(
        parent_id=parentFolderId,
        tag="CUSTOM",
        name=file_name,
        node_type="FILE",
        file_id=file_id,
        entity_id=file_id,
        isProtected=False
    )
    directory_manager.save_file(file_id, content, formatted=False)
    return {"message": "Empty file created successfully", "node": new_node}, 201

   