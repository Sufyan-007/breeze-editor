import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from ..core.api_client_generator import generate_react_service
from django.http import JsonResponse
from drf_yasg.utils import swagger_auto_schema
from ..swagger_schema.generate_code_schema import generate_service_file_schema
from ..utils.function_ast_parser import FunctionParser

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
    filename = data.get("filename")
    module_id = data.get("moduleId")
    service_type = "ORDINARY"
    if(type == "AUTH"):
        service_type = "AUTH"
    elif type == "WS":
        service_type = "WS"
    generate_react_service(project_id,filename,service_type, module_id)
    return JsonResponse({"list" : []}, status = 201) 

@api_view(["POST"])
@permission_classes([AllowAny])
def generate_function_code(request,project_id):
    data = json.loads(request.body.decode("utf-8"))
    function_generator = FunctionParser()
    function_code = function_generator.generate_statement_code(data.get('config', {}))
    with open("/home/sufyan/Documents/Projects/breezeRepo/generated_projects/testing.jsx","w") as f:
        f.write(function_code)
    return JsonResponse({"code":function_code},status = 200)