from django.views import View
from django.http import JsonResponse
import json, uuid , os

class AddNode(View):
    
    def post(self,request,projectName):
      if request.method == 'POST':
        try:
            data=json.loads(request.body)
            parentId = data["parentId"]
            node_type=data["type"]
            lineage= data["lineage"]
            tag=data["tag"]
            config_path = f"/home/varanpreet/Desktop/breezeui/configurations/{projectName}/directory_management.json"
            with open(config_path,"r") as file:
                config = json.load(file)
            
            # Ask the user for a name, defaulting to "New File" or "New Folder"
            name = data.get("name", None)
            if not name:
                name = "New Folder" if node_type == "DIRECTORY" else "New File"
           # Generate a new ID for the node
            new_id = str(uuid.uuid4())

            new_lineage = lineage + [parentId]
            # Create the new node
            new_node = {
                "name": name,
                "lineage": new_lineage,
                "id": new_id,
                "tag": tag.upper(),
                "type": node_type.upper(),
            }
        
        # Add the new node to the configuration
            config[new_id] = new_node
        
            with open(config_path, 'w') as file:
                json.dump(config, file, indent=2)
        #update component_config.json
            component_config_path = f"/home/varanpreet/Desktop/breezeui/configurations/{projectName}/component_config.json"
            with open(component_config_path, "r") as component_file:
                component_config = json.load(component_file)
                     
            new_component_node = {
                    "name": new_node["name"],
                    "id":new_node["name"].upper(),
                    "file_id": new_node["id"],
                    "imports": {"components": [], "other": []},
                    "propsVars": [],
                    "resources": [],
                    "html": {"_id": new_id},
                    "wrapper_store": None,
                    "html_elements": {
                        new_id: {
                            "type": "Element",
                            "elementType": "HTML",
                            "typeId": "DIV",
                            "tagName": "div",
                            "attributes": {
                                "className": {"type": "LITERAL", "value": ""},
                                "id": {"type": "LITERAL", "value": ""}
                            },
                            "children": [{"_id": f"{new_id}-0"}]
                        },
                        f"{new_id}-0": {"type": "text", "text": "Hello world"}
                    }
            }
            print(new_component_node,"component config added")
            component_config[new_id] = new_component_node
            
            with open(component_config_path, 'w') as component_file:
                    json.dump(component_config, component_file, indent=2)
                    
            return JsonResponse(new_node, status=201)
        
        except (json.JSONDecodeError, KeyError) as e:
            return JsonResponse({'error': str(e)}, status=400)
        
      return JsonResponse({'error': 'Invalid HTTP method'}, status=405)
