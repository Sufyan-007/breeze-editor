import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from ..core.environment_management import set_environment, generate_config_from_payload, delete_proj_env, get_env_config
from ..core.environment_management import delete_env_variable, update_env_vars, update_environment_name
from django.http import JsonResponse
from ..swagger_schema.env_apis_schema import set_env_schema,get_env_config_schema
from drf_spectacular.utils import extend_schema
@extend_schema(
    methods=['POST'],
    request=set_env_schema['rb'],
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
            return JsonResponse({
                'status': 'success', 
                'message': 'Environment default has been set as active', 
                'config': {'environmentName': 'dev (default)'}
            }, status=200)
        return JsonResponse({
            'status': 'success', 
            'message': f'Environment {env_name} has been set as active', 
            'config': {'environmentName': env_name}
        }, status=200)
    except Exception as e:
        print(f"Error: {e}")
        return JsonResponse({'error': 'Server error'}, status=500)

@extend_schema(
    methods=['GET'],
    request=None,
    responses={
        500:get_env_config_schema['response_500']
    },
    tags=['environment']
)
@csrf_exempt
@api_view(['GET'])
def get_environment_config(request, project_id):
    try:
        env_config = get_env_config(project_id)
        return JsonResponse({'status': 'success', 'config': env_config}, status=200)
    except Exception as e:
        print(f"error: {e}")
        return JsonResponse({'error': 'Server error'}, status=500)

@extend_schema(
    methods=['POST'],
    request=None,
    responses=None,
    tags=['environment']
)
@csrf_exempt
@api_view(['POST'])
def add_env_config(request, project_id):
    try:
        data = json.loads(request.body.decode("utf-8"))
        env_config = generate_config_from_payload(project_id, data)
        return JsonResponse({'status': 'success', 'config': env_config, 'message': 'Environment settings saved successfully'}, status=200)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@extend_schema(
    methods=['PUT'],
    request=None,
    responses=None,
    tags=['environment']
)
@csrf_exempt
@api_view(['PUT'])
def update_env_config(request, project_id):
    try:
        data = json.loads(request.body)
        variable_id = data.get('envVariableId')
        env_vars = data.get('envVars')
        env_name = env_vars.get('name')
        env_values = env_vars.get('values')


        if variable_id:
            # Update environment variable
            config = update_env_vars(project_id, variable_id, env_name, env_values)
        elif env_name:
            # Update environment name
            old_env_name = data.get('oldEnvName')  # Assuming the old environment name is sent in the request
            config = update_environment_name(project_id, old_env_name, env_name)

        return JsonResponse({'status': 'success', 'message': 'Environment settings updated successfully', 'config': config}, status=200)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@extend_schema(
    methods=['DELETE'],
    request=None,
    responses=None,
    tags=['environment']
)
@csrf_exempt
@api_view(['DELETE'])
def delete_env_config(request, project_id):
    try:
        data = json.loads(request.body)
        env_name = data.get('envName')
        env_variable_id = data.get('envVariableId')

        if env_name:
            # Handle environment deletion
            config = delete_proj_env(project_id, env_name)
            return JsonResponse({'status': 'success', 'message': f'Environment "{env_name}" deleted successfully', 'config': config}, status=200)

        elif env_variable_id:
            # Handle environment variable deletion
            res = delete_env_variable(project_id, env_variable_id)
            return JsonResponse({'status': 'success', 'message': f'Environment variable "{res["env_var_name"]}" deleted successfully', 'config': res['config']}, status=200)
        else:
            return JsonResponse({'error': 'No valid identifier provided'}, status=400)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
    