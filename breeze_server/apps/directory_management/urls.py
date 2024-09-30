from django.urls import path
from .views import manage_directory_json

urlpatterns = [
    path('get/', manage_directory_json.get_directories)
]