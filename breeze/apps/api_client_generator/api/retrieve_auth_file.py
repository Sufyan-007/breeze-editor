from django.http import JsonResponse
import json, os
from django.views import View
from common.utils.app_consts import CONFIG_PATH
class RetrieveAuthFile(View):
    def get(self, request, projectName,apiId, moduleId):
        try:
            file_path = f"{CONFIG_PATH}/{projectName}/swagger_metadata.json"
            # api_id = request.GET.get('api_id', None)
            api_id = apiId
            print(api_id, "apiid")
            if not os.path.exists(file_path):
                return JsonResponse({"error": "File not found"}, status=404)

            result = {}
            with open(file_path, "r") as file:
                file_content = json.load(file)
                # if not file_content.strip():
                #     return JsonResponse({"data": []}, status=200)
                result = None
                auth_apis = file_content.get(moduleId).get("auth_apis",{})
                if api_id == 'null':
                    result = []
                    for key, api in auth_apis.items():
                        response_tokens = ''
                        for res in api.get("response", []):
                            if res:
                                if res.get("status") == 'S_200':
                                    response_tokens = res.get("token_store")
                        result.append({
                            "id" : key,
                            "operation_id" : api.get("operation_id"),
                            "response_tokens": response_tokens,
                            # "auth_api_type":auth_apis[api].get("auth_api_type")
                        })
                else:
                    result = auth_apis.get(api_id)
                    
            return JsonResponse({"data": result}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)