from django.urls import path
from .views import ConfigWriter
from .api.write_component import WriteComponent
from .api.write_component_html import WriteComponentHtml
from ..configuration_reader.api.retrive_component import ReriveComponent
from django.views.decorators.csrf import csrf_exempt
from .api.write_service import WriteService

urlpatterns = [
        path('app-config', csrf_exempt(ConfigWriter.as_view())),
        path('write-component', csrf_exempt(WriteComponent.as_view())),
        path('retrive-component-config/<str:app>/<str:compId>', csrf_exempt(ReriveComponent.as_view())),        
        path('write-service', csrf_exempt(WriteService.as_view())),
        path('write-component-html', csrf_exempt(WriteComponentHtml.as_view()))
]

