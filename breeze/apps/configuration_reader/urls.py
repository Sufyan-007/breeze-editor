from django.urls import path
from .views import GetComponents, GetComponentConfig 
from django.views.decorators.csrf import csrf_exempt
from .api.retrive_component import ReriveComponent
from .api.retrive_components import ReriveComponents

urlpatterns = [
        ## this APIs are for common custom global components shared by each project
        path('get-global-components/', csrf_exempt(GetComponents.as_view())),
        path('get-global-component-config/', csrf_exempt(GetComponentConfig.as_view())),

        ## this APIs are for project corrosponding custom components 
        path('get-components/', csrf_exempt(ReriveComponents.as_view())),
        path('get-component-config/', csrf_exempt(ReriveComponent.as_view()))

]

