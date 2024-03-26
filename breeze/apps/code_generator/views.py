from django.shortcuts import render
from .core.generate_project import GenerateProject
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