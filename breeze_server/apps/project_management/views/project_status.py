from ..communication.app_startup_manager import RUNNING_APPS
from django.http import JsonResponse
from rest_framework.decorators import api_view
 
@api_view(['GET'])
def get_port(request,project_id):
    try:
        return JsonResponse({"port":RUNNING_APPS[project_id]["port"]},status=200)
    except Exception as e:
        print("Failed to get port for: ", e)
        return JsonResponse({'error': str(e)},status=500)