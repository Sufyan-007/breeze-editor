import json
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import threading
from ..core.route_config_editor import config_editor
from ..core.route_config_editor import process_and_save_route_config
from apps.common.utils.tree_management import get_node,get_all_path_of_node
from apps.common.constants.enums.tree_type import TreeType


@csrf_exempt
@api_view(['GET'])
def get_routes(request,project_id):
    target_id = request.GET.get('target_id', None)
    nodes = get_node(project_id,TreeType["ROUTES"],target_id,depth=1)
    return JsonResponse(nodes, status=200)

@csrf_exempt
@api_view(['GET'])
def get_all_routes_fullpath(request,project_id):
    target_id = request.GET.get('target_id', None)
    nodes = get_all_path_of_node(project_id,TreeType["ROUTES"],target_id)
    data = {
        "nodes" : nodes
    }
    
    return JsonResponse(data, status=200)




@csrf_exempt
@api_view(['POST'])
def add_update_route(request, param):
    data = json.loads(request.body.decode("utf-8"))
    project_name = param
    try:
        initialize, add_edit_base_route, add_edit_route = config_editor()
        initialize(project_name)
        if data.get('addCompRoute'):
            res = add_edit_base_route(data)
        else:
            res = add_edit_route(data)
        if res['case']:
            threading.Thread(target=process_and_save_route_config, args=(project_name, )).start()
            return JsonResponse(res['res'], status=200)
        else:
            return JsonResponse(res['res'], status=400, safe=False)
    except Exception as e:
        print("Error ", e)
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
def delete_route(request, param):
    try:
        data = json.loads(request.body.decode("utf-8"))
        initialize, delete_route = config_editor()
        initialize(project_name=param)
        res = delete_route(data)
        if res['case']:
            threading.Thread(target=process_and_save_route_config, args=(res['res'], )).start()
            return JsonResponse(res['res'], status=200)
        else:
            return JsonResponse(res['res'], status=400, safe=False)
    except Exception as e:
        print("Error ", e)
        return JsonResponse(e, status=500)  

