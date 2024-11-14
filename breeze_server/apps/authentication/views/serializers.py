from rest_framework import serializers
from ..models import UserProfile
from django.contrib.auth.hashers import make_password

# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken

class UserProfileSerializer(serializers.ModelSerializer):
    # password = serializers.CharField(write_only=True)

    class Meta:
        model = UserProfile
        fields = ['username', 'email','password','roles','phone_number','projects']
        extra_kwargs = {'password': {'write_only': True}}
        
    def validate(self, data):
        # Check if the username already exists
        if UserProfile.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({"username": "This username is already taken."})

        # Check if the email already exists
        if UserProfile.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "This email is already registered."})

        return data

    def create(self, validated_data):
        roles_data = validated_data.pop('roles', [])
        validated_data['password'] = make_password(validated_data['password'])
        user = UserProfile.objects.create(**validated_data)
        user.roles.set(roles_data)
        return user
    
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        # Retrieve user by username
        try:
            user = UserProfile.objects.get(username=data['username'])
        except UserProfile.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")

        # Check if password is correct
        if not check_password(data['password'], user.password):
            raise serializers.ValidationError("Incorrect password.")
        
        # Generate tokens if validation passes
        refresh = RefreshToken.for_user(user)
        refresh['username']=data['username']
        # print(user,"fasddf")
        # with this i can get all role of that user
        # roles = [role.name for role in user.roles.all()]
        
        # print(roles)
        # Do not return the username or password, only the tokens
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }