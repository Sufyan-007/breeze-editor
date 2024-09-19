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
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "username":openapi.Schema(type=openapi.TYPE_STRING),
            "email":openapi.Schema(type=openapi.FORMAT_EMAIL),
            "password":openapi.Schema(type=openapi.FORMAT_PASSWORD)
        },
        required=['username','password','email']
    ),
    responses={
                201:openapi.Response(
                    description='created',
                    schema=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={'accessToken':openapi.Schema(type=openapi.TYPE_STRING)}
                    )
                )
            },
    tags=['Auth']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data = json.loads(request.body)
    print("register")
    print(data)
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    # Generate new token
    token = generate_token()
    token_data = {
        'username': username,
        'password': password,
        'email': email,
        'expiry': get_expiry_timestamp().isoformat()
    }
    
    auth_file_path = get_auth_file_path()
    print(auth_file_path)
    try:
        with open(auth_file_path, 'r+') as file:
            auth_data = json.load(file)
            # Remove any existing token for the same username
            auth_data = {k: v for k, v in auth_data.items() if v['username'] != username}
            auth_data[token] = token_data
            file.seek(0)
            json.dump(auth_data, file)
    except FileNotFoundError:
        print('some error 2')
        with open(auth_file_path, 'w') as file:
            json.dump({token: token_data}, file)

    return JsonResponse({'accessToken': token}, status=201)
