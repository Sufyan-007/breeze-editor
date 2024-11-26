from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from drf_yasg import openapi
from rest_framework import status
import json
from ..core.directory_management_service import DirectoryManager
from drf_spectacular.utils import extend_schema,OpenApiResponse
from ..swagger_schema.get_file_contents_schema import get_file_content_schema
from ..data_models.serializers import GetFileContentResponse200Serializer
@extend_schema(
    methods=['GET'],
    responses={
       200:OpenApiResponse(
           description="File content",
           response=GetFileContentResponse200Serializer
       )
    },
    request=None 
)
@csrf_exempt
@api_view(['GET'])
def get_file_content(request,project_id,file_id):
    directoryManagement = DirectoryManager(project_id)
    code = directoryManagement.get_file_content(file_id)
    return JsonResponse({"code":code}, status=200)


@extend_schema(
    methods=['DELETE'],
    request=None,
    responses=None
)
@csrf_exempt
@api_view(["DELETE"])
def delete_file(request,project_id):
    data = json.loads(request.body.decode("utf-8"))
    
    directoryManager = DirectoryManager(project_id)
    directoryManager.delete_node(data["file_id"],data.get("recursive", False))
    return JsonResponse({},status=200)

@api_view(["PUT","POST"])
def rename_file(request,project_id):
    data = json.loads(request.body.decode("utf-8"))
    
    directoryManager = DirectoryManager(project_id)
    directoryManager.rename_node(data["file_id"],new_name=data["new_name"])
    return JsonResponse({},status=200)

@api_view(["PUT","POST"])
def move(request,project_id):
    data = json.loads(request.body.decode("utf-8"))
    
    directoryManager = DirectoryManager(project_id)
    directoryManager.move_node(node_id=data["file_id"],new_parent_id=data["new_parent_id"])
    return JsonResponse({},status=200)

