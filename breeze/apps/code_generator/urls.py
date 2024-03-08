from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .views import GenerateApp

urlpatterns = [
        path('generate-app/', csrf_exempt(GenerateApp.as_view())),
]

