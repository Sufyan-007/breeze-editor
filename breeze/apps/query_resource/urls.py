from django.urls import path
from .views import QueryResource , GetVersion

urlpatterns = [
    path('get-query-resource-config/<str:projectName>/',QueryResource.as_view()),
    path('get-version/<str:projectName>/',GetVersion.as_view())
]