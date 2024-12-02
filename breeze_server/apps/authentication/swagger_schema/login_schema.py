# from drf_yasg import openapi
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiResponse,OpenApiExample
from rest_framework import serializers
from ..data_models.serializers import LoginBodySerializer,LoginResponseSerializer,ErrorResponseSerializer,LogoutResponseSerializer

class LoginResponseSerializer(serializers.Serializer):
    accessToken = serializers.CharField()
    username = serializers.CharField()
class ErrorResponseSerializer(serializers.Serializer):
    error = serializers.CharField()

class LogoutResponseSerializer(serializers.Serializer):
    details = serializers.CharField()

login_schema ={
    'rb':{
        'application/json': LoginBodySerializer
    },
    'response_200': OpenApiResponse(
        description='success',
        response=LoginResponseSerializer,
    ),
    'response_400':OpenApiResponse(
        description='Bad Request',
        response=ErrorResponseSerializer,
        examples=[OpenApiExample(
            name="Invalid Credentials",
            value={"error": "Invalid credentials"},
            summary="When credentials are invalid"
        )]
    )
   
}

logout_schema ={
    'response_200': OpenApiResponse(
        description='success',
        response=LogoutResponseSerializer,
        examples=[OpenApiExample(
            name="Success",
            value={"detail": "logged out successfully"},
        )]
    ),
    'response_400':OpenApiResponse(
        description='Bad Request',
        response=ErrorResponseSerializer,
    )
}