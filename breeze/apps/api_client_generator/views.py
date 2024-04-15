import os
import json
from .helper_models.encoder import EnhancedJSONEncoder
from .core.openapi_helper import OpenApiHelper
from .core.helpers.append_dict_file import append_to_dict_file
from .core.postman_helper import PostmanHelper
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
                converted_data = PostmanHelper.postman_helper(json_data)
                api_models = converted_data.get("api_models",[])
                filename = converted_data.get("filename")
                model_dict = {}
                for model in api_models:
                    model_dict[model.id] = model
                full_file_path = os.path.join(folder_path, filename)
                append_to_dict_file(full_file_path,model_dict)
                serialized_data = json.loads(json.dumps(model_dict, cls=EnhancedJSONEncoder))
                return JsonResponse({"data": serialized_data, "filename": filename}, status=201)

            elif collectionType.lower() == 'openapi' and (json_file.name.endswith('.yml') or json_file.name.endswith('.yaml') or json_file.name.endswith('.json')):
                converted_data = OpenApiHelper.open_api_helper(json_data)
                resultant_filename = []
                resultant_api_models = {}
                for filename, api_models in converted_data.items():
                    full_file_path = os.path.join(folder_path, filename)
                    resultant_filename.append(filename)
                    model_dict = {}
                    for model in api_models:
                        model_dict[model.id] = model
                    serialized_data = json.loads(json.dumps(model_dict, cls=EnhancedJSONEncoder))
                    for key,value in serialized_data.items():
                        resultant_api_models[key] = value
                    append_to_dict_file(full_file_path,model_dict)
                return JsonResponse({"data": resultant_api_models, "filename": resultant_filename}, status=201)
            else:
                return JsonResponse({"error": "Invalid collection type or file format."}, status=400)

        except Exception as e:
            import traceback
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