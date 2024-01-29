from django.urls import path
from .views import ConfigReader
from .views import ComponentWriter
from .views import RoutingReader
from .views import NewComponentWriter
from .views import RoutingWriter
urlpatterns = [
        path('read-config/<str:param>/',ConfigReader.as_view()),
        path('write-config/<str:param>/',ComponentWriter.as_view()),
        path('read-router-config/<str:param>/',RoutingReader.as_view()),
        path('add-component/<str:param>/',NewComponentWriter.as_view()),
        path('add-route/<str:param>/',RoutingWriter.as_view())
]

