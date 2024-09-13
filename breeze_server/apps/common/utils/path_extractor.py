import os

def get_path_without_ext(file_path):
    return os.path.splitext(file_path)[0]


