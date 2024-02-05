import os

def get_dir_path_from_file(file_path):
    return os.path.dirname(file_path)

def create_parent_dir_if_not_exists(full_path, is_dir = False):
    dir_path = get_dir_path_from_file(full_path)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)

def is_dir_exists(dir_path):
    return os.path.isdir(dir_path)

def get_filename_without_ext(file_path):
    return os.path.splitext(os.path.basename(file_path))[0]
