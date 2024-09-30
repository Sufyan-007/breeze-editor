from django.urls import path
from .views.manage_api_client import generate_service_config,modify_function_config
from .views.manage_schema import add_or_edit_schema,delete_schema

urlpatterns = [
    path('convert-standard-json/<str:collectionType>/',generate_service_config ),
    path('edit-function-config/<str:operation>/', modify_function_config),
    path('add-schema/<str:moduleId>/', add_or_edit_schema),
    path('edit-schema/<str:schemaId>/<str:moduleId>/', add_or_edit_schema ),
    path('delete-schema/<str:schemaId>/<moduleId>/', delete_schema ),
]