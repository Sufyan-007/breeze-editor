from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
from common.utils.config_reader import read_config_file, read_file_json, write_file
import tinycss2
import json
from .app_editor import AppEditor
import os


class StylesConfigService:
    def __init__(self, projectId):
        self.projectId = projectId
        self.app_config_dir = f"{CONFIG_PATH}/{projectId}"
        self.app_config = read_config_file(
            self.app_config_dir, CONFIG_FILES_PATH["APP_CONFIG"]
        )
        self.css_config = read_config_file(
            self.app_config_dir, CONFIG_FILES_PATH["CSS_CONFIG"]
        )
        self.app_config["APP_SOURCE_DIR"] = (
            f"{self.app_config['path']}/{self.app_config['name']}/{self.app_config['components_src_dir']}"
        )

    def extract_class_names(rules):
        class_names = set()
        for rule in rules:
            if rule.type == "qualified-rule":
                prelude = "".join(token.serialize() for token in rule.prelude)
                selectors = prelude.split(",")
                for selector in selectors:
                    if "." in selector:
                        classes = [
                            part.split(".")[1]
                            for part in selector.split()
                            if "." in part
                        ]
                        class_names.update(classes)
        return class_names

    def save_style(self, data):
        required_fields = ["css_name", "css_content", "css_filename"]
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            raise ValueError(f"Missing fields: {', '.join(missing_fields)}")

        css_name = data["css_name"]
        is_update = css_name in self.css_config
        if css_name in self.css_config:
            filePath = os.path.join(
                self.app_config["APP_SOURCE_DIR"],
                self.css_config[css_name]["file_path"],
                self.css_config[css_name]["css_filename"] + ".css",
            )
            os.remove(filePath)
        self.css_config[css_name] = {
            "css_filename": data.get("css_filename", css_name),
            "file_path": data.get("file_path", "styles"),
            "css_content": data.get("css_content", ""),
            "description": data.get("description", ""),
        }

        rules = tinycss2.parse_stylesheet(data["css_content"], skip_whitespace=True)
        class_names = StylesConfigService.extract_class_names(rules)

        css_config_path = f"{self.app_config_dir}/{CONFIG_FILES_PATH['CSS_CONFIG']}"
        write_file(f"{css_config_path}.json", json.dumps(self.css_config))

        appEditor = AppEditor(self.projectId)
        appEditor.write_style_files()

        action = "updated" if is_update else "added"
        return f"CSS '{css_name}' {action} successfully."

    def get_styles(self, css_name=None):
        if css_name:
            if css_name not in self.css_config:
                return ValueError(f"CSS with name '{css_name}' does not exist.")
            return self.css_config[css_name]
        return self.css_config

    def delete_styles(self, css_name):
        if css_name not in self.css_config:
            return ValueError(f"CSS with name '{css_name}' does not exist.")

        filePath = os.path.join(
            self.app_config["APP_SOURCE_DIR"],
            self.css_config[css_name]["file_path"],
            self.css_config[css_name]["css_filename"] + ".css",
        )
        os.remove(filePath)
        del self.css_config[css_name]
        css_config_path = f"{self.app_config_dir}/{CONFIG_FILES_PATH['CSS_CONFIG']}"
        write_file(f"{css_config_path}.json", json.dumps(self.css_config))

        appEditor = AppEditor(self.projectId)
        appEditor.write_style_files()
        return f"CSS '{css_name}' deleted successfully."
