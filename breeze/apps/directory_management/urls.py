from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .views import AddNode
from .api.delete_node import DeleteNode
from .api.rename_node import RenameNode
from .api.get_folder_structure_config import GetFolderConfig
from .api.move_node import MoveNode


urlpatterns = [
    path("add-node/<str:projectName>",csrf_exempt(AddNode.as_view())),
    path("delete-node/<str:node_id>/<str:projectName>", csrf_exempt(DeleteNode.as_view())),
    path("rename-node/<str:node_id>/<str:projectName>",csrf_exempt(RenameNode.as_view())),
    path("folder-config/<str:projectName>",csrf_exempt(GetFolderConfig.as_view())),
    path("move-node/<str:projectName>",csrf_exempt(MoveNode.as_view())),
    
]