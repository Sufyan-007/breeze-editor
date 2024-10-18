from django.urls import path
from .views.generate_code import generate_code,generate_service_files
from .views.code_indexing import get_config_by_index

urlpatterns = [
    path('exec/', generate_code),
    path('code-indexing/',get_config_by_index),
    path('generate-react-api-client/<str:type>/', generate_service_files),

]

# api-client-generator/generate-react-api-client