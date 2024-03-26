from django.views import View
from django.http import JsonResponse
import json

class ApiClientGenerator(View):
    
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        print(data)
        return JsonResponse({"list" : []}, status = 201)