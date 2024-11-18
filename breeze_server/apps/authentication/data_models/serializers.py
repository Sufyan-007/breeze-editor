from rest_framework import serializers

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField()

class RegisterResponseSerializer(serializers.Serializer):
    accessToken = serializers.CharField()
