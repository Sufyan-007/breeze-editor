from django.urls import path
from .views import file_views
urlpatterns = [
    path('add/',file_views.add),
    path('update/',file_views.update),
    path('add-statement/',file_views.add_statements),
    path('get-statement/',file_views.get_statement_config),
    path('update-statement/',file_views.update_statements),
    path('delete-statement/',file_views.delete_statement),
    path('get-imports/',file_views.get_imports),
    path('update-imports/',file_views.update_imports),
    path('get-exports/',file_views.get_exports),
    path('update-exports/',file_views.update_exports),
    
]

# api-client-generator/generate-react-api-client