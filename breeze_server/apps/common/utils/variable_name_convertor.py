import re

def convert_to_valid_variable_name(s):
    s = re.sub(r'^[0-9]', r'_\g<0>', s)
    
    s = re.sub(r'[^a-zA-Z0-9_]', '_', s)
    
    s = re.sub(r'-', '_', s)
    
    s = re.sub(r'_(.)', lambda m: m.group(1).upper(), s)  
    s = s[0].lower() + s[1:]  
    
    return s

