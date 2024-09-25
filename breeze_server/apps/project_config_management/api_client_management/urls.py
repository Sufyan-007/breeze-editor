from django.urls import path
from .views.manage_api_client import generateServiceConfig

urlpatterns = [
    path('convert-standard-json/<str:collectionType>/',generateServiceConfig ),
]