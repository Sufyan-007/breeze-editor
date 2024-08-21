import os
from pathlib import Path

def get_path_without_ext(file_path):
    return os.path.splitext(file_path)[0]


def find_parent_dir(current_path, target_dir):
    current_path = Path(current_path).resolve()
    for parent in current_path.parents:
        if (parent / target_dir).is_dir():
            return parent / target_dir
    raise FileNotFoundError(f"Directory '{target_dir}' not found in any parent directory.")

