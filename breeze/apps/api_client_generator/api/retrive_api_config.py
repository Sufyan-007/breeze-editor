from django.http import JsonResponse
import json, os
from django.views import View
from common.utils.app_consts import CONFIG_PATH
class RetrieveApiConfig(View):
    
    def get(self, request, projectName,filename, apiId):
        try:
            file_path = f"{CONFIG_PATH}/{projectName}/generated_intermediate_json/{filename}.json"
            # api_id = request.GET.get('api_id', None)
            api_id = apiId
            if not os.path.exists(file_path):
                return JsonResponse({"error": "File not found"}, status=404)

            result = {}
            with open(file_path, "r") as file:
                file_content = file.read()
                if not file_content.strip():
                    return JsonResponse({"data": []}, status=200)
                result = None
                apis = json.loads(file_content)
                if api_id is not None:
                    result = apis.get(api_id)
                else:
                    result = []
                
            return JsonResponse({"data": result}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)