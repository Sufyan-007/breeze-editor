from django.urls import path
from .views.generate_code import generate_code,generate_service_files,generate_function_code
from .views.code_indexing import get_config_by_index

urlpatterns = [
    path('exec/', generate_code),
    path('code-indexing/',get_config_by_index),
    path('generate-react-api-client/<str:type>/', generate_service_files),
    path('generate-function-code/',generate_function_code)

]

# api-client-generator/generate-react-api-client