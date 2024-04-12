from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .views import ApiClientGenerator
from .api.generate_react_api_client import GenerateReactApiClient
from .api.modify_intermediate_json import ModifyIntermediateJson 
from .api.append_auth_api import AppendAuthApi
from .api.retrieve_auth_file import RetrieveAuthFile
urlpatterns = [
        path('generate-react-api-client/<str:type>', csrf_exempt(GenerateReactApiClient.as_view())),
        path('convert-starndard-json/<str:collectionType>', csrf_exempt(ApiClientGenerator.as_view())),
        path('modified-intermediate-json/', csrf_exempt(ModifyIntermediateJson.as_view())),
        path('fetch-all-intermediates/<str:projectName>/<str:files_only>', csrf_exempt(ApiClientGenerator.as_view())),
        path('append-to-auth-api/<str:operation>', csrf_exempt(AppendAuthApi.as_view())),
        path('fetch-auth-file/<str:projectName>', csrf_exempt(RetrieveAuthFile.as_view())),
]

