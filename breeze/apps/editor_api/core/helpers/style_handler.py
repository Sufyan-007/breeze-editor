from common.utils.file_utils import (
    get_dir_path_from_file,
    create_parent_dir_if_not_exists,
    create_dir_if_not_exists,
)
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
    def generate_styles_code(app_config):
        styles = app_config["CSS_CONFIG"]
        import_statements=""
        for style_name, style_config in styles.items():
            if style_config.get("file_path", "styles") and style_config.get("css_content", ""):
                dir_path = os.path.join(app_config["APP_SOURCE_DIR"], style_config["file_path"])
                create_dir_if_not_exists(dir_path)
                css_filename = style_config.get("css_filename", style_name) + ".css"
                file_path = os.path.join(dir_path, css_filename)

                with open(file_path, "w") as file:
                    if style_config.get("description"):
                        file.write(f"/* {style_config['description']} */\n")
                    file.write(style_config["css_content"])
                    print(f"Generated {file_path} with content from {style_name}")

                import_statement = f"import './{style_config['file_path']}/{css_filename}';\n"
                import_statements+=import_statement
                
        styles_js_path = os.path.join(app_config["APP_SOURCE_DIR"], "styles.js")
        with open(styles_js_path, "w") as styles_js_file:
            styles_js_file.write(import_statements)
            print(f"Added import statement to {styles_js_path}")