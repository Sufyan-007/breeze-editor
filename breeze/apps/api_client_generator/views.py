from django.views import View
from django.http import JsonResponse
import json
from .helper_models.base_models.api_model import ApiModel
from .helper_models.encoder import EnhancedJSONEncoder

import os
import json
from .core.intermediate_convertor import IntermediateConversion
from common.utils.app_consts import CONFIG_PATH


class ApiClientGenerator(View):

    def post(self, request):
        project_name = "creator"
        folder_path = f"{CONFIG_PATH}/{project_name}/generated_intermediate_json"
        
        try:
            json_file = request.FILES['file']
            json_data = json_file.read().decode("utf-8")
            data = json.loads(json_data)
            filename = f"{data.get('info').get('name')}.json"
            intermediate = IntermediateConversion()
            api_models = []
            for item in data.get("item", []):
                request_data = item.get("request", {})
                response_data = item.get("response", {})
                request_obj_by_intermediate = intermediate.create_request(request_data=request_data)
                response_obj_by_intermediate = intermediate.create_response(response_data=response_data)
                api_model = ApiModel(
                    item.get("name"),
                    [],  # Tags remaining
                    request_obj_by_intermediate,
                    response_obj_by_intermediate,
                    "",  # Summary later
                )
                api_models.append(api_model)
                
            result = json.dumps(api_models, cls=EnhancedJSONEncoder)
            print(result,"result")
            full_file_path = os.path.join(folder_path, filename)
            try:
                with open(full_file_path, "w") as file:
                    file.write(result)
                return JsonResponse({}, status=201)  
            except Exception as e:
                print(f"Error writing file: {e}")
                return JsonResponse({"error": str(e)}, status=400)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        
        