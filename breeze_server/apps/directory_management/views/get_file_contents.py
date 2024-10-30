from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import status
from ..core.directory_management_service import DirectoryManager
from ..models.get_file_contents import GetFileContentResponse

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
    get_file_content_response = GetFileContentResponse(code)
    if(get_file_content_response['isError']):
        raise Exception(get_file_content_response.__dict__['errorObj'])
    else:
        return JsonResponse({"code":code}, status=200)



