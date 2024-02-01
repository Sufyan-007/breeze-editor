from django.urls import path
from .views import ConfigWriter

urlpatterns = [
        path('app-config/', ConfigWriter.as_view()),
]

