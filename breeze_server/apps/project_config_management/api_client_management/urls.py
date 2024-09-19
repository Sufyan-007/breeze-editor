from django.urls import path
from .views import manage_api_client

urlpatterns = [
    path('manage-api-client/', manage_api_client.manage_api_client),
]