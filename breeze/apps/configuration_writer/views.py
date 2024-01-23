from django.views import View
from django.http import JsonResponse
import json
from .core.app_config_writer import AppConfigWriter
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework_swagger.views import get_swagger_view
from rest_framework.views import APIView
from .models import ConfigWriterSerializer
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.schemas import SchemaGenerator
from rest_framework.views import APIView
from rest_framework_swagger import renderers

FETCH_CAR_SUCCESS = '''{{
    "id": <showroom id>, 
    "name": <showroom name>,
    "location": <showroom location>,
    "car": [
        {
            "model_no": <car model no>,
            "model_name": <car model name>,
            "showroom": <showroom no>
        }
    ]
}}'''
class SwaggerSchemaView(APIView):
    permission_classes = [AllowAny]
    renderer_classes = [
        renderers.OpenAPIRenderer,
        renderers.SwaggerUIRenderer
    ]

    def get(self, request):
        generator = SchemaGenerator()
        schema = generator.get_schema(request=request)

        return Response(schema)
@method_decorator(csrf_exempt, name='dispatch')
class ConfigWriter(APIView):
    
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        app_config_writer = AppConfigWriter()
        app_config_writer.create_or_update_app_config(data)

        print(data)
        return JsonResponse({"list" : []}, status = 201)