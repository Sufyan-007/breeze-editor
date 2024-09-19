from django.urls import path
from .views import generate_code

urlpatterns = [
    path('exec/', generate_code.generate_code),
]

# api-client-generator/generate-react-api-client