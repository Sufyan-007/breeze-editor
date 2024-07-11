from django.views import View
from django.http import JsonResponse
import json, os
from common.utils.app_consts import CONFIG_PATH

class FolderPath(View):
    def post(self,request,projectName):
        try:
            body = json.loads(request.body)
            node_id = body.get('nodeId')
            
            if not node_id:
                return JsonResponse({'error': 'Node ID is required'}, status=400)
            
            try:
                config_path = os.path.join(CONFIG_PATH, projectName, 'directory_management.json')
                with open(config_path, 'r') as file:
                    data= json.load(file)
            except FileNotFoundError:
                return JsonResponse({'error': 'Configuration file not found'}, status=404)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Error decoding JSON file'}, status=500)
            
            #find the node with provided node_id
            node = data.get(node_id)
            
            if not node:
                return JsonResponse({'error':'Node not found'},status=404)
            
            # Construct the folder path based on lineage
            lineage = node.get('lineage', [])
            path_parts = [data[parent_id]['name'] for parent_id in lineage if parent_id in data]
            path_parts.append(node['name'])  # Add the current node's name
            folder_path = os.path.join(*path_parts)
            print(folder_path,"folder_path")

            return JsonResponse({'folderPath': folder_path})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)