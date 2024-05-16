from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .views import ApiClientGenerator
from .api.generate_react_api_client import GenerateReactApiClient
from .api.modify_intermediate_json import ModifyIntermediateJson
from .api.append_auth_api import AppendAuthApi
from .api.transfer_to_auth_api import TransferToAuthApi
from .api.retrieve_auth_file import RetrieveAuthFile
from .api.retrive_api_config import RetrieveApiConfig
urlpatterns = [
        path('generate-react-api-client/<str:type>', csrf_exempt(GenerateReactApiClient.as_view())),
        path('convert-standard-json/<str:collectionType>/<str:appName>', csrf_exempt(ApiClientGenerator.as_view())),
        path('modified-intermediate-json/<str:projectName>/<str:filename>/<str:operation>', csrf_exempt(ModifyIntermediateJson.as_view())),
        path('fetch-all-intermediates/<str:projectName>/<str:files_only>', csrf_exempt(ApiClientGenerator.as_view())),
        path('fetch-api-config/<str:projectName>/<str:filename>/<str:apiId>', csrf_exempt(RetrieveApiConfig.as_view())),
        path('append-to-auth-api/<str:operation>/<str:projectName>', csrf_exempt(AppendAuthApi.as_view())),
        path('transfer-to-auth-api/<str:project_name>', csrf_exempt(TransferToAuthApi.as_view())),
        path('fetch-auth-file/<str:projectName>/<str:apiId>', csrf_exempt(RetrieveAuthFile.as_view())),
]