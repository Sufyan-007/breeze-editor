from django.http import JsonResponse
import json
from django.views import View
from ..core.openapi_swagger_converter import OpenapiConverter

class AppendAuthApi(View):
    
    def post(self, request,operation):
        data = json.loads(request.body.decode("utf-8"))
        if operation == "add":
            model = OpenapiConverter.load_auth_model(data,True)
            OpenapiConverter.append_auth_json([model])
        elif operation == "update":
            model = OpenapiConverter.load_auth_model(data,False)
            OpenapiConverter.append_auth_json([model])
        return JsonResponse({"list" : []}, status = 201)