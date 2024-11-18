import json
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from apps.common.utils.tree_management import get_node,get_all_path_of_node, add_node
from apps.common.constants.enums.tree_type import TreeType
from ..core.route_config_editor import update_route_in_config,check_for_mandatory_route_props,validate_route_path
from ..utils.utils import process_route_config, include_all_routes_accessory_data, rewrite_clean_route_config
from ..core.route_config_editor import delete_route as del_route
from ..swagger_schema.manage_routes_schema import get_routes_schema,get_all_routes_fullpath_schema,add_route_schema,update_route_schema,delete_route_schema
from drf_spectacular.utils import extend_schema

@extend_schema(
    methods=['GET'],
    parameters=get_routes_schema['parameters'],
    responses={
        200:get_routes_schema['response_200'],
        400:get_routes_schema['response_400']
    },
    tags=['routes']
)
@csrf_exempt
@api_view(['GET'])
def get_all_child_routes(request,project_id):
    target_id = request.GET.get('target_id', None)
    depth = request.GET.get('depth', "1")
    target_id = None if target_id in ['null', '""', "''", "", ''] else target_id
    nodes = get_node(project_id,TreeType["ROUTES"],target_id, depth = int(depth))
    include_all_routes_accessory_data(project_id, nodes.get('children'))
    return JsonResponse(nodes, status=200)


@extend_schema(
    methods=['GET'],
    parameters=get_all_routes_fullpath_schema['parameters'],
    responses={
        200:get_all_routes_fullpath_schema['response_200']
    },
    tags=['routes']
)
@csrf_exempt
@api_view(['GET'])
def get_all_routes_fullpath(request,project_id):
    target_id = request.GET.get('target_id', None)
    nodes = get_all_path_of_node(project_id,TreeType["ROUTES"],target_id,'path')
    nodes = [{**node, 'path': '/'+node['path'].strip('/')} for node in nodes]
    data = {
        "nodes" : nodes
    }
    return JsonResponse(data, status=200)

@extend_schema(
    methods=['POST'],
    request=add_route_schema['rb'],
    responses={
        200:None,
        500:add_route_schema['response_500']
    },
    tags=['routes']
)
@csrf_exempt
@api_view(['POST'])
def add_route(request, project_id):
    data = json.loads(request.body.decode("utf-8"))
    ## res= model(data)
    
    try:
        check_for_mandatory_route_props(data, project_id)
        if validate_route_path(data, data.get("parentId"), project_id) is True:    
            config_data, node_id = add_node(project_id, TreeType["ROUTES"].value, data.get("parentId"), data)
            # add_params_to_route_object()
            rewrite_clean_route_config(project_id, config_data, node_id, data.get("currentVersion"))
            process_route_config(project_id, config_data)
            include_all_routes_accessory_data(project_id, [config_data[node_id]])
            return JsonResponse(config_data[node_id], status=200)
    except Exception as e:
        print("Error ", e)
        return JsonResponse({'error': str(e)}, status=500)

@extend_schema(
    methods=['PUT'],
    request=update_route_schema['rb'],
    responses={
        200:None,
        500:update_route_schema['response_500']
    },
    tags=['routes']
)
@csrf_exempt
@api_view(['PUT'])
def update_route(request, project_id):
    data = json.loads(request.body.decode("utf-8"))
    try:
        check_for_mandatory_route_props(data, project_id)
        res = update_route_in_config(data, project_id)
        config_data = res['config']
        # add_params_to_route_object()
        rewrite_clean_route_config(project_id, config_data, data['id'], data.get("currentVersion"))
        process_route_config(project_id, config_data)
        include_all_routes_accessory_data(project_id, [config_data[data['id']]])
        return JsonResponse(config_data[data['id']], status=200)
    except Exception as e:
        print("Error ", e)
        return JsonResponse({'error': str(e)}, status=500)

@extend_schema(
    methods=['DELETE'],
    request=delete_route_schema['rb'],
    responses={
        200:delete_route_schema['response_200'],
        500:delete_route_schema['response_500']
    },
    tags=['routes']
)
@csrf_exempt
@api_view(['DELETE'])
def delete_route(request, project_id):
    try:
        data = json.loads(request.body.decode("utf-8"))
        res = del_route(data.get('id'), project_id)
        config_data = res['config']
        rewrite_clean_route_config(project_id, config_data, data['id'], data.get("currentVersion"))
        process_route_config(project_id, config_data)
        return JsonResponse({'message': 'deletion operation successfully completed!', 'route_id': data['id']}, status=200)
    except Exception as e:
        print("Error ", e)
        return JsonResponse({'error': str(e)}, status=500)

