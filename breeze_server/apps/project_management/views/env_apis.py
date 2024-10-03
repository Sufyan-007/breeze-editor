import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from apps.common.utils.file_helpers.json_handler import read_project_config_file
from apps.common.constants.consts import CONFIG_FILES_PATH, CONFIG_PATH
from ..core.environment_management import set_environment
from django.http import JsonResponse
from drf_yasg.utils import swagger_auto_schema
from ..swagger_schema.env_apis_schema import set_env_schema,get_env_config_schema

@swagger_auto_schema(
    method='post',
    request_body=set_env_schema['rb'],
    responses={
        200:set_env_schema['response_200'],
        500:set_env_schema['response_500']
    },
    tags=['environment']
)
@csrf_exempt
@api_view(['POST'])
def set_env(request, project_id):
    try:
        data = json.loads(request.body.decode("utf-8"))
        env_name = data.get('environmentName')
        set_environment(env_name, project_id)
        if env_name == "dev (default)":
            return JsonResponse({'status': 'success', 'message': 'Environment default has been set as active'}, status=200)
        return JsonResponse({'status': 'success', 'message': f'Environment {env_name} has been set as active'}, status=200)
    except Exception as e:
        print(f"Error: {e}")
        return JsonResponse({'error': 'Server error'}, status=500)

@swagger_auto_schema(
    method='get',
    request_body=None,
    responses=None,
    tags=['environment']
)
@csrf_exempt
@api_view(['GET'])
def get_env_config(request, project_id):
    try:
        pass
    except Exception as e:
        print(f"Error: {e}")
        return JsonResponse({'error': 'Server error'}, status=500)

@swagger_auto_schema(
    method='post',
    request_body=None,
    responses=None,
    tags=['environment']
)
@csrf_exempt
@api_view(['POST'])
def add_env_config(request, project_id):
    try:
        pass
    except Exception as e:
        print(f"Error: {e}")
        return JsonResponse({'error': 'Server error'}, status=500)
    
@swagger_auto_schema(
    method='put',
    request_body=None,
    responses=None,
    tags=['environment']
)
@csrf_exempt
@api_view(['PUT'])
def update_env_config(request, project_id):
    try:
        pass
    except Exception as e:
        print(f"Error: {e}")
        return JsonResponse({'error': 'Server error'}, status=500)

@swagger_auto_schema(
    method='delete',
    request_body=None,
    responses=None,
    tags=['environment']
)
@csrf_exempt
@api_view(['DELETE'])
def delete_env_config(request, project_id):
    try:
        pass
    except Exception as e:
        print(f"Error: {e}")
        return JsonResponse({'error': 'Server error'}, status=500)