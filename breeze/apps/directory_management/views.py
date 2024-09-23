from rest_framework.views import APIView
from django.http import JsonResponse
import json
from .core.directory_management_service import DirectoryManager
from django.http import JsonResponse
import json, os
from common.utils.app_consts import CONFIG_PATH
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt



class RenameNode(APIView):
    def post(self, request, node_id, projectName):
        try:
            data = json.loads(request.body.decode("utf-8"))
            new_name = data.get('new_name', None)

            if not new_name:
                return JsonResponse({'status': 'error', 'message': 'New name not provided'}, status=400)

            directory_manager = DirectoryManager(projectName)
            result = directory_manager.rename_node(node_id, new_name)

            if result['status'] == 'success':
                return JsonResponse(result)
            else:
                return JsonResponse(result, status=404 if result['status'] == 'error' else 500)

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@method_decorator(csrf_exempt, name="dispatch")
class GetFolderConfig(APIView):
    def post(self , request, projectName):
        body =  json.loads(request.body.decode("utf-8"))
        if not projectName:
            return JsonResponse({'error': 'projectname query parameter is required'}, status=400)
        try:
            directoryManager = DirectoryManager(projectName)
            return JsonResponse({ "data":directoryManager.get_path_from_file_id(body.get('id'))})
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Error decoding JSON'}, status=500)
        
        
        
class MoveNode(APIView):
    def post(self, request, projectName):
        try:
            raise NotImplementedError()
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
