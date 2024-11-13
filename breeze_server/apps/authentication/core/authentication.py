from datetime import datetime, timedelta
from django.utils import timezone
import json
import jwt
import uuid
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from ..utils import get_auth_file_path
from ..auth_consts import EXEMPT_URLS

class CustomTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        print("authenticate")
        if request.path in EXEMPT_URLS:
            return None
        token = request.headers.get('Authorization', None)
        if token is None:
            raise AuthenticationFailed('Invalid token.')
            return None

        token = token.replace('Bearer ', '')
        # auth_file_path = get_auth_file_path()

        # try:
        #     with open(auth_file_path, 'r+') as file:
        #         auth_data = json.load(file)
        # except FileNotFoundError:
        #     return None

        token_data = jwt.decode(token, options={"verify_signature": False})
        if not token_data:
            raise AuthenticationFailed('Invalid token.')

        # expiry = datetime.fromisoformat(token_data['expiry'])
        # if timezone.now() > expiry:
        #     # Generate a new token and transfer the existing data
        #     new_token = str(uuid.uuid4())
        #     token_data['expiry'] = (timezone.now() + timedelta(hours=1)).isoformat()  # Update expiry or adjust as needed
        #     auth_data[new_token] = token_data
            
        #     # Delete the old token
        #     del auth_data[token]
            
        #     # Save the updated auth_data back to the file
        #     file.seek(0)
        #     json.dump(auth_data, file)
        #     file.truncate()
            
        #     # Raise an authentication error with the new token, so the client knows they need to update
        #     raise AuthenticationFailed({'message': 'Token has expired. Use new token.', 'new_token': new_token})

        return (token_data, None)

    def authenticate_header(self, request):
        return 'Token'
