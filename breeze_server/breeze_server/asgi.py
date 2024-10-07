"""
ASGI config for breeze_server project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
import apps.project_management.communication.routing

from dotenv import load_dotenv
settings_env = 'breeze_server.settings'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_env)
load_dotenv()

asgi_app = get_asgi_application()
application = ProtocolTypeRouter({
  "http": asgi_app,
  "websocket": AuthMiddlewareStack(
        URLRouter(
            apps.project_management.communication.routing.websocket_urlpatterns
        )
    ),
})