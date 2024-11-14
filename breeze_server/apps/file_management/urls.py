from django.urls import path
from .views import file_views
urlpatterns = [
    path('add/',file_views.add),
    path('update/',file_views.update),
    
]

# api-client-generator/generate-react-api-client