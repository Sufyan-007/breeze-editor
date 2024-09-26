from django.urls import path
from .views.manage_api_client import generateServiceConfig,modifyFunctionConfig
from .views.manage_schema import addOrEditSchema,deleteSchema

urlpatterns = [
    path('convert-standard-json/<str:collectionType>/',generateServiceConfig ),
    path('edit-function-config/<str:operation>/', modifyFunctionConfig),
    path('add-schema/<str:moduleId>/', addOrEditSchema),
    path('edit-schema/<str:schemaId>/<str:moduleId>/', addOrEditSchema ),
    path('delete-schema/<str:schemaId>/<moduleId>/', deleteSchema ),
]