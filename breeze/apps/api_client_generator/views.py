import os
import json
from .helper_models.encoder import EnhancedJSONEncoder
from .core.openapi_helper import OpenApiHelper
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
                api_models = converted_data.get("api_models")
                filename = converted_data.get("filename")

            elif collectionType.lower() == 'openapi' and (json_file.name.endswith('.yml') or json_file.name.endswith('.json')):
                converted_data= OpenApiHelper.open_api_helper(json_data)
                api_models = converted_data.get("api_models")
                filename = converted_data.get("filename")

            else:
                return JsonResponse({"error": "Invalid collection type or file format."}, status=400)

            full_file_path = os.path.join(folder_path, filename)
            with open(full_file_path, "w") as file:
                json.dump(api_models, file, cls=EnhancedJSONEncoder)
            
            serialized_data = json.loads(json.dumps(api_models, cls=EnhancedJSONEncoder))
            return JsonResponse({"data":serialized_data,"filename":filename},safe=False, status=201)
            
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)