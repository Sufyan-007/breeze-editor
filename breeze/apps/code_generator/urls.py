from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .views import GenerateApp, GenerateThirdPartyConfig

urlpatterns = [
        path('generate-app/', csrf_exempt(GenerateApp.as_view())),
        path('generate-tp-config/', csrf_exempt(GenerateThirdPartyConfig.as_view()))
]

