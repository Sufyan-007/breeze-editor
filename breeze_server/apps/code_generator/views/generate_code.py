import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from ..core.api_client_generator import generate_react_service
from django.http import JsonResponse

@csrf_exempt
def generate_code(request):
    return "" 


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