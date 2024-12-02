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
        # print(user,"fasddf")
        # with this i can get all role of that user
        # roles = [role.name for role in user.roles.all()]
        # user_details = get_user_data(user.id)
        # request.user_datails = user_details
        # print(user.id)
        # Do not return the username or password, only the tokens
        refresh = RefreshToken()
        refresh['user_id']=user.id
        
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id':str(user.id)
        }
        
def get_user_data(id):
    try:
        user = UserProfile.objects.get(id=id)
        serializer = UserProfileSerializer(user)
        # print(serializer.data)
        
        return serializer.data
        # return jsonResponse(serializer.data)
    except UserProfile.DoesNotExist:
        # return jsonResponse({"error": "User not found"}, status=400)
        return {"error":"user not found"}       
        
def get_all_user_data():
    try:
        user = UserProfile.objects.all()
        # serializer = UserProfileSerializer(user)
        user_list = list(user.values())
        print(user_list)
        
        return user_list
        # return jsonResponse(serializer.data)
    except Exception as e:
        # return jsonResponse({"error": "User not found"}, status=400)
        return {"error":"users not found"}   
    
# def accessTokengenerator(id):
#     try:
#         user=UserProfile.objects.get(id=id)
#         refresh = RefreshToken.for_user(user)
#         # refresh['username']=data['username']
#         user.refresh_token=refresh
#         user.save()
#         # access_token = str(refresh_token.access_token)
#         return str(refresh.access_token)
#     except Exception as e:
#         return {"error":str(e)}
    
class RefreshTokenSerializer(serializers.Serializer):
    access_token = serializers.CharField()