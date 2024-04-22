import json
import os
from common.utils.app_consts import CONFIG_PATH
from ..helper_models.encoder import EnhancedJSONEncoder

class IntermediateModificationHelper:
    def __init__(self):
        self.folder_path = f"{CONFIG_PATH}/creator/generated_intermediate_json"

    def process_api_data(self, data, filename):
        modified_api = data.get("modified_api")
        file_path = os.path.join(self.folder_path, filename)
        is_auth_api = modified_api.get("is_authentication_api")
        if is_auth_api:
            return self.process_auth_api(modified_api, file_path)
        else:
            return self.process_regular_api(modified_api, file_path)

    def move_api_to_new_file(self, modified_api, new_file_path, existing_data, file_path, filename):
        if modified_api['id'] in existing_data:
            return f"API with UUID {modified_api['id']} already exists in {new_file_path}"

        existing_data[modified_api['id']] = modified_api
        with open(new_file_path, "w") as file:
            json.dump(existing_data, file, cls=EnhancedJSONEncoder)

        if os.path.exists(file_path):
            with open(file_path, "r") as file:
                existing_data = json.load(file)
            if modified_api['id'] in existing_data:
                del existing_data[modified_api['id']]
            with open(file_path, "w") as file:
                json.dump(existing_data, file, cls=EnhancedJSONEncoder)
        return f"API {modified_api['id']} moved to {new_file_path} and API {modified_api['id']} removed from {filename}"

    def process_auth_api(self, modified_api, file_path):
        new_file_path = os.path.join(self.folder_path, "auth.json")
        if os.path.exists(new_file_path):
            with open(new_file_path, "r") as file:
                existing_data = json.load(file)
        else:
            existing_data = {}

        return self.move_api_to_new_file(modified_api, new_file_path, existing_data, file_path, "auth.json")

    def process_regular_api(self, modified_api, file_path):
        tag = modified_api.get("tags", ["default"])[0]
        if os.path.exists(file_path):
            with open(file_path, "r") as file:
                existing_data = json.load(file)
            uuids = {api['id'] for api in existing_data.values()}
            if modified_api['id'] not in uuids:
                return f"UUID {modified_api['id']} does not exist in {file_path}."

            if tag != existing_data[modified_api["id"]].get('tags', [''])[0]:
                new_file_path = os.path.join(self.folder_path, f"{tag}Service.json")
                if os.path.exists(new_file_path):
                    with open(new_file_path, "r") as file:
                        existing_data = json.load(file)
                else:
                    existing_data = {}

                return self.move_api_to_new_file(modified_api, new_file_path, existing_data, file_path, f"{tag}Service.json")

        existing_data[modified_api['id']] = modified_api
        with open(file_path, "w") as file:
            json.dump(existing_data, file, cls=EnhancedJSONEncoder)
        return f"Modified API {modified_api['id']} written to {file_path}"
