from django.views import View
from django.http import JsonResponse
import json
from .core.app_config_writer import AppConfigWriter
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt


@method_decorator(csrf_exempt, name='dispatch')
class ConfigWriter(View):

    def get(self, request):
        return JsonResponse({"data" : []}, status=200)
    
    def post(self, request):

        data = json.loads(request.body.decode("utf-8"))
        app_config_writer = AppConfigWriter()
        app_config_writer.create_or_update_app_config(data)

        print(data)
        return JsonResponse({"list" : []}, status = 201)