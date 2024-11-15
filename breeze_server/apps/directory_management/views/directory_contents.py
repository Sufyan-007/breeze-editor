from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import status
import json
from ..core.directory_management_service import DirectoryManager

@swagger_auto_schema(
    method='get',
    responses={
        status.HTTP_200_OK:openapi.Response(
            description="File content",
            schema= openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "code": openapi.Schema(type=openapi.TYPE_STRING,description="Content of the file")
                }
            )                                    
        )
    }
    
)
@csrf_exempt
@api_view(['GET'])
def get_file_content(request,project_id,file_id):
    directoryManagement = DirectoryManager(project_id)
    code = directoryManagement.get_file_content(file_id)
    return JsonResponse({"code":code}, status=200)



@csrf_exempt
@api_view(["DELETE"])
def delete_file(request,project_id):
    data = json.loads(request.body.decode("utf-8"))
    
    directoryManager = DirectoryManager(project_id)
    directoryManager.delete_node(data["file_id"],data.get("recursive", False))
    return JsonResponse({},status=200)