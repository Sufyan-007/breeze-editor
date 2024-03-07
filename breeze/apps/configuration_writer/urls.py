from django.urls import path
from .views import ConfigWriter
from .api.write_component import WriteComponent
from .api.write_component_html import WriteComponentHtml
from .api.retrive_component import ReriveComponent

from .api.write_service import WriteService

urlpatterns = [
        path('app-config', ConfigWriter.as_view()),
        path('write-component', WriteComponent.as_view()),
        path('retrive-component-config/<str:app>/<str:compId>', ReriveComponent.as_view()),        
        path('write-service', WriteService.as_view()),
        path('write-component-html', WriteComponentHtml.as_view())
]

