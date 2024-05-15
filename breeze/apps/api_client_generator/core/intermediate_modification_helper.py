import json,os,traceback
from common.utils.app_consts import CONFIG_PATH
from ..utils.api_model_loader import ApiModelLoader
from ..utils.append_dict_file import append_to_dict_file

class IntermediateModificationHelper:
    def __init__(self, project_name):
        self.project_name = project_name
        self.folder_path = f"{CONFIG_PATH}/{project_name}/generated_intermediate_json"

    def process_api_data(self, modified_api, filename):
        file_path = os.path.join(self.folder_path, filename)
        try:
            api_model = ApiModelLoader.load_api_model(modified_api)
            api_model_dict = api_model.as_dict()
            resultant_model =  {api_model_dict["id"] : api_model_dict}
            tag = modified_api.get("tags", "default")
            if os.path.exists(file_path):
                with open(file_path, "r") as file:
                    existing_data = json.load(file)
                if modified_api["id"] in existing_data:
                    if tag != existing_data[modified_api["id"]].get('tags', 'default'):
                        new_file_path = os.path.join(self.folder_path, f"{tag}.json")
                        append_to_dict_file(new_file_path, resultant_model)
                        if modified_api['id'] in existing_data:
                            del existing_data[modified_api['id']]
                            print(existing_data, "existing data")
                            append_to_dict_file(file_path, existing_data, False)
                    else:
                        append_to_dict_file(file_path, resultant_model)
                else:
                    append_to_dict_file(file_path, resultant_model)
            else:
                append_to_dict_file(file_path, resultant_model)
        except Exception as e:
            print(traceback.format_exc())
            return {"error": str(e)}