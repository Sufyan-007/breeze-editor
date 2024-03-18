from django.http import JsonResponse
import json
from ..core.react_api_client_generator import ReactApiClientGenerator
from django.views import View

class GenerateReactApiClient(View):
    
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        app_name = data.get("appName")
        filename = data.get("filename")
        app_config_dir = app_name
        client_generator = ReactApiClientGenerator(app_config_dir)
        client_generator.generate_react_service(app_name,filename)
        print(data)
        return JsonResponse({"list" : []}, status = 201)