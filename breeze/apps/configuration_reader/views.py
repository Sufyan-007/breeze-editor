from django.views import View
from django.http import JsonResponse
import json
from .core.app_config_reader import AppConfigReader
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from .models import ConfigWriterSerializer
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.schemas import SchemaGenerator
from rest_framework.views import APIView

@method_decorator(csrf_exempt, name='dispatch')
class GetComponents(APIView):
    
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        print(data)
        app_config_reader = AppConfigReader()
        response = app_config_reader.get_components(data)

        return JsonResponse(response, status = 200)
    
@method_decorator(csrf_exempt, name='dispatch')
class GetComponentConfig(APIView):
    
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        print(data)
        app_config_reader = AppConfigReader()
        response = app_config_reader.get_component_config(data)

        return JsonResponse(response, status = 200)