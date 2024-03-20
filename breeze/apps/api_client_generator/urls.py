from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .views import ApiClientGenerator
from .api.generate_react_api_client import GenerateReactApiClient
from .api.modify_intermediate_json import ModifyIntermediateJson 
urlpatterns = [
        path('generate-react-api-client/', csrf_exempt(GenerateReactApiClient.as_view())),
        path('convert-starndard-json/<str:collectionType>', csrf_exempt(ApiClientGenerator.as_view())),
        path('modified-intermediate-json/', csrf_exempt(ModifyIntermediateJson.as_view())),
]

