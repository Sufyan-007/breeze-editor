from django.views import View
from django.http import JsonResponse
import json

class MoveNode(View):
    def post(self, request,projectName):
        try:
            data = json.loads(request.body)
            drag_id = data.get("dragId")
            destination_id = data.get("destinationId")

            if not drag_id or not destination_id:
                return JsonResponse({'status': 'error', 'message': 'Missing required parameters'}, status=400)

            config_path = f"/home/varanpreet/Desktop/breezeui/configurations/{projectName}/directory_management.json"

          
            with open(config_path, 'r') as file:
                config_data = json.load(file)

           
            if str(drag_id) not in config_data or str(destination_id) not in config_data:
                return JsonResponse({'status': 'error', 'message': 'Invalid drag_id or destination_id'}, status=404)

           
            def build_parent_child_map(config_data):
                parent_child_map = {}
                for node_id, node in config_data.items():
                    for parent_id in node['lineage']:
                        if parent_id not in parent_child_map:
                            parent_child_map[parent_id] = []
                        parent_child_map[parent_id].append(node_id)
                return parent_child_map

            parent_child_map = build_parent_child_map(config_data)

            def update_lineage_and_children(node_id, new_lineage):
                node = config_data[str(node_id)]
                node['lineage'] = new_lineage
                for child_id in parent_child_map.get(node_id, []):
                    update_lineage_and_children(child_id, new_lineage + [node_id])

            dragged_node = config_data[str(drag_id)]
            destination_node = config_data[str(destination_id)]
            new_lineage = destination_node['lineage'] + [destination_id]

            update_lineage_and_children(drag_id, new_lineage)

            
            with open(config_path, 'w') as file:
                json.dump(config_data, file, indent=4)

            return JsonResponse({'status': 'success', 'message': 'Node moved successfully'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
