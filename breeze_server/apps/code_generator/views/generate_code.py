import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from ..core.api_client_generator import generate_react_service
from django.http import JsonResponse
from drf_yasg.utils import swagger_auto_schema
from ..swagger_schema.generate_code_schema import generate_service_file_schema
from ..models.generate_code import GenerateServiceFileBody

@csrf_exempt
def generate_code(request):
    return "" 

@swagger_auto_schema(
    method='post',
    request_body=generate_service_file_schema['rb'],
    responses={
        201:generate_service_file_schema['response_201']
    }
)
@api_view(['POST'])
@permission_classes([AllowAny])     
def generate_service_files(request,project_id,type):
    data = json.loads(request.body.decode("utf-8"))
    res = GenerateServiceFileBody(data.get("filename"),data.get("moduleId"))
    if(res.__dict__['isError']):
        raise Exception(res.__dict__['errorObj'])
    else:
        filename = res.__dict__['responseObj'].get("filename")
        module_id = res.__dict__['responseObj'].get("moduleId")
    service_type = "ORDINARY"
    if(type == "AUTH"):
        service_type = "AUTH"
    elif type == "WS":
        service_type = "WS"
    generate_react_service(project_id,filename,service_type, module_id)
    return JsonResponse({"list" : []}, status = 201) 