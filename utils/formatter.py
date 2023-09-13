import subprocess

def format_by_prettier(text):
    formatted_code = subprocess.check_output(['npx', 'prettier', '--parser', 'babel'], input=text, text=True)
    return formatted_code
