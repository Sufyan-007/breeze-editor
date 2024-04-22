import os
import json
from .utils.jsonencoder import EnhancedJSONEncoder
from .utils.append_dict_file import append_to_dict_file

from .core.openapi_swagger_converter import OpenapiConverter
from .core.postman_collection_converter import PostmanCollectionConverter
from common.utils.app_consts import CONFIG_PATH
from django.views import View
from django.http import JsonResponse

class ApiClientGenerator(View):

    def post(self, request, collectionType):
        project_name = "creator"
        folder_path = f"{CONFIG_PATH}/{project_name}/generated_intermediate_json"
        filename = ''
        try:
            json_file = request.FILES['file']
            json_data = json_file.read().decode("utf-8")

            if collectionType.lower() == 'postman' and json_file.name.endswith('.json'):
                converted_data = PostmanCollectionConverter.prepare_api_models(json_data)
                api_models = converted_data.get("api_models",[])
                filename = converted_data.get("filename","")+".json"
                model_dict = {}
                for model in api_models:
                    model_dict[model.id] = model.as_dict()
                full_file_path = os.path.join(folder_path, filename)
                append_to_dict_file(full_file_path,model_dict)
                
                return JsonResponse({"data": model_dict, "filename": filename}, status=201)

            elif collectionType.lower() == 'openapi' and (json_file.name.endswith('.yml') or json_file.name.endswith('.yaml') or json_file.name.endswith('.json')):
                converted_data = OpenapiConverter.prepare_api_models(json_data)
                
                ## for auth.json
                security_schemes_models = converted_data.get("security_schemes_models")
                auth_file = "auth.json"
                auth_model_dict = {}
                for model in security_schemes_models:
                    auth_model_dict[model.id] = model.as_dict()    
                full_auth_file_path = os.path.join(folder_path, auth_file)
                append_to_dict_file(full_auth_file_path,auth_model_dict)
                
                ## for other models
                tag_models = converted_data.get("tag_models")
                resultant_filename = []
                for tag, api_models in tag_models.items():
                    filename = tag+".json"
                    full_file_path = os.path.join(folder_path, filename)
                    resultant_filename.append(filename)
                    model_dict = {}
                    for model in api_models:
                        model_dict[model.id] = model.as_dict()
                    append_to_dict_file(full_file_path,model_dict)
                return JsonResponse({"data": model_dict, "filename": resultant_filename}, status=201)
            else:
                return JsonResponse({"error": "Invalid collection type or file format."}, status=400)

        except Exception as e:
            print(traceback.format_exc())
            return JsonResponse({"error": str(e)}, status=400)
        
        
    
    def get(self, request, projectName,files_only):
        folder_path = f"{CONFIG_PATH}/{projectName}/generated_intermediate_json"
        files_with_apis = []

        try:
            # Get list of files in the folder
            files = os.listdir(folder_path)
            if files_only and files_only == 'true':
                return JsonResponse({"files":  files}, status=200)
            
            for filename in files:
                full_file_path = os.path.join(folder_path, filename)

                # Read the file
                with open(full_file_path, "r") as file:
                    api_models = json.load(file)
                    api_models = list(api_models.values())

                # Append file name and APIs to the list
                files_with_apis.append({
                    "filename": filename,
                    "apis": api_models
                })

            return JsonResponse({"files_with_apis": files_with_apis}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)