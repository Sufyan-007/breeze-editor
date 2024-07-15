from django.views import View
from django.http import JsonResponse
import json, os
from common.utils.app_consts import CONFIG_PATH

class RenameNode(View):
    def post(self, request, node_id,projectName):
        try:
            data = json.loads(request.body)
            new_name = data
            print(new_name,"new name")

            if not new_name:
                return JsonResponse({'status': 'error', 'message': 'New name not provided'}, status=400)

            config_path = os.path.join(CONFIG_PATH, projectName, 'directory_management.json')
            component_config_path = os.path.join(CONFIG_PATH, projectName,' component_config.json')
            # Load the current folder configuration from the JSON file
            with open(config_path, 'r') as file:
                config_data = json.load(file)

            # Find and rename the node
            if str(node_id) in config_data:
                config_data[str(node_id)]['name'] = new_name

                # Save the updated configuration back to the JSON file
                with open(config_path, 'w') as file:
                    json.dump(config_data, file, indent=4)
                
                 
                # Load component configuration from component_config.json
                try:
                    with open(component_config_path, 'r') as component_file:
                        component_data = json.load(component_file)
                except FileNotFoundError:
                    component_data = {}

                # Update the name in component_config.json if the node is a component
                if str(node_id) in component_data:
                    component_data[str(node_id)]['name'] = new_name

                    # Save the updated component configuration back to the JSON file
                    with open(component_config_path, 'w') as component_file:
                        json.dump(component_data, component_file, indent=4)

                return JsonResponse({'status': 'success', 'message': 'Node renamed successfully', 'config':config_data})
            else:
                return JsonResponse({'status': 'error', 'message': 'Node not found'}, status=404)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)