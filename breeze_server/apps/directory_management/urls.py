from django.urls import path
from .views import manage_directory_json
from .views.directory_contents import get_file_content,delete_file,rename_file,move, add_folder

urlpatterns = [
    path('get/', manage_directory_json.get_directories),
    path('add-folder/',add_folder),
    path('get-code/<str:file_id>',get_file_content),
    path('delete/',delete_file),
    path('rename-file/',rename_file),
    path('move-file/',move),
]