import os
import shutil
from apps.common.constants.consts import CONFIG_FILES_PATH, CONFIG_PATH
from apps.common.utils.file_helpers.dir_handler import create_parent_dir_if_not_exists, create_dir_if_not_exists
from apps.common.utils.file_helpers.json_handler import read_project_config_file, write_json_file
from apps.directory_management.core.directory_management_service import DirectoryManager


def save_file(project_id, file_id, destination_path):
    # Full path to the source file
    file_path_full = os.path.join(CONFIG_PATH, project_id, 'uploaded_assets', file_id)
    
    # Create the parent directory for the destination if it doesn't exist
    create_parent_dir_if_not_exists(destination_path)
    
    # Use shutil.copy to copy the file
    shutil.copy(file_path_full, destination_path)


def update_config(project_id, file_name, description, file_id=None, parentFolderId = "IMAGES"):
    app_config_dir = f"{CONFIG_PATH}/{project_id}"

    resource_config_path = f"{app_config_dir}/{CONFIG_FILES_PATH['RESOURCE_CONFIG']}"
    # create_dir_if_not_exists(resource_config_path)

    existing_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['RESOURCE_CONFIG'])

    file_extension = file_name.split('.')[-1]
    file_type = file_extension.lstrip('.').lower()

    config_data = {
        file_id: {
            "name": file_name,
            "type": file_type,
            "description": description,
        }
    }

    existing_config.update(config_data)
    # existing_config[file_id] = config_data[file_id]
    
    directory_manager = DirectoryManager(project_name=project_id)
    newNode = directory_manager.add_node_to_config(
        parent_id=  parentFolderId,
        tag= "RESOURCE",
        name=file_name,
        node_type="FILE",
        file_id= file_id,
        entity_id=file_id,
        isProtected=False
    )

    # if newNode:
    #     image_path = directory_manager.get_path_from_file_id(file_id,relative_path=True)
    #     save_file(project_id, file_id, image_path)
    write_json_file(f"{resource_config_path}.json", existing_config)

    
    # update_directory_management( file_name, file_path, file_type)
    return config_data