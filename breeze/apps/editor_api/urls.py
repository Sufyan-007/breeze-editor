from django.urls import path
from .views import AppBasicConfigReader, ConfigReader
from .views import ComponentWriter
from .views import RoutingReader
from .views import NewComponentWriter
from .views import RoutingWriter
from .views import ProjectConfig
from .views import ReducerConfig
from .views import StoreConfig
from .views import ServiceConfig
from .views import ProjectDetailsConfig
from .views import AppStartup
from .core import consumers
from .views import ComponentReader
from .views import CSSConfig
from .views import CSSConfigReader
from .views import CSSFileDownloadView
from .views import CSSFileUpload
from .views import HtmlConfigReader
from .views import HtmlConfigWriter
from .views import LifeCycleConfigWriter
from .views import FunctionConfigWriter
from .views import VariablesConfigWriter

urlpatterns = [
        path('read-config/<str:param>/',ConfigReader.as_view()),
        path('read-app-basic-config/<str:param>/',AppBasicConfigReader.as_view()),
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
        path('update-project/<str:param>/',ProjectConfig.as_view()),
        path('read-services/<str:param>/',ServiceConfig.as_view()),
        path('write-services/<str:param>/',ServiceConfig.as_view()),
        path('delete-project/<str:param>/',ProjectConfig.as_view()),
        path('update-project-details/',ProjectDetailsConfig.as_view()),
        path('run-project/<str:param>/',AppStartup.as_view()),
        path('get-components/<str:param>/',ComponentReader.as_view()),
        path('ws/yourpath/', consumers.EchoConsumer.as_asgi()),
        path('add-css-content/', CSSConfig.as_view()),
        path('upload-css-file/', CSSFileUpload.as_view()),
        path('all-css-files/', CSSConfig.as_view()),
        path('update-css-file/', CSSConfig.as_view()),
        path('delete-css-file/<str:css_name>/', CSSConfig.as_view()),
        path('get-css-file/<str:css_name>/', CSSConfigReader.as_view()),
        path('css-file-download/<str:css_name>/', CSSFileDownloadView.as_view()),
        
        
        ## New APIs 
        path('get-html-config/', HtmlConfigReader.as_view()),
        path('update-html-config/', HtmlConfigWriter.as_view()),
        path('lifecycle/', LifeCycleConfigWriter.as_view()),
        path('variables/', VariablesConfigWriter.as_view()),
        
        
        ##Functions 
        path("update-function-config/",FunctionConfigWriter.as_view())
]

