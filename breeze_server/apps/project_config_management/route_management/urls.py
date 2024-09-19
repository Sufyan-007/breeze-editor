from django.urls import path
from .views.manage_routes import manage_routes

urlpatterns = [
    path('manage-routes/', manage_routes),
]