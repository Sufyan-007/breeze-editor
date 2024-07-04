from django.views import View
from django.http import JsonResponse
import json, os

class DeleteNode(View):
    def delete(self, request, node_id,projectName):

        config_path = f"/home/varanpreet/Desktop/breezeui/configurations/{projectName}/directory_management.json"
        component_config_path = f"/home/varanpreet/Desktop/breezeui/configurations/{projectName}/component_config.json"
        
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

        # Find and delete the node and its descendants from directory_management.json
        if str(node_id) in data:
            nodes_to_delete = [str(node_id)]
            nodes_to_delete.extend(find_all_descendants(str(node_id), data))

            for node in nodes_to_delete:
                if node in data:
                    del data[node]

            # Save the updated configuration back to the JSON file
            with open(config_path, 'w') as file:
                json.dump(data, file, indent=4)
                
            # Load and update component configuration if the deleted node is a component
            try:
                with open(component_config_path, 'r') as component_file:
                    component_data = json.load(component_file)
            except FileNotFoundError:
                component_data = {}

            # Check if the node_id exists in component_config.json and delete it
            if str(node_id) in component_data:
                del component_data[str(node_id)]

                # Save the updated component configuration back to the JSON file
                with open(component_config_path, 'w') as component_file:
                    json.dump(component_data, component_file, indent=4)

            
            return JsonResponse({'status': 'success', 'message': 'Node and its children deleted successfully'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Node not found'}, status=404)
