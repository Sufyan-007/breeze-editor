from django.urls import path
from .views import GetComponents, GetComponentConfig 

urlpatterns = [
        path('get-components/', GetComponents.as_view()),
        path('get-component-config/', GetComponentConfig.as_view())
]

