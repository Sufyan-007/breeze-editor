from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .views import RenameNode
from .views import GetFolderConfig
from .views import MoveNode

urlpatterns = [
    path("rename-node/<str:node_id>/<str:projectName>",RenameNode.as_view()),
    path("folder-config/<str:projectName>",GetFolderConfig.as_view()),
    path("move-node/<str:projectName>",MoveNode.as_view()),

]