from django.urls import path
from .views import GetComponents, GetComponentConfig 
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
        path('get-components/', csrf_exempt(GetComponents.as_view())),
        path('get-component-config/', csrf_exempt(GetComponentConfig.as_view()))
]

