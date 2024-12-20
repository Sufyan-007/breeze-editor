import json
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from apps.common.utils.tree_management import get_node
from apps.common.constants.enums.tree_type import TreeType
from drf_spectacular.utils import extend_schema
from ..core.directory_management_service import DirectoryManager
from ..swagger_schema.manage_directory_json_schema import get_directories_schema
@extend_schema(
    methods=['GET'],
    parameters=get_directories_schema['parameters'],
    responses=get_directories_schema['response_200']
)

@csrf_exempt
@api_view(['GET'])
def get_directories(request,project_id):
    target_id = request.GET.get('target_id', None)
    depth = request.GET.get('depth', "1")
    nodes = get_node(project_id,TreeType["DIRECTORY"],target_id,depth=int(depth))
    return JsonResponse(nodes, status=200)


@csrf_exempt
@api_view(['POST'])
def get_directory_nodes_by_search(request,project_id):
    data = json.loads(request.body.decode("utf-8"))
    search_word = data.get('searchTerm', None)
    directory_manager = DirectoryManager(project_name=project_id)
    node_list = directory_manager.search_files(search_word)
    return JsonResponse({"file_list": node_list}, status=200)
