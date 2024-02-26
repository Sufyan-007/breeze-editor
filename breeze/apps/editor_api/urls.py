from django.urls import path
from .views import ConfigReader
from .views import ComponentWriter
from .views import RoutingReader
from .views import NewComponentWriter
from .views import RoutingWriter
from .views import ProjectConfig
from .views import ReducerConfig
from .views import StoreConfig
urlpatterns = [
        path('read-config/<str:param>/',ConfigReader.as_view()),
        path('write-config/<str:param>/',ComponentWriter.as_view()),
        path('read-router-config/<str:param>/',RoutingReader.as_view()),
        path('add-component/<str:param>/',NewComponentWriter.as_view()),
        path('add-route/<str:param>/',RoutingWriter.as_view()),
        path('read-reducers/<str:param>/',ReducerConfig.as_view()),
        path('write-reducers/<str:param>/',ReducerConfig.as_view()),
        path('read-redux-store/<str:param>/',StoreConfig.as_view()),
        path('write-redux-store/<str:param>/',StoreConfig.as_view()),
        path('all-projects/',ProjectConfig.as_view()),
        path('new-project/',ProjectConfig.as_view()),
        path('update-project/<str:param>/',ProjectConfig.as_view())
]

