from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .views import ApiClientGenerator

urlpatterns = [
        path('convert-starndard-json/<str:collectionType>', csrf_exempt(ApiClientGenerator.as_view())),
]

