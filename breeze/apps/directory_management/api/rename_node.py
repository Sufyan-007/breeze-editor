from rest_framework.views import APIView
from django.http import JsonResponse
import json
from ..core.directory_management_service import DirectoryManagementGenerator

class RenameNode(APIView):
    def post(self, request, node_id, projectName):
        try:
            print("11111111111")
            data = json.loads(request.body)
            new_name = data.get('new_name', None)
            print(new_name, "new name 2222222222222")

            if not new_name:
                return JsonResponse({'status': 'error', 'message': 'New name not provided'}, status=400)

            directory_manager = DirectoryManagementGenerator(projectName)
            result = directory_manager.rename_node(node_id, new_name)

            if result['status'] == 'success':
                return JsonResponse(result)
            else:
                return JsonResponse(result, status=404 if result['status'] == 'error' else 500)

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
