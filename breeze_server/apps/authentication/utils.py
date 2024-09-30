import os
import uuid
from django.utils import timezone
from datetime import timedelta

TOKEN_EXPIRY_DAYS = 7

def get_auth_file_path():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    auth_file_path = os.path.join(base_dir, 'authentication', 'auth.json')
    return auth_file_path


def generate_token():
    return str(uuid.uuid4())

def get_expiry_timestamp():
    return timezone.now() + timedelta(days=TOKEN_EXPIRY_DAYS)