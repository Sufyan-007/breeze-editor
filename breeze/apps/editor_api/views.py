
from django.http import JsonResponse
import json
from .core.app_editor import AppEditor
from .core.generate_project import GenerateProject
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.views import APIView
from .core.app_config_writer import AppConfigWriter

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


@method_decorator(csrf_exempt,name='dispatch')
class ReducerConfig(APIView):
    def get(self,request,param):
        try:
            app_editor= AppEditor(param)
            return JsonResponse(app_editor.get_reducer_config(),status=200)
        except:
            return JsonResponse({},status=404)
    def post(self,request,param):
        data= json.loads(request.body.decode("utf-8"))
        try:
            app_editor= AppEditor(param)
            res=app_editor.write_reducers_config(data)
            return JsonResponse(res,status=200)
        except:
            return JsonResponse({},status=404)

@method_decorator(csrf_exempt,name='dispatch')
class StoreConfig(APIView):
    def get(self,request,param):
        try:
            app_editor= AppEditor(param)
            return JsonResponse(app_editor.get_redux_store_config(),status=200)
        except:
            return JsonResponse({},status=404)

    def post(self,request,param):
        data= json.loads(request.body.decode("utf-8"))
        try:
            app_editor= AppEditor(param)
            store_config=app_editor.write_redux_config(data)
            # app_editor.write_redux_store()
            return JsonResponse(store_config,status=200)
        except:
            return JsonResponse({}, status=500)

@method_decorator(csrf_exempt,name='dispatch')
class ProjectConfig(APIView):
    def get(self,param):
        projects = GenerateProject.get_projects()
        return JsonResponse(projects,status=200)
    def post(self,request):
        data = json.loads(request.body.decode("utf-8"))
        app_config_writer = AppConfigWriter()
        app_config_writer.create_or_update_app_config(data)
        response={ "name":data["name"]}
        return JsonResponse(response,status=200)
    def put(self,request,param):
        GenerateProject.generate_project({ "name":param})
        return JsonResponse({"name":param},status=200)


class ServiceConfig(APIView):
    def get(self,request,param):
        try:
            app_editor= AppEditor(param)
            return JsonResponse(app_editor.get_service_config(),status=200)
        except:
            return JsonResponse({},status=500)
        
    def post(self,request,param):
        data= json.loads(request.body.decode("utf-8"))
        try:
            app_editor= AppEditor(param)
            return JsonResponse(app_editor.write_service_config(data),status=200)
        except:
            return JsonResponse({},status=500)