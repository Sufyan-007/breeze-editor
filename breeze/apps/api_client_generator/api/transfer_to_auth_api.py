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
        # authentication_type = data.get("authentication_type")
        module_id = data.get("module_id")
        auth_api_template = {
            "id": '',
            "operation_id":'',
            "tags": "",
            "auth_api_type":'NONE',
            "authentication_type": 'NOAUTH',
            "access_token_request":{ "method": "POST","auth": [],"headers": [],"parameters": [],"url": {},"body": []},
            "refresh_token_request" : { "method": "POST","auth": [],"headers": [],"parameters": [],"url": {},"body": []},
            "access_token_response":[],
            "refresh_token_response":[],
            "summary":'',
            "token_store":{},
            "errors":{},
            "is_authentication_api": True
        }
        
        if not filename or not id_value:
            return JsonResponse({"error": "Invalid data provided."}, status=400)
        
        file_path = os.path.join(f"{CONFIG_PATH}/{project_name}/api_client_intermediate_json/{module_id}", f"{filename}.json")
        target_file_path = f"{CONFIG_PATH}/{project_name}/swagger_metadata.json"
        
        with open(target_file_path, "r") as file:
            swagger_content = json.load(file)
            
        current_auth_apis = swagger_content.get(module_id).get("auth_apis", {})
        
        if not os.path.exists(file_path):
            return JsonResponse({"error": "File not found."}, status=404)
        
        with open(file_path, 'r+') as file:
            file_data = json.load(file)
            api_info = file_data.get(id_value)
            
            if not api_info:
                return JsonResponse({"error": "API ID not found."}, status=404)
            
            auth_api_template["id"] = api_info["id"]
            auth_api_template["operation_id"] = api_info["operation_id"]
            auth_api_template["access_token_request"] = api_info["request"]
            auth_api_template["access_token_response"] = api_info["response"]
            auth_api_template["summary"] = api_info["summary"]
            
            # api_info["authentication_type"] = authentication_type
            
            
            model = ApiModelLoader.load_auth_api_model(auth_api_template)
            model_json = model.as_dict()
            
            # auth_file_path = os.path.join(f"{CONFIG_PATH}/{project_name}/generated_intermediate_json", "auth.json")
            # append_to_dict_file(auth_file_path, {model_json["id"]: model_json})
            current_auth_apis[model_json["id"]] = model_json
            swagger_content[module_id]["auth_apis"] = current_auth_apis
            append_to_dict_file(target_file_path, swagger_content)
            del file_data[id_value]
            append_to_dict_file(file_path, file_data, False)
            
            return JsonResponse({"message": "Data transferred successfully."}, status=201)
