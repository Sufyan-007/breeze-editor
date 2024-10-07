from django.urls import path
from .views import manage_directory_json
from .views.get_file_contents import get_file_content

urlpatterns = [
    path('get/', manage_directory_json.get_directories),
    path('get-code/<str:file_id>',get_file_content)
]