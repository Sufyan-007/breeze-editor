
from django.http import JsonResponse
import json
from .core.app_editor import AppEditor
from .core.config_service import ConfigService
from .core.generate_project import GenerateProject
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.views import APIView
from .core.app_config_writer import AppConfigWriter
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
import os
from .core.app_startup_manager import start_app
@method_decorator(csrf_exempt,name="dispatch")
class ConfigReader(APIView):
    def get(self, request,param):
        try:
            app_editor= AppEditor(param)
            return JsonResponse(app_editor.get_comp_config(),status=200)
        except:
            return JsonResponse({},status=404)

@method_decorator(csrf_exempt,name="dispatch")
class AppBasicConfigReader(APIView):
    def get(self, request,param):
        try:
            app_editor= AppEditor(param)
            return JsonResponse(app_editor.app_config,status=200)
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
        data['defaultComponent']="Main"
        data["projectName"]=data["name"]
        data["name"]=data['name'].lower().replace(" ","_")
        generated_paths=os.path.join(os.path.dirname(os.getcwd()),"generated_projects")
        # os.makedirs(generated_paths,exist_ok=True)
        data["path"]=os.path.join(generated_paths,data["name"])
        if(data["name"] in GenerateProject.get_projects().keys()) :
            return JsonResponse({"error": "Application name should be unique."}, status=400)
        app_config_writer = AppConfigWriter()
        app_config_writer.create_or_update_app_config(data)
        response={ "name":data["name"]}
        return JsonResponse(response,status=200)
    def put(self,request,param):
        GenerateProject.generate_project({ "name":param})
        return JsonResponse({"name":param},status=200)
    def delete(self,request,param):
        print("Deleting project : " + param)
        try:
            GenerateProject.delete_project(param)
            return JsonResponse({"deleted":param},status=200)
        except FileNotFoundError:
            return JsonResponse({"Project not found":param},status=404)
        except:
            return JsonResponse({},status=500)

@method_decorator(csrf_exempt,name='dispatch')
class ProjectDetailsConfig(APIView):
    def put(self, request):
        try:
            data = json.loads(request.body.decode("utf-8"))
            # rename the project folder name, rename the name and the projectName field in
            #  app_basic_config file
            file_name = f"{CONFIG_PATH}/{data['oldConfig']['name']}/app_basic_config.json"
            with open(file_name, 'r') as file:
                app_basic_config = json.load(file)
                app_basic_config['name'] = data['newProjectName'].lower().replace(" ", "_")
                app_basic_config['author'] = data['newAuthor']
                app_basic_config['description'] = data['newDescription']
                app_basic_config['projectName'] = data['newProjectName']

                # generation path for new app_basic_config
                generated_paths = os.path.split(app_basic_config['path'])
                app_basic_config['path'] = os.path.join(generated_paths[0], app_basic_config['name'])
                
                # renaming all the affected folders
                try:
                    os.rename(
                        f"{data['oldConfig']['path']}/{data['oldConfig']['name']}", 
                        f"{data['oldConfig']['path']}/{app_basic_config['name']}"
                    )
                    os.rename(data['oldConfig']['path'], app_basic_config['path'])
                    os.rename(f"{CONFIG_PATH}/{data['oldConfig']['name']}", f"{CONFIG_PATH}/{app_basic_config['name']}")

                    # renaming the project's name in its package.json & package-lock.json files                    
                    package_json_path = os.path.join(
                        f"{app_basic_config['path']}/{app_basic_config['name']}", 'package.json'
                    )
                    package_lock_json_path = os.path.join(
                        f"{app_basic_config['path']}/{app_basic_config['name']}", 'package-lock.json'
                    )
                    
                    with open(package_json_path, 'r') as package_json_file:
                        package_json_data = json.load(package_json_file)
                        package_json_data['name'] = app_basic_config['name']

                    with open(package_json_path, 'w') as package_json_file:
                        json.dump(package_json_data, package_json_file, indent=4)

                    with open(package_lock_json_path, 'r') as package_lock_file:
                        package_lock_data = json.load(package_lock_file)
                        package_lock_data['name'] = app_basic_config['name']
                        package_lock_data['packages']['']['name'] = app_basic_config['name']

                    with open(package_lock_json_path, 'w') as package_lock_file:
                        json.dump(package_lock_data, package_lock_file, indent=4)
                        
                except (FileNotFoundError, OSError) as error:
                     print('Error while renaming folders: ', error)
                     
                newData = json.dumps(app_basic_config, indent=4)
                
            file_name = f"{CONFIG_PATH}/{app_basic_config['name']}/app_basic_config.json"
            with open(file_name, 'w') as file:
                file.write(newData)
                
            print('--------------- ALL APPLICATION NAME CHANGES CONDUCTED SUCCESSFULLY -----------')
            return JsonResponse({}, status=200)
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({e},status=500)
    
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
        
class AppStartup(APIView):
    def get(self,request,param):
        try:
            app_editor = AppEditor(param)
            app_basic_config = app_editor.get_basic_config()
            return JsonResponse(start_app(app_basic_config),status=200)
        except:
            return JsonResponse({},status=500)
        
class ComponentReader(APIView):
    def get(self, request,param):
        try:
            config_reader = ConfigService(param)
            return JsonResponse(config_reader.get_component_configs(),status=200)
        except:
            return JsonResponse({},status=404)