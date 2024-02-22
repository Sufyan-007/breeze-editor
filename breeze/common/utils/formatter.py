import subprocess
import json

def format_by_prettier(text):
    formatted_code = subprocess.check_output(['npx', 'prettier', '--parser', 'babel'], input=text, text=True)
    return formatted_code


def format_val(val):
    print("----", val, "-----")
    if isinstance(val, str):
        return '"' + val + '"'
    if isinstance(val, bool):
        return json.dumps(val)
    return val

def format_raw_val(val):
    print("----", val, "-----")
    if isinstance(val, str):
        return val
    else:
        return json.dumps(val)
    