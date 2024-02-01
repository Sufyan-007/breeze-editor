from django.shortcuts import render
from .core.generate_project import GenerateProject
# Create your views here.
from django.views import View
from django.http import JsonResponse
import json
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.schemas import SchemaGenerator
from rest_framework.views import APIView
from rest_framework_swagger import renderers

FETCH_CAR_SUCCESS = '''{{
    "id": <showroom id>, 
    "name": <showroom name>,
    "location": <showroom location>,
    "car": [
        {
            "model_no": <car model no>,
            "model_name": <car model name>,
            "showroom": <showroom no>
        }
    ]
}}'''
class GenerateApp(APIView):
    
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        GenerateProject.generate_project(data)
        print(data)
        return JsonResponse({"list" : []}, status = 201)