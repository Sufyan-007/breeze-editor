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

        # Find and delete the node
        if str(node_id) in data:
            del data[str(node_id)]

            # Save the updated configuration back to the JSON file
            with open(config_path, 'w') as file:
                json.dump(data, file, indent=4)

            return JsonResponse({'status': 'success', 'message': 'Node deleted successfully'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Node not found'}, status=404)