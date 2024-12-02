from rest_framework import serializers

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField()

class RegisterResponseSerializer(serializers.Serializer):
    accessToken = serializers.CharField()
    
class UserDetailsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(
        max_length=128,
        write_only=True,
        style={'input_type': 'password'}
    )
    created_at = serializers.DateTimeField()
    phone_number = serializers.CharField(max_length=15)
    projects = serializers.ListField(
        child=serializers.IntegerField()
    )

    class Meta:
        ref_name = "UserDetails" 