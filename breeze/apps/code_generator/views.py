from django.shortcuts import render
from .core.generate_project import GenerateProject
from .core.third_party_config.generate_tp_config import GenerateTPConfigAPI
# Create your views here.
from django.views import View
from django.http import JsonResponse
import json
class GenerateApp(View):
    
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        GenerateProject.generate_project(data)
        print(data)
        return JsonResponse({"list" : []}, status = 201)
    
class GenerateThirdPartyConfig(View):
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        print(data)
        GenerateTPConfigAPI.generate_tp_config(data)
        return JsonResponse({"msg" : "SUCCESS"}, status=201)
