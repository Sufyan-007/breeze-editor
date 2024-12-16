from django.urls import path
from .views.manage_api_client import generate_service_config,modify_function_config,transfer_to_auth,edit_module_title,get_response_token,add_module,delete_module_file_function
from .views.manage_schema import add_or_edit_schema,delete_schema, resolve_schemas,get_all_schemas,get_schema_by_id

urlpatterns = [
    path('convert-standard-json/<str:collectionType>/',generate_service_config ),
    path('transfer-to-auth/', transfer_to_auth ),
    path('edit-function-config/<str:operation>/', modify_function_config),
    path('edit-module-title/', edit_module_title),
    path('add-module/', add_module),#could be modified later for whole module editing functionality
    path('add-schema/', add_or_edit_schema), 
    path('edit-schema/', add_or_edit_schema ),
    path('delete-schema/', delete_schema ),
    path('retrieve-response-tokens/<str:moduleId>/<str:apiId>/', get_response_token ),
    path('resolve-schema/', resolve_schemas ),
    path('delete/', delete_module_file_function ), #for deleting module, file or function
    path("get-all-schemas/", get_all_schemas), 
    path("get-schema/<str:schema_id>/", get_schema_by_id), 

]