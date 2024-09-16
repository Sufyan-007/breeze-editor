from rest_framework.views import APIView
from django.http import JsonResponse
import json
from common.utils.app_consts import CONFIG_PATH
from ..core.directory_management_service import DirectoryManagementGenerator
class MoveNode(APIView):
    def post(self, request, projectName):
        try:
            data = json.loads(request.body)
            drag_id = data.get("dragId")
            destination_id = data.get("destinationId")

            if not drag_id or not destination_id:
                return JsonResponse({'status': 'error', 'message': 'Missing required parameters'}, status=400)

            directory_manager= DirectoryManagementGenerator(projectName)
            config_data= directory_manager.load_config(directory_manager.directory_config_path)
          
           
            if str(drag_id) not in config_data or str(destination_id) not in config_data:
                return JsonResponse({'status': 'error', 'message': 'Invalid drag_id or destination_id'}, status=404)
            
            parent_child_map = directory_manager.build_parent_child_map(config_data)

            dragged_node = config_data[str(drag_id)]
            destination_node = config_data[str(destination_id)]
            new_lineage = destination_node['lineage'] + [destination_id]

    
            old_base_path = directory_manager.construct_path_from_new_lineage(config_data, dragged_node['lineage'])
            new_base_path = directory_manager.construct_path_from_new_lineage(config_data, new_lineage)

            directory_manager.move_files_and_folders(config_data, parent_child_map, drag_id, old_base_path, new_base_path)
            directory_manager.update_lineage_and_children(config_data, parent_child_map, drag_id, new_lineage)
           
            directory_manager.save_config(directory_manager.directory_config_path, config_data)

            return JsonResponse({'status': 'success', 'message': 'Node moved successfully'})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
