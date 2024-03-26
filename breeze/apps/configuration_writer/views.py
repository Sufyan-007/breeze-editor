from django.views import View
from django.http import JsonResponse
import json
from .core.app_config_writer import AppConfigWriter

class ConfigWriter(View):
    
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        app_config_writer = AppConfigWriter()
        app_config_writer.create_or_update_app_config(data)

        print(data)
        return JsonResponse({"list" : []}, status = 201)