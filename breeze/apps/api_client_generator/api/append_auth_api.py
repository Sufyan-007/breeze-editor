from django.http import JsonResponse
import json
from django.views import View
from ..core.openapi_helper import OpenApiHelper

class AppendAuthApi(View):
    
    def post(self, request,operation):
        data = json.loads(request.body.decode("utf-8"))
        if operation == "add":
            model = OpenApiHelper.load_auth_model(data,True)
            OpenApiHelper.append_auth_json([model])
        elif operation == "update":
            model = OpenApiHelper.load_auth_model(data,False)
            OpenApiHelper.append_auth_json([model])
        return JsonResponse({"list" : []}, status = 201)