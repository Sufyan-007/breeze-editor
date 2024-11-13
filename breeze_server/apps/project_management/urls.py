from django.urls import path
from .views import handle_general_proj_apis as proj_apis
from .views import query_resource as que_re
from .views import swagger_template as swag_temp
from .views import env_apis as env_manage
from .communication import consumers
from .views.custom_uploads import add_custom_package
from .views.custom_uploads import get_custom_packages
from .views.custom_uploads import delete_custom_package
from .views.custom_uploads import set_component_config
from .views.third_party_dependency import (add_third_party_dependency, delete_third_party_dependency, update_third_party_dependency, get_third_party_dependency)
from .views.project_status import get_port
from .views import file_handle as file_handle

urlpatterns = [
    path('get-all/', proj_apis.get_all, name='get_all_project'),
    path('get/<str:project_id>/', proj_apis.get_a_project, name='get_a_project'),
    path('add/', proj_apis.add, name='add_project'),
    path('delete/<str:project_id>/', proj_apis.delete, name='delete_project'),
    # post request
    path('query_resource/<str:param>/', que_re.manage_resource),
    path('get-env-settings/<str:project_id>/', env_manage.get_environment_config),
    path('add-env-settings/<str:project_id>/', env_manage.add_env_config),
    path('update-env-settings/<str:project_id>/', env_manage.update_env_config),
    path('delete-env-settings/<str:project_id>/', env_manage.delete_env_config),
    path('set-proj-env/<str:project_id>/', env_manage.set_env),
    path('get-metadata/<str:project_id>/', proj_apis.get_proj_metadata),
    path('custom-package-upload/<str:projectName>', add_custom_package),
    path('custom-package/<str:projectName>', get_custom_packages),
    path('custom-package-delete/<str:projectName>', delete_custom_package),
    path('set-component-configuration/<str:projectName>',set_component_config),
    
    path('get-port/<str:project_id>',get_port),
    # third party dependencies
    path('add-third-party-dependency/<str:projectName>/', add_third_party_dependency),
    path('update-third-party-dependency/<str:projectName>/', update_third_party_dependency),
    path('get-third-party-dependency/<str:projectName>/', get_third_party_dependency),
    path('delete-third-party-dependency/<str:projectName>/', delete_third_party_dependency),
    
    # file upload
    path('upload-file/<str:project_id>/', file_handle.upload_file),
    path('download-file/<str:project_id>/<str:fileId>/', file_handle.download_file),
    path('delete-file/<str:project_id>/', file_handle.delete_file),
]



# /editor/custom-package-upload -> manage GET, POST, PUT, DELETE
# /editor/environment-settings -> manage all 4 env operations
# editor/resource-config -> like css, images, gif, ZIP file. if possible then all 4 Opearations for each 
# /editor/file-upload -> POST, DELETE