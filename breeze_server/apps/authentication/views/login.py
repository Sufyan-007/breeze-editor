import json
from ..utils import get_auth_file_path
from ..utils import generate_token
from ..utils import get_expiry_timestamp
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

@csrf_exempt
@require_POST
@swagger_auto_schema(
    method='post',
    request_body = openapi.Schema(
        type = openapi.TYPE_OBJECT,
        properties = {
            'username':openapi.Schema(type = openapi.TYPE_STRING),
            'password':openapi.Schema(type = openapi.FORMAT_PASSWORD)
        },
        required = ['username','password']
    ),
    manual_parameters = [
        openapi.Parameter(
            name = 'device_id',
            in_ = openapi.IN_PATH,
            type = openapi.TYPE_STRING,
            description = "It is the ID of the device from where the user is logged in."
        )
    ],
    responses = {
                200:openapi.Response(
                   description='Success',
                    schema=openapi.Schema(
                       type=openapi.TYPE_OBJECT,
                       properties={'accessToken':openapi.Schema(type=openapi.TYPE_STRING)}
                    ),
                ),
                400:openapi.Response(
                    description="Bad Request",
                    schema=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={'error':openapi.Schema(type=openapi.TYPE_STRING)}
                    ),
                    examples={'application/json':{'error':'Invalid credentials'}}
                    
                    
                )
    },
    tags=['Auth']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    data = json.loads(request.body)
    print("login_data")
    print(data)
    username = data.get('username')
    password = data.get('password')

    auth_file_path = get_auth_file_path()
    try:
        with open(auth_file_path, 'r') as file:
            auth_data = json.load(file)
    except FileNotFoundError:
        return JsonResponse({'error': 'Invalid credentials'}, status=400)

    # Find existing token for username
    existing_token = None
    for token, info in auth_data.items():
        if info['username'] == username and info['password'] == password:
            existing_token = token
            break

    if existing_token:
        # Remove old token
        del auth_data[existing_token]
    
    # Generate new token
    token = generate_token()
    token_data = {
        'username': username,
        'password': password,
        'expiry': get_expiry_timestamp().isoformat()
    }
    
    auth_data[token] = token_data

    with open(auth_file_path, 'w') as file:
        json.dump(auth_data, file)

    return JsonResponse({'accessToken': token}, status=200)
