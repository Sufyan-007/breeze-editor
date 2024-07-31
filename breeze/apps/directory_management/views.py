
from rest_framework.views import APIView
from django.http import JsonResponse
import json, uuid , os
from common.utils.app_consts import CONFIG_PATH
from .core.directory_management_service import DirectoryManagementGenerator
class AddNode(APIView):
    
    def post(self,request,projectName):
      if request.method == 'POST':
        try:
            data=json.loads(request.body)
           
            parentId = data["parentId"]
            node_type=data["type"]
            lineage= data["lineage"]
            tag=data["tag"]
            name = data.get("name", None)
            
            directory_manager = DirectoryManagementGenerator(projectName)
            new_node = directory_manager.add_node_to_config(parentId, node_type, lineage, tag, name)
                        

            return JsonResponse(new_node, status=201)
        
        except (json.JSONDecodeError, KeyError) as e:
            return JsonResponse({'error': str(e)}, status=400)
        
      return JsonResponse({'error': 'Invalid HTTP method'}, status=405)
