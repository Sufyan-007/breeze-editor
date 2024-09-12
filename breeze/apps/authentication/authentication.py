from datetime import datetime
from django.utils import timezone
import json
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .utils import get_auth_file_path

class CustomTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        print("authenticate")
        token = request.headers.get('Authorization', None)
        if token is None:
            return None

        token = token.replace('Token ', '')
        auth_file_path = get_auth_file_path()

        try:
            with open(auth_file_path, 'r') as file:
                auth_data = json.load(file)
        except FileNotFoundError:
            return None

        token_data = auth_data.get(token)
        if not token_data:
            raise AuthenticationFailed('Invalid token.')

        expiry = datetime.fromisoformat(token_data['expiry'])
        if timezone.now() > expiry:
            del auth_data[token]
            with open(auth_file_path, 'w') as file:
                json.dump(auth_data, file)
            raise AuthenticationFailed('Token has expired.')

        return (token_data['username'], None)

    def authenticate_header(self, request):
        return 'Token'
