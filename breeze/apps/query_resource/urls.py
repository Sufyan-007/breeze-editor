from django.urls import path
from .views import QueryResource

urlpatterns = [
    path('get-query-resource-config/<str:projectName>/',QueryResource.as_view())
]