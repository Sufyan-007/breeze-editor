import json
from ..utils import get_auth_file_path
from ..utils import generate_token
from ..utils import get_expiry_timestamp
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes

@csrf_exempt
@require_POST
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
