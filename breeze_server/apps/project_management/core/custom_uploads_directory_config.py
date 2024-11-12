import os
import uuid
import json
import zipfile
import shutil

def generate_unique_id():
    return str(uuid.uuid4())


def create_json_structure(directory_manager, folder_path,file_id, parent_id=None, tag='ROOT'):
    folder_name = os.path.basename(folder_path)
       # Add the current folder node to the directory management
    folder_node = directory_manager.add_node_to_config(
        parent_id=parent_id, 
        tag=tag, 
        name=folder_name, 
        node_type="DIRECTORY",
        file_id=file_id
    )
    folder_id = folder_node['id']

    # Loop through all items in the directory
    folder_contents = os.listdir(folder_path)
    if not folder_contents:
        print(f"Folder '{folder_name}' is empty.")
    
    for item in folder_contents:
        item_file_id = str(uuid.uuid4())
        item_path = os.path.join(folder_path, item)
         
        if os.path.isdir(item_path):
            # Recursively add subdirectories
            create_json_structure(directory_manager, item_path,item_file_id, parent_id=folder_id, tag="ZIP")
        else:
            # Create a file entry in the directory management config
            directory_manager.add_node_to_config(
                parent_id=folder_id, 
                tag="ZIP", 
                name=item, 
                node_type="FILE"
            )
    
    return folder_node


def save_json_to_file(json_data, output_path):
    with open(output_path, 'w') as json_file:
        json.dump(json_data, json_file, indent=4)
    print(f"JSON config saved to {output_path}")
        