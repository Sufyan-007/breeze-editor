from django.urls import path
from .views.generate_code import generate_code,generateServiceFiles

urlpatterns = [
    path('exec/', generate_code),
    path('generate-react-api-client/<str:type>/', generateServiceFiles),

]

# api-client-generator/generate-react-api-client