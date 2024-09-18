from django.urls import path
from .views import handle_general_proj_apis as proj_apis
from .views import query_resource as que_re

urlpatterns = [
    path('get-all/', proj_apis.get_all, name='get_all_project'),
    path('add/', proj_apis.add, name='add_project'),
    path('delete/<str:param>', proj_apis.delete, name='delete_project'),
    # post request
    path('query_resource/<str:param>', que_re.manage_resource),
]



# /editor/custom-package-upload -> manage GET, POST, PUT, DELETE
# /editor/environment-settings -> manage all 4 env operations
# editor/resource-config -> like css, images, gif, ZIP file. if possible then all 4 Opearations for each 
# /editor/file-upload -> POST, DELETE