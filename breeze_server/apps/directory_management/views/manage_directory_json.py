import json
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from apps.common.utils.tree_management import get_node
from apps.common.constants.enums.tree_type import TreeType


@csrf_exempt
@api_view(['GET'])
def get_directories(request,project_id):
    target_id = request.GET.get('target_id', None)
    nodes = get_node(project_id,TreeType["DIRECTORY"],target_id,depth=1)
    return JsonResponse(nodes, status=200)



