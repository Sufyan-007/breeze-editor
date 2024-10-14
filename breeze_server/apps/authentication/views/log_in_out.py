import json
from ..utils import get_auth_file_path
from ..utils import generate_token
from ..utils import get_expiry_timestamp
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema
from ..swagger_schema.login_schema import login_schema

@csrf_exempt
@require_POST
@swagger_auto_schema(
    method='post',
    request_body = login_schema['rb'],
    responses = {
                200:login_schema['response_200'],
                400:login_schema['response_400']
    },
    tags=['Auth']
)
@api_view(['POST'])
def login(request):
    try:
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
            return JsonResponse({'error': 'something went wrong'}, status=500)

        # Find existing token for username
        existing_token = None
        for token, info in auth_data.items():
            if info['username'] == username and info['password'] == password:
                existing_token = token
                break

        if existing_token:
            # Remove old token
            # del auth_data[existing_token]
            pass
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
        
        # Generate new token
        # token = generate_token()
        token_data = {
            'username': username,
            'password': password,
            'expiry': get_expiry_timestamp().isoformat()
        }
        
        # auth_data[token] = token_data
        auth_data[existing_token] = token_data

        with open(auth_file_path, 'w') as file:
            json.dump(auth_data, file)
            
        # request.session['auth_token'] = token
        # request.session.set_expiry(None)
        return JsonResponse({'accessToken': token, 'username': token_data['username']}, status=200)

    except Exception as e:
        print('Error: ', e)
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
@require_POST
@api_view(['POST'])
def logout(request):
    try:
        del request.session['auth_token']
        return JsonResponse({'detail': 'loged out successfully.'}, status=200)
    except Exception as e:
        print('Error: ', e)
        return JsonResponse({'error': str(e)}, status=500)
