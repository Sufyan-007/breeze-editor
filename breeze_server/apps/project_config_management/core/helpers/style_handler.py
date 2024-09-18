from common.utils.file_utils import (
    get_dir_path_from_file,
    create_parent_dir_if_not_exists,
    create_dir_if_not_exists,
)
from ....directory_management.core.directory_management_service import DirectoryManagementGenerator
import os


# ToDO

# Css files can also import another css files 

class StyleHandler:
    def __init__(self):
        pass


    @staticmethod
    def generate_style_code(app_config):
        print("CCC")
        styles = app_config['CSS_CONFIG']

        for style in styles:
            style_config = styles[style]
            print(style_config)
            if style_config.get('type') == "CSS":
                print('CSS TYPE')
                file_path = f"{app_config['APP_SOURCE_DIR']}/{style_config['containingFile']}"

                create_parent_dir_if_not_exists(file_path)

                with open(file_path, 'w') as file:
                    file.write(style_config['content'])
                    
    @staticmethod
    def generate_styles_code(app_config, directory_management_config):
        styles = app_config["CSS_CONFIG"]
        import_statements = ""

        for style_id, style_config in styles.items():
            file_id = style_config['file_id']
            directory_config = directory_management_config[file_id]
            if not directory_config:
                raise ValueError("Style file not present in directory management")

            # Fetching file path from lineage and file name from name
            # lineage = directory_config.get("lineage", [])
            # file_path = os.path.join(*[element.lower() for element in lineage]) if lineage else ""
            directory_management_service = DirectoryManagementGenerator(app_config["name"])
            file_path = directory_management_service.get_path_from_file_id(file_id)
            file_name = directory_config.get("name", style_id)

            # dir_path = os.path.join(app_config["APP_SOURCE_DIR"], file_path)
            # create_dir_if_not_exists(dir_path)
            # css_filename = file_name if file_name.endswith(".css") else file_name + ".css"
            # full_file_path = os.path.join(dir_path, css_filename)

            with open(file_path, "w") as file:
                if style_config.get("description"):
                    file.write(f"/* {style_config['description']} */\n")
                file.write(style_config["css_content"])
                print(f"Generated {file_path} with content from {style_id}")

            import_statement = f"import './styles/{file_name}';\n"
            import_statements += import_statement

        directory_management_service = DirectoryManagementGenerator(app_config["name"])
        styles_js_path = directory_management_service.get_path_from_file_id('ALL_STYLES_FILE')
        with open(styles_js_path, "w") as styles_js_file:
            styles_js_file.write(import_statements)
            print(f"Added import statement to {styles_js_path}")
