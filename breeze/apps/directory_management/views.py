from django.views import View
from django.http import JsonResponse
import json, uuid , os

class AddNode(View):
    
    def post(self,request):
      if request.method == 'POST':
        try:
            data=json.loads(request.body)
            parentId = data["parentId"]
            node_type=data["type"]
            lineage= data["lineage"]
            tag=data["tag"]
            config_path = "/home/varanpreet/Desktop/breezeui/configurations/creator/directory_management.json"
            with open(config_path,"r") as file:
                config = json.load(file)
            
           # Generate a new ID for the node
            new_id = str(uuid.uuid4())

            new_lineage = lineage + [parentId]
            # Create the new node
            new_node = {
                "name": "New Folder" if node_type == "DIRECTORY" else "New File",
                "lineage": lineage,
                "id": new_id,
                "tag": tag.upper(),
                "type": node_type.upper(),
            }
        
        # Add the new node to the configuration
            config[new_id] = new_node
        
            with open(config_path, 'w') as file:
                json.dump(config, file, indent=2)

            return JsonResponse(new_node, status=201)
        except (json.JSONDecodeError, KeyError) as e:
            return JsonResponse({'error': str(e)}, status=400)
      return JsonResponse({'error': 'Invalid HTTP method'}, status=405)
