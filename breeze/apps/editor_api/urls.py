from django.urls import path
from .views import AppBasicConfigReader, ConfigReader, GetAttributes, SchemaMapper
from .views import ComponentWriter
from .views import RoutingReader
from .views import NewComponentWriter
from .views import RoutingWriter
from .views import ChildRouteHandler
from .views import ProjectConfig
from .views import ReducerConfig
from .views import StoreConfig
from .views import ServiceConfig
from .views import ProjectDetailsConfig
from .views import AppStartup
from .core import consumers
from .views import ComponentReader
from .views import ComponentPath
# from .views import CSSConfig
# from .views import CSSConfigReader
# from .views import CSSFileDownloadView
# from .views import CSSFileUpload
from .views import HtmlConfigReader
from .views import HtmlConfigWriter
# from .views import LifeCycleConfigWriter
# from .views import FunctionConfigWriter
# from .views import VariablesConfigWriter
from .views import AddPackage
from .views import ComponentConfigWriter
from .views import ComponentConfigOrder
from .views import GetResources
from .views import StylesConfig
from .views import FileHandle
from .views import ResourceConfig
from .views import EnvironementSettings
from .views import SetEnvironment
from .views import ASTParser
from .views import CustomPackage

urlpatterns = [
        path('read-config/<str:param>/',ConfigReader.as_view()),
        path('read-app-basic-config/<str:param>/',AppBasicConfigReader.as_view()),
        path('write-config/<str:param>/',ComponentWriter.as_view()),
        path('read-router-config/<str:param>/',RoutingReader.as_view()),
        path('add-component/<str:param>/',NewComponentWriter.as_view()),
       
        path('handle-base-route/<str:param>/',RoutingWriter.as_view()),
        path('handle-child-route/<str:param>/',ChildRouteHandler.as_view()),
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
        path('get-file-path/<str:param>/',ComponentPath.as_view()),
        path('ws/yourpath/', consumers.EchoConsumer.as_asgi()),
        
        ## New APIs 
        path('get-html-config/', HtmlConfigReader.as_view()),
        path('update-html-config/', HtmlConfigWriter.as_view()),
        path('update-component-config/', ComponentConfigWriter.as_view()),
        path('reorder-component-actions/', ComponentConfigOrder.as_view()),
        path('project-styles/', StylesConfig.as_view()),
        
        ##Package json
        path('add-package/<str:projectName>', AddPackage.as_view()),
        path('list-dependencies/<str:projectName>', AddPackage.as_view()),
        path('edit-dependency/<str:projectName>', AddPackage.as_view()),
        path('delete-dependency/<str:projectName>', AddPackage.as_view()),
        
        ## Attributes
        path("get-attributes/",GetAttributes.as_view()),
        path("get-resources/",GetResources.as_view()),
        
        # FUNCTION GENERATION TESTING
        path("ast-parser/",ASTParser.as_view()),
        path("schema-mapper/",SchemaMapper.as_view()),
        
        # Resources 
        path('file-upload/', FileHandle.as_view()),
        path('file-upload/<str:projectName>', FileHandle.as_view()),
        path('file-upload/<str:projectName>/<str:fileId>', FileHandle.as_view()),

        path('resource-config/<str:projectName>',ResourceConfig.as_view()),

        path('environment-settings/<str:projectName>', EnvironementSettings.as_view()),
        path('set-environment/<str:projectName>', SetEnvironment.as_view()),
        
        #custom packages 
        path('custom-package-upload/<str:projectName>',CustomPackage.as_view()),
]

