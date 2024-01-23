from django.urls import path

from django.urls import path
from .views import GenerateApp

urlpatterns = [
        path('generate-app/', GenerateApp.as_view()),
]

