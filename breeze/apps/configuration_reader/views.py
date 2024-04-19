from django.views import View
from django.http import JsonResponse
import json
from .core.app_config_reader import AppConfigReader

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