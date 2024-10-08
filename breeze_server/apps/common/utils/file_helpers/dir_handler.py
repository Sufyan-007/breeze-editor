import os
from pathlib import Path

def get_dir_path_from_file(file_path):
    return os.path.dirname(file_path)

def create_parent_dir_if_not_exists(dir_path):
    dir_path = os.path.dirname(dir_path)
    if not os.path.exists(dir_path):
        Path(dir_path).mkdir(parents=True)
        
def create_dir_if_not_exists(full_path):
    if not os.path.exists(full_path):
        os.makedirs(full_path)

def does_dir_exists(dir_path):
    return os.path.isdir(dir_path)


def find_parent_dir(current_path, target_dir):
    current_path = Path(current_path).resolve()
    for parent in current_path.parents:
        if (parent / target_dir).is_dir():
            return parent / target_dir
    raise FileNotFoundError(f"Directory '{target_dir}' not found in any parent directory.")

