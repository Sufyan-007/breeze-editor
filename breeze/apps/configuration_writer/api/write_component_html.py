from django.http import JsonResponse
import json
from ..core.app_config_writer import AppConfigWriter
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView

@method_decorator(csrf_exempt, name='dispatch')
class WriteComponentHtml(APIView):
    
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        app_name = data.get("appName")
        key = data.get("componentId")
        comp_html_config = data.get("compHtmlConfig")
        app_config_writer = AppConfigWriter()
        app_config_writer.update_component_html_config(app_name,key,comp_html_config)

        print(data)
        return JsonResponse({"list" : []}, status = 201)