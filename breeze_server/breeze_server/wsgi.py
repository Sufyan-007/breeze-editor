"""
WSGI config for breeze_server project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from dotenv import load_dotenv
load_dotenv()

settings_env = 'breeze_server.settings'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_env)
    
application = get_wsgi_application()
