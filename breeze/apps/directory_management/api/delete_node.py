from django.views import View
from django.http import JsonResponse
import json, os

class DeleteNode(View):
    def delete(self, request, node_id):
        print("node id", node_id)
        config_path = "/home/varanpreet/Desktop/breezeui/configurations/creator/directory_management.json"

        # Load the current folder configuration from the JSON file
        with open(config_path, 'r') as file:
            data = json.load(file)

        def find_all_descendants(node_id, data):
            descendants = []
            for key, value in data.items():
                if 'lineage' in value and node_id in value['lineage']:
                    descendants.append(key)
                    descendants.extend(find_all_descendants(key, data))
            return descendants

        # Find and delete the node and its descendants
        if str(node_id) in data:
            nodes_to_delete = [str(node_id)]
            nodes_to_delete.extend(find_all_descendants(str(node_id), data))

            for node in nodes_to_delete:
                if node in data:
                    del data[node]

            # Save the updated configuration back to the JSON file
            with open(config_path, 'w') as file:
                json.dump(data, file, indent=4)

            return JsonResponse({'status': 'success', 'message': 'Node and its children deleted successfully'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Node not found'}, status=404)
