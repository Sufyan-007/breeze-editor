from django.urls import path
from .views import manage_routes

urlpatterns = [
    path('get-all-full-paths/', manage_routes.get_all_routes),
    path('add/', manage_routes.add_route),
    path('update/', manage_routes.update_route),
    path('delete/', manage_routes.delete_route),
]