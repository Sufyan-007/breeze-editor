import re

def convert_to_valid_variable_name(s):
    # Prepend underscore if the string starts with a number
    s = re.sub(r'^[0-9]', r'_\g<0>', s)
    # Replace any invalid characters (non-alphanumeric or underscore) with an underscore
    s = re.sub(r'[^a-zA-Z0-9_]', '_', s)
    return s

