
from django.http import JsonResponse
import json
from .core.app_editor import AppEditor
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.views import APIView

@method_decorator(csrf_exempt,name="dispatch")
class ConfigReader(APIView):
    def get(self, request,param):
        try:
            app_editor= AppEditor(param)
            return JsonResponse(app_editor.get_comp_config(),status=200)
        except:
            return JsonResponse({},status=404)

        
@method_decorator(csrf_exempt, name="dispatch")
class ComponentWriter(APIView):
    def post(self,request,param):
        data= json.loads(request.body.decode("utf-8"))
        try:
            app_component_writer= AppEditor(param)    
            return JsonResponse(app_component_writer.write_component(data),status=200)
        except:
            return JsonResponse({},status=500)
    
@method_decorator(csrf_exempt,name="dispatch")
class RoutingReader(APIView):
    def get(self, request,param):
        try:
            app_editor= AppEditor(param)
            return JsonResponse(app_editor.get_router_config(),status=200)
        except:
            return JsonResponse({},status=404)

@method_decorator(csrf_exempt,name='dispatch')
class NewComponentWriter(APIView):
    def post(self,request,param):
        data= json.loads(request.body.decode("utf-8"))
        try:
            app_component_writer= AppEditor(param)
            res=app_component_writer.add_component(data["name"])
            return JsonResponse(res)
        except:
            return JsonResponse({}, status=500)

@method_decorator(csrf_exempt,name='dispatch')
class RoutingWriter(APIView):
    def post(self,request,param):
        data= json.loads(request.body.decode("utf-8"))
        try:
            app_editor= AppEditor(param)
            res= app_editor.add_route(data["route"],data.get("component"),data.get("redirectTo"))
            return JsonResponse(res)
        except:
            return JsonResponse({}, status=500)
