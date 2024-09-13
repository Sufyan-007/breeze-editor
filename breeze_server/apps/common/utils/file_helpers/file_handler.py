import os

def get_filename_without_ext(file_path):
    return os.path.splitext(os.path.basename(file_path))[0]
