from django.views import View
from django.http import JsonResponse
import json, uuid , os

class GetFolderConfig(View):
    def get(self , request):
        config_path = "/home/varanpreet/Desktop/breezeui/configurations/creator/directory_management.json"
        try:
            with open(config_path,'r') as file:
                data = json.load(file)
                return JsonResponse(data)
        except FileNotFoundError:
            return JsonResponse({'error': 'Config file not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Error decoding JSON'}, status=500)