from django.http import JsonResponse
import json
from ..core.app_config_writer import AppConfigWriter
from ..core.retrive_app_config import RetriveAppConfig

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView

@method_decorator(csrf_exempt, name='dispatch')
class ReriveComponent(APIView):
    
    def get(self, request,app,compId):

        retrive_config = RetriveAppConfig()
        entity = request.GET.get('entity', None)
        comp_config = retrive_config.get_comp_config(app,compId,entity)
        if comp_config["error"] is False:
            return JsonResponse({compId : comp_config["data"]}, status = 201)
        else:
            return JsonResponse({compId : comp_config["message"]}, status = 500)