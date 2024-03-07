

class DependencyManager:
    def __init__(self):
        pass

    def handle_bootstrap(self, app_config):
        import_line = "import 'bootstrap/dist/css/bootstrap.css';"
        
        with open(f"{app_config['path']}/{app_config['name']}/src/index.js", "r+") as component_file:
            print(component_file)
            file_code = component_file.read()

            if import_line not in file_code:
                component_file.seek(0,0)
                component_file.write(import_line + '\n' + file_code)
            # formatted_code = formatter.format_by_prettier(react_code)
            # component_file.write(formatted_code)  