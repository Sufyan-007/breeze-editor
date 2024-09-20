"""breeze_server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Django API 4",
        default_version='v1',
        description="Welcome to the Django Sample Application API documentation",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/project/', include('apps.project_management.urls')),
    path('api/code-gen/', include('apps.code_generator.urls')),
    path('api/config-editor/<str:param>/',include('apps.project_config_management.urls')),
    path('api/auth/',include('apps.authentication.urls')),
    path('api/swagger', schema_view.with_ui('swagger', cache_timeout=0),name='schema-swagger-ui'),
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0),name='schema-swagger-ui'),
    path('cached/swagger/', schema_view.with_ui('swagger', cache_timeout=None), name='cschema-swagger-ui'),

]


# create get-project/id - /editor/read-app-basic-config
# query_resource - [
    # /editor/get-components/, 
    # /config-reader/get-global-components
    # /editor/get-global-html-config/, 
    # /config-reader/get-state-vars/
    # /editor/read-router-config
    # /editor/read-services
    # /editor/read-redux-store 
    # /editor/read-reducers/
    # .../editor/read-services


