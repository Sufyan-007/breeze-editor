
from utils.file_utils import get_dir_path_from_file, create_dir_if_not_exists



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

                create_dir_if_not_exists(file_path)

                with open(file_path, 'w') as file:
                    file.write(style_config['content'])


