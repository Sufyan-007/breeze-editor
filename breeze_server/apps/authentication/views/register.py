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
from ..swagger_schema.register_schema import register_schema
from ..models.Auth import RegisterBody,RegisterResponse

@csrf_exempt
@require_POST
@swagger_auto_schema(
    method='post',
    request_body=register_schema['rb'],
    responses={
                201:register_schema['response_201'],
            },
    tags=['Auth']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data = json.loads(request.body)
    res = RegisterBody(data.get('username'),data.get('email'),data.get('password'))
    if(res.__dict__['isError']):
        raise Exception(res.__dict__['errorObj'])
    else:
        username = res.__dict__['responseObj'].get('username')
        password = res.__dict__['responseObj'].get('password')
        email = res.__dict__['responseObj'].get('email')

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
        with open(auth_file_path, 'w') as file:
            json.dump({token: token_data}, file)
    #this will validate the response before sending to the client side
    register_response = RegisterResponse(token)
    if(register_response.__dict__['isError']):
        return JsonResponse({'error':register_response.__dict__['errorObj']},status = 500)
    else:
        return JsonResponse({'accessToken': token}, status=201)
