import os
import json
from django.http import JsonResponse
from django.views import View
from common.utils.app_consts import CONFIG_PATH
from ..utils.append_dict_file import append_to_dict_file
class TransferToAuthApi(View):
    def post(self, request, project_name):
        data = json.loads(request.body.decode("utf-8"))
        for filename, id_list in data.items():
            file_path = os.path.join(f"{CONFIG_PATH}/{project_name}/generated_intermediate_json", f"{filename}.json")
            with open(file_path, 'r+') as file:
                file_data = json.load(file)
                api_data = {api["id"]: api for api in file_data.values() if api['id'] in id_list}
                append_to_dict_file(f"{CONFIG_PATH}/{project_name}/generated_intermediate_json/auth.json", api_data)
                file_data = {api["id"]: api for api in file_data.values() if api['id'] not in id_list}
                append_to_dict_file(file_path, file_data, False)
        return JsonResponse({"message": "Data transferred successfully."}, status=201)
