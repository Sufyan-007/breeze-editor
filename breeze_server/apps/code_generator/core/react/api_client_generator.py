
import json
import subprocess
import os
from apps.common.utils.path_extractor import get_path_without_ext
import yaml
from apps.common.utils import react_request_code
from apps.common.utils.file_helpers.dir_handler import create_parent_dir_if_not_exists, get_dir_path_from_file
from apps.common.constants.consts import NEW_LINE_CHAR
from apps.common.utils.formatter import format_val

def remove_circular_refs(ob, _seen=None):
    if _seen is None:
        _seen = set()

    if id(ob) in _seen:
        return None
    _seen.add(id(ob))

    res = ob

    if isinstance(ob, dict):
        res = {
            remove_circular_refs(key, _seen): remove_circular_refs(value, _seen)
            for key, value in ob.items()}

    elif isinstance(ob, (list, tuple, set, frozenset)):
        res = type(ob)(remove_circular_refs(v, _seen) for v in ob)

    _seen.remove(id(ob))
    return res

    