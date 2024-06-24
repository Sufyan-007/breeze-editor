from django.views import View
from django.http import JsonResponse
import json, os

class RenameNode(View):
    def post(self, request, node_id):
        try:
            data = json.loads(request.body)
            print(data,"data received")
            new_name = data
            print(new_name,"new name")

            if not new_name:
                return JsonResponse({'status': 'error', 'message': 'New name not provided'}, status=400)

            config_path = "/home/varanpreet/Desktop/breezeui/configurations/creator/directory_management.json"

            # Load the current folder configuration from the JSON file
            with open(config_path, 'r') as file:
                config_data = json.load(file)

            # Find and rename the node
            if str(node_id) in config_data:
                config_data[str(node_id)]['name'] = new_name

                # Save the updated configuration back to the JSON file
                with open(config_path, 'w') as file:
                    json.dump(config_data, file, indent=4)

                return JsonResponse({'status': 'success', 'message': 'Node renamed successfully', 'config':config_data})
            else:
                return JsonResponse({'status': 'error', 'message': 'Node not found'}, status=404)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)