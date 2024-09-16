from django.urls import path
from .views import handle_general_proj_apis as proj_apis

urlpatterns = [
    path('get-all/', proj_apis.get_all, name='get_all_project'),
    path('add/', proj_apis.add, name='add_project'),
    path('delete/<str:param>', proj_apis.delete, name='delete_project'),
]