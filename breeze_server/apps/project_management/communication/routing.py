# routing.py
from django.urls import path
from .consumers import EchoConsumer

websocket_urlpatterns = [
    path(r'ws/project-progress/', EchoConsumer.as_asgi()),
    path(r'ws/app-status/', EchoConsumer.as_asgi()),
    path(r'ws/external-comp-status/',EchoConsumer.as_asgi())
]
