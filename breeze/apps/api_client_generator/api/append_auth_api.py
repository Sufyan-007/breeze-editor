from django.http import JsonResponse
import json
from django.views import View
from ..core.openapi_swagger_converter import OpenapiConverter
from ..utils.api_model_loader import ApiModelLoader
from ..utils.uuid_as_key import generate_uuid_as_key
class AppendAuthApi(View):
    def post(self, request,operation,projectName):
        data = json.loads(request.body.decode("utf-8"))
        if operation == "add":
            data["id"] = generate_uuid_as_key()
        model = ApiModelLoader.load_auth_api_model(data)
        model_json = model.as_dict()
        openapiconvetor = OpenapiConverter()
        openapiconvetor.append_auth_json(auth_models=[model_json], appName=projectName)
        return JsonResponse({"list" : []}, status = 201)
   