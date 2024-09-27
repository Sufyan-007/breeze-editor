from django.urls import path
from .views.generate_code import generate_code,generate_service_files

urlpatterns = [
    path('exec/', generate_code),
    path('generate-react-api-client/<str:type>/', generate_service_files),

]

# api-client-generator/generate-react-api-client