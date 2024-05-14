import os
import json
from django.http import JsonResponse
from django.views import View
from common.utils.app_consts import CONFIG_PATH
from ..utils.append_dict_file import append_to_dict_file
from ..utils.api_model_loader import ApiModelLoader

class TransferToAuthApi(View):
    def post(self, request, project_name):
        data = json.loads(request.body.decode("utf-8"))
        filename = data.get("filename")
        id_value = data.get("id")
        authentication_type = data.get("authentication_type")
        
        if not filename or not id_value:
            return JsonResponse({"error": "Invalid data provided."}, status=400)
        
        file_path = os.path.join(f"{CONFIG_PATH}/{project_name}/generated_intermediate_json", f"{filename}.json")
        
        if not os.path.exists(file_path):
            return JsonResponse({"error": "File not found."}, status=404)
        
        with open(file_path, 'r+') as file:
            file_data = json.load(file)
            api_info = file_data.get(id_value)
            
            if not api_info:
                return JsonResponse({"error": "API ID not found."}, status=404)
            
            api_info["authentication_type"] = authentication_type
            model = ApiModelLoader.load_auth_api_model(api_info)
            model_json = model.as_dict()
            
            auth_file_path = os.path.join(f"{CONFIG_PATH}/{project_name}/generated_intermediate_json", "auth.json")
            append_to_dict_file(auth_file_path, {model_json["id"]: model_json})
            
            del file_data[id_value]
            append_to_dict_file(file_path, file_data, False)
            
            return JsonResponse({"message": "Data transferred successfully."}, status=201)
