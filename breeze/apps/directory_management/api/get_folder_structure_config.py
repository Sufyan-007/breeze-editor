from django.views import View
from django.http import JsonResponse
import json, uuid , os
from common.utils.app_consts import CONFIG_PATH

class GetFolderConfig(View):
    def get(self , request, projectName):
        if not projectName:
            return JsonResponse({'error': 'projectname query parameter is required'}, status=400)

        config_path = os.path.join(CONFIG_PATH, projectName, 'directory_management.json')
        try:
            with open(config_path,'r') as file:
                data = json.load(file)
                return JsonResponse(data)
        except FileNotFoundError:
            return JsonResponse({'error': 'Config file not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Error decoding JSON'}, status=500)