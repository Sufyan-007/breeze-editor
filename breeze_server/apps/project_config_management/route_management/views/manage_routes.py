import json
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from ..core.route_config_editor import update_route_in_config,check_for_mandatory_route_props,validate_route_path
from ..core.route_config_editor import process_route_config, delete_route as del_route, transform_route_config
from ..core.route_config_editor import rewrite_clean_route_config, include_all_routes_accessory_data
from django.http import JsonResponse
from apps.common.utils.tree_management import get_node,get_all_path_of_node, add_node
from apps.common.constants.enums.tree_type import TreeType


@csrf_exempt
@api_view(['GET'])
def get_all_child_routes(request,project_id):
    target_id = request.GET.get('target_id', None)
    target_id = None if target_id in ['null', '""', "''", "", ''] else target_id
    nodes = get_node(project_id,TreeType["ROUTES"],target_id,depth=1)
    include_all_routes_accessory_data(project_id, nodes.get('children'))
    return JsonResponse(nodes, status=200)

@csrf_exempt
@api_view(['GET'])
def get_all_routes_fullpath(request,project_id):
    target_id = request.GET.get('target_id', None)
    nodes = get_all_path_of_node(project_id,TreeType["ROUTES"],target_id,'path')
    data = {
        "nodes" : nodes
    }
    return JsonResponse(data, status=200)

@csrf_exempt
@api_view(['POST'])
def add_route(request, project_id):
    data = json.loads(request.body.decode("utf-8"))
    try:
        check_for_mandatory_route_props(route_obj=data)
        if validate_route_path(data, data.get("parentId"), project_id) is True:    
            config_data = add_node(project_id, TreeType["ROUTES"].value, data.get("parentId"), data)
            # create clean and properly formatted config for code generation
            transform_route_config(config_data)
            # now it isn't useful since we won't have a full path as a key
            # add_params_to_route_object()
            rewrite_clean_route_config(project_id, config_data)
            process_route_config(project_id)
            include_all_routes_accessory_data(project_id, list(config_data.values()))
            return JsonResponse(config_data, status=200)
    except Exception as e:
        print("Error ", e)
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@api_view(['PUT'])
def update_route(request, project_id):
    data = json.loads(request.body.decode("utf-8"))
    try:
        check_for_mandatory_route_props(route_obj=data)
        res = update_route_in_config(data, project_id)
        config_data = res['config']
        # create clean and properly formatted config for code generation
        transform_route_config(config_data)
        # now it isn't useful since we won't have a full path as a key
        # add_params_to_route_object()
        rewrite_clean_route_config(project_id, config_data)
        process_route_config(project_id, config_data)
        include_all_routes_accessory_data(project_id, list(config_data.values()))
        return JsonResponse(config_data, status=200)
    except Exception as e:
        print("Error ", e)
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
@api_view(['DELETE'])
def delete_route(request, project_id):
    try:
        data = json.loads(request.body.decode("utf-8"))
        res = del_route(data.get('id'), project_id)
        config_data = res['config']
        # create clean and properly formatted config for code generation
        transform_route_config(config_data)
        # now it isn't useful since we won't have a full path as a key
        # add_params_to_route_object()
        rewrite_clean_route_config(project_id, config_data)
        process_route_config(project_id, config_data)        
        include_all_routes_accessory_data(project_id, list(config_data.values()))
        return JsonResponse(config_data, status=200)
    except Exception as e:
        print("Error ", e)
        return JsonResponse({'error': str(e)}, status=500)

