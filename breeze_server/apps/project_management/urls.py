from django.urls import path
from .views import handle_general_proj_apis as proj_apis
from .views import query_resource as que_re
from .views import swagger_template as swag_temp
from .views import env_apis as env_manage
from .communication import consumers
from .views.custom_uploads import add_custom_package
from .views.custom_uploads import get_custom_packages
from .views.custom_uploads import delete_custom_package

urlpatterns = [
    path('get-all/', proj_apis.get_all, name='get_all_project'),
    path('get/<str:project_id>/', proj_apis.get_a_project, name='get_a_project'),
    path('add/', proj_apis.add, name='add_project'),
    path('delete/<str:project_id>/', proj_apis.delete, name='delete_project'),
    # post request
    path('query_resource/<str:param>/', que_re.manage_resource),
    path('environment-settings/<str:project_id>/', env_manage.get_env_config),
    path('set-environment/<str:project_id>/', env_manage.set_env),
    path('get-metadata/<str:project_id>/', proj_apis.get_proj_metadata),
    path('custom-package-upload/<str:projectName>', add_custom_package),
    path('custom-package/<str:projectName>', get_custom_packages),
    path('custom-package-delete/<str:projectName>', delete_custom_package),
    
]



# /editor/custom-package-upload -> manage GET, POST, PUT, DELETE
# /editor/environment-settings -> manage all 4 env operations
# editor/resource-config -> like css, images, gif, ZIP file. if possible then all 4 Opearations for each 
# /editor/file-upload -> POST, DELETE