from django.http import JsonResponse
import json
from ..core.app_config_writer import AppConfigWriter
from ..core.retrive_app_config import RetriveAppConfig

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView

@method_decorator(csrf_exempt, name='dispatch')
class WriteComponent(APIView):
    
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        app_name = data.get("appName")
        key = data.get("componentId")
        comp_config = data.get("compConfig")
        app_config_writer = AppConfigWriter()
        app_config_writer.create_or_update_component_config(app_name,key,comp_config)

        print(data)
        return JsonResponse({"list" : []}, status = 201)