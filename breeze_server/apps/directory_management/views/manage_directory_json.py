from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from apps.common.utils.tree_management import get_node
from apps.common.constants.enums.tree_type import TreeType
from ..swagger_schema.manage_directory_json_schema import parameter,response_200
from ..models.manage_directory_json import GetDirectoryJsonResponse

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import status


@swagger_auto_schema(
    method='get',
    manual_parameters=parameter,
    responses={
        status.HTTP_200_OK:response_200
    }
    
)

@csrf_exempt
@api_view(['GET'])
def get_directories(request,project_id):
    target_id = request.GET.get('target_id', None)
    depth = request.GET.get('depth', "1")
    nodes = get_node(project_id,TreeType["DIRECTORY"],target_id,depth=int(depth))
    get_directory_json_response = GetDirectoryJsonResponse(nodes.get('node'),nodes.get('children'))
    if(get_directory_json_response.__dict__['isError']):
        raise Exception(get_directory_json_response.__dict__['errorObj'])
    else:
        return JsonResponse(nodes, status=200)



