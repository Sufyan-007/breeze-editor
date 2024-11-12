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
# # from ..models.Auth import models
# from rest_framework import serializers
# from ..models import UserProfile
# from django.contrib.auth.hashers import make_password

from .serializers import UserProfileSerializer

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
    # data = json.loads(request.body)
    try:        
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"message": "User registered successfully"}, status=200)
            # return JsonResponse({'accessToken': "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMxMzI2OTAyLCJpYXQiOjE3MzEzMjY2MDIsImp0aSI6ImI3NjJjMWM2ZTU1NjRiNGRiZGZkMDA2ZTZhZTdhMjgyIiwidXNlcl9pZCI6MTF9.bx2WvJgyIelVOGvtW9nN6JpGCRcpq5wVVacCbr_rYvc"}, status=201)
        return JsonResponse(serializer.errors, status=400)
    
    except Exception as e:
        return JsonResponse({"error  ":str(e)})
    # try:
    #     serializer = UserProfileSerializer(data=request.data)
    #     if serializer.is_valid():
    #         print(serializer)
    #         serializer.save()
    #         return JsonResponse({"data":"user save succesfully"})
    # print("exception error occur")
    # return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
    # print("register")
    # print(data)
    # username = data.get('username')
    # password = data.get('password')
    # email = data.get('email')

    # # Generate new token
    # token = generate_token()
    # token_data = {
    #     'username': username,
    #     'password': password,
    #     'email': email,
    #     'expiry': get_expiry_timestamp().isoformat()
    # }
    
    # auth_file_path = get_auth_file_path()
    # print(auth_file_path)
    # try:
    #     with open(auth_file_path, 'r+') as file:
    #         auth_data = json.load(file)
    #         # Remove any existing token for the same username
    #         auth_data = {k: v for k, v in auth_data.items() if v['username'] != username}
    #         auth_data[token] = token_data
    #         file.seek(0)
    #         json.dump(auth_data, file)
    # except FileNotFoundError:
    #     with open(auth_file_path, 'w') as file:
    #         json.dump({token: token_data}, file)

    # return JsonResponse({'accessToken': "55fbee48-b5b3-4556-a3c9-2e5ec7699244"}, status=201)


# myapp/serializers.py


    
        # This method will hash the password before saving the user
        # user = UserProfile.objects.create_user(
        #     username=validated_data['username'],
        #     email=validated_data['email'],
        #     password=validated_data['password'],
        # )
        # # user.set_password(validated_data['password'])  # Hash the password
        # user.save()
        # print(user)
        # return user.username
