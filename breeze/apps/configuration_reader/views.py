from django.views import View
from django.http import JsonResponse
import json
from .core.app_config_reader import AppConfigReader
from common.utils.app_consts import THIRD_PARTY_CONFIG_PATH
from common.utils.config_reader import read_file_json

class GetComponents(View):
    
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        print(data)
        app_config_reader = AppConfigReader()
        response = app_config_reader.get_components(data)

        return JsonResponse(response, status = 200)
    
class GetComponentConfig(View):
    
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        print(data)
        app_config_reader = AppConfigReader()
        response = app_config_reader.get_component_config(data)

        return JsonResponse(response, status = 200)
    
class ReadFromPath(View):

    def get(self, request, filepath):
        # filepath = filepath.replace("@@@", "/")
        full_path = f"{THIRD_PARTY_CONFIG_PATH}/react-bootstrap/others/{filepath}"

        response = read_file_json(full_path)

        return JsonResponse(response, status = 200)

