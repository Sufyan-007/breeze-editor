import json
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, FileResponse
import threading
from ..core.route_config_editor import add_route_to_config, get_all_route_full_paths, update_route_in_config
from ..core.route_config_editor import process_and_save_route_config, delete_route as del_route


@csrf_exempt
@api_view(['GET'])
def get_all_routes(request, param):
    try:
        res = get_all_route_full_paths(project_id=param)
        return JsonResponse({'all_route_full_paths':res}, status=200)
    except Exception as e:
        print("Error ", e)
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@api_view(['POST'])
def add_route(request, param):
    data = json.loads(request.body.decode("utf-8"))
    project_name = param
    try:
        res = add_route_to_config(data, project_id=project_name)
        process_and_save_route_config(project_name, res['config'])
        # threading.Thread(target=process_and_save_route_config, args=(project_name, )).start()
        return JsonResponse(res, status=200)
    except Exception as e:
        print("Error ", e)
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@api_view(['PUT'])
def update_route(request, param):
    data = json.loads(request.body.decode("utf-8"))
    project_name = param
    try:
        res = update_route_in_config(data, project_name)
        process_and_save_route_config(project_name, res['config'])
        return JsonResponse(res, status=200)
    except Exception as e:
        print("Error ", e)
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
def delete_route(request, param):
    try:
        project_name = param
        data = json.loads(request.body.decode("utf-8"))
        res = del_route(data.get('id'), project_name)
        process_and_save_route_config(project_name, res['config'])
        return JsonResponse(res, status=200)
    except Exception as e:
        print("Error ", e)
        return JsonResponse({'error': str(e)}, status=500)

