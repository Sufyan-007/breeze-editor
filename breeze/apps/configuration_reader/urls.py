from django.urls import path
from .views import GetComponents, GetComponentConfig, ReadFromPath
from django.views.decorators.csrf import csrf_exempt
from .api.retrive_component import ReriveComponent
from .api.retrive_components import ReriveComponents

urlpatterns = [
        
        ## this APIs are for common custom global components shared by each project
        path('get-global-components/', csrf_exempt(GetComponents.as_view())),
        path('get-global-component-config/', csrf_exempt(GetComponentConfig.as_view())),

        ## this APIs are for project corrosponding custom components 
        path('get-components/<str:app>', csrf_exempt(ReriveComponents.as_view())),
        path('get-component-config/<str:app>/<str:comp_id>', csrf_exempt(ReriveComponent.as_view())),

        # path('get-components/', csrf_exempt(GetComponents.as_view())),
        # path('get-component-config/', csrf_exempt(GetComponentConfig.as_view())),
        path('get-from-path/<str:filepath>/', csrf_exempt(ReadFromPath.as_view())),
      

]

