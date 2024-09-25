import json
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, FileResponse
import subprocess, requests, threading
from ..core.route_config_editor import config_editor
from ..core.route_config_editor import process_and_save_route_config

@csrf_exempt
def get_route(request):
    return ""

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

