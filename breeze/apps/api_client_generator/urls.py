from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .views import ApiClientGenerator
from .api.generate_react_api_client import GenerateReactApiClient
urlpatterns = [
        path('generate-react-api-client/', csrf_exempt(GenerateReactApiClient.as_view())),
        path('convert-starndard-json/<str:collectionType>', csrf_exempt(ApiClientGenerator.as_view()))
]

