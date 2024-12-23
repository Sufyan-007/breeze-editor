from django.urls import path
from .views import entity_views
urlpatterns = [
    path('get-entity-config-by-id/<str:entity_id>/',entity_views.get_entity_config_by_id),
    path('get-entity-config/',entity_views.get_entity_config),
]
