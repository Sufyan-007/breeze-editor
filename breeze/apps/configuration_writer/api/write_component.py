from django.http import JsonResponse
import json
from ..core.app_config_writer import AppConfigWriter
from django.views import View

class WriteComponent(View):
    
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        app_name = data.get("appName")
        key = data.get("componentId")
        comp_config = data.get("compConfig")
        app_config_writer = AppConfigWriter()
        app_config_writer.create_or_update_component_config(app_name,key,comp_config)

        print(data)
        return JsonResponse({"list" : []}, status = 201)