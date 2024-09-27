from django.urls import path
from .views import manage_routes

urlpatterns = [
    path('add/', manage_routes.add_update_route),
    path('get/', manage_routes.get_routes),
    path('update/', manage_routes.add_update_route),
    path('delete/', manage_routes.delete_route),
]