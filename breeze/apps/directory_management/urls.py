from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .views import AddNode
from .api.delete_node import DeleteNode
from .api.get_folder_structure_config import GetFolderConfig
urlpatterns = [
    path("add-node",csrf_exempt(AddNode.as_view())),
    path("delete-node/<str:node_id>", csrf_exempt(DeleteNode.as_view())),
    path("folder-config",csrf_exempt(GetFolderConfig.as_view()))
]