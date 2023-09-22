import os

def get_dir_path_from_file(file_path):
    return os.path.dirname(file_path)

def create_dir_if_not_exists(file_path):
    dir_path = get_dir_path_from_file(file_path)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)