import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from ..core.api_client_generator import generate_react_service
from django.http import JsonResponse
from ..swagger_schema.generate_code_schema import generate_service_file_schema
from ...common.constants.consts import CONFIG_PATH,CLIENT_API
from drf_spectacular.utils import extend_schema

@csrf_exempt
def generate_code(request):
    return "" 

@extend_schema(
    methods=['POST'],
    request=generate_service_file_schema['rb'],
    responses={
        201:generate_service_file_schema['response_201']
    }
)
@api_view(['POST'])
@permission_classes([AllowAny])     
def generate_service_files(request,project_id,type):
    data = json.loads(request.body.decode("utf-8"))
    filename = data.get("filename")
    module_id = data.get("moduleId")
    service_type = "ORDINARY"
    if(type == "AUTH"):
        service_type = "AUTH"
    elif type == "WS":
        service_type = "WS"
    swagger_metadata_path = f"{CONFIG_PATH}/{project_id}/{CLIENT_API}/swagger_metadata.json"
    with open(swagger_metadata_path, 'r') as file:
        metadata_content = json.load(file)
    security_schemes = metadata_content[module_id].get("security_schemes")
    generate_react_service(project_id,filename,service_type, module_id, security_schemes=security_schemes)
    return JsonResponse({"list" : []}, status = 201) 