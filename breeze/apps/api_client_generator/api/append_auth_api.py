from django.http import JsonResponse
import json
from django.views import View
from ..core.openapi_swagger_converter import OpenapiConverter
from ..utils.api_model_loader import ApiModelLoader
class AppendAuthApi(View):
    
    def post(self, request,operation):
        data = json.loads(request.body.decode("utf-8"))
        model = ApiModelLoader.load_auth_api_model(data)
        OpenapiConverter.append_auth_json([model])
        return JsonResponse({"list" : []}, status = 201)