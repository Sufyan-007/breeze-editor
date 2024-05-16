from django.http import JsonResponse
import json, os
from django.views import View
from common.utils.app_consts import CONFIG_PATH
class RetrieveAuthFile(View):
    def get(self, request, projectName,apiId):
        try:
            file_path = f"{CONFIG_PATH}/{projectName}/generated_intermediate_json/auth.json"
            # api_id = request.GET.get('api_id', None)
            api_id = apiId
            print(api_id, "apiid")
            if not os.path.exists(file_path):
                return JsonResponse({"error": "File not found"}, status=404)

            result = {}
            with open(file_path, "r") as file:
                file_content = file.read()
                if not file_content.strip():
                    return JsonResponse({"data": []}, status=200)
                result = None
                auth_apis = json.loads(file_content)
                if api_id == 'null':
                    result = []
                    for api in auth_apis.keys():
                        result.append({
                            "id" : api,
                            "operation_id" : auth_apis[api].get("operation_id"),
                            "auth_api_type":auth_apis[api].get("auth_api_type")
                        })
                else:
                    result = auth_apis.get(api_id)
                    
            return JsonResponse({"data": result}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)