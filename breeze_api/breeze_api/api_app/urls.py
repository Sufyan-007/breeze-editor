from django.urls import path
from .views import ConfigWriter

urlpatterns = [
    path('config-writer/', ConfigWriter.as_view()),
]

