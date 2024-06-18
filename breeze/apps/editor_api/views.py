
from django.http import JsonResponse, Http404, HttpResponse
import json
from .core.app_editor import AppEditor
from .core.config_service import ConfigService
from .core.generate_project import GenerateProject
from .core.component_config_service import ComponentConfigService
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from .core.app_config_writer import AppConfigWriter
from common.utils.app_consts import CONFIG_PATH
import os
import tinycss2
import shutil 
from .core.ccs_parser import extract_class_names
from .core.app_startup_manager import start_app
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

@method_decorator(csrf_exempt,name="dispatch")
class AddPackage(APIView):
    def post(self, request, projectName):
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body)
            package_name = data.get('name')
            package_version = data.get('version')
            
            # Check if both package name and version are provided
            if not package_name or not package_version:
                return JsonResponse({'error': 'Both package name and version are required'}, status=400)
            
            # Initialize the AppEditor with the project name
            app_editor = AppEditor(projectName)
            
            # Add the package and version to the app_basic_config.json file
            app_editor.add_package_to_dependencies(package_name, package_version)
            
            return JsonResponse({'message': 'Package added successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def get(self, request, projectName):
        try:
           # Initialize the AppEditor with the project name
           app_editor = AppEditor(projectName)
           dependencies = app_editor.get_dependencies()
           return JsonResponse(dependencies, status=200)
        except:
           return JsonResponse({},status=500)
        
    
    def put(self, request, projectName):
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body)
            package_name = data.get('name')
            package_version = data.get('version')
            
            # Check if both package name and version are provided
            if not package_name or not package_version:
                return JsonResponse({'error': 'Both package name and version are required'}, status=400)
            
            # Initialize the AppEditor with the project name
            app_editor = AppEditor(projectName)
            
            # Update the package version in the app_basic_config.json file
            app_editor.update_package_in_dependencies(package_name, package_version)
            
            return JsonResponse({'message': 'Package updated successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    def delete(self, request, projectName):
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body)
            package_name = data.get('name')
            
            # Check if both package name and version are provided
            if not package_name:
                return JsonResponse({'error': 'Package name is required'}, status=400)
            
            # Initialize the AppEditor with the project name
            app_editor = AppEditor(projectName)
            
            # Update the package version in the app_basic_config.json file
            app_editor.delete_package_in_dependencies(package_name)
            
            return JsonResponse({'message': 'Package deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)



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
        except Exception as e:
            print(str(e))
            return JsonResponse({},status=404)

@method_decorator(csrf_exempt,name='dispatch')
class NewComponentWriter(APIView):
    def post(self,request,param):
        data= json.loads(request.body.decode("utf-8"))
        try:
            app_component_writer= AppEditor(param)
            res=app_component_writer.add_component(data["name"],data["type"])
            return JsonResponse(res)
        except:
            return JsonResponse({}, status=500)

@method_decorator(csrf_exempt,name='dispatch')
class RoutingWriter(APIView):
    # here need to handle case like add edit delete for 
    # default component currently named 'Main'
    def get(self, param):
        pass
   
    def post(self,request,param):
        data = json.loads(request.body.decode("utf-8"))
        try:
            app_editor = AppEditor(param)
            res = app_editor.add_edit_base_route(data)
            if res['case']:
                return JsonResponse(res['res'], status=200)
            else:
                return JsonResponse(res['res'], status=400, safe=False)
        except Exception as e:
            print("Error ", e)
            return JsonResponse({e}, status=500)
    
    def delete(self, request, param):
        try:
            data = json.loads(request.body.decode("utf-8"))
            app_editor= AppEditor(param);
            res = app_editor.delete_base_route(data)
            if res['case']:
                return JsonResponse(res['res'], status=200)
            else:
                return JsonResponse(res['res'], status=400, safe=False)
        except Exception as e:
            print("Error ", e)
            return JsonResponse(e, status=500)  
    
    
        
@method_decorator(csrf_exempt,name='dispatch')
class ChildRouteHandler(APIView):
    def get(self, param):
        pass
    
    def post(self,request,param):
        try:
            data = json.loads(request.body.decode("utf-8"))
            app_editor= AppEditor(param);
            res = app_editor.add_child_route(data)
            if res['case']:
                return JsonResponse(res['res'], status=200)
            else:
                return JsonResponse(res['res'], status=400, safe=False)
        except Exception as e:
            print("Error ", e)
            return JsonResponse(e, status=500)
    
    def put(self, request, param):
        try:
            data = json.loads(request.body.decode("utf-8"))
            app_editor= AppEditor(param);
            res = app_editor.edit_child_route(data)
            if res['case']:
                return JsonResponse(res['res'], status=200)
            else:
                return JsonResponse(res['res'], status=400, safe=False)
        except Exception as e:
            print("Error ", e)
            return JsonResponse(e, status=500) 
    
    def delete(self, request, param):
        try:
            data = json.loads(request.body.decode("utf-8"))
            app_editor= AppEditor(param);
            res = app_editor.delete_child_route(data)
            if res['case']:
                return JsonResponse(res['res'], status=200)
            else:
                return JsonResponse(res['res'], status=400, safe=False)
        except Exception as e:
            print("Error ", e)
            return JsonResponse(e, status=500) 
    
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
                
                # remove all the extra project folders whose config files are not present 
                # in the configuration folder but are present in the generated_projects
                # folder for eg. with a .cache folder in a previously named folder
                try:
                    project_names_in_config = os.listdir(CONFIG_PATH)
                    project_names_in_generated_proj = os.listdir(generated_paths[0])
                    for dir in project_names_in_generated_proj:
                        if dir not in project_names_in_config:
                            dir_to_remove = os.path.join(generated_paths[0], dir)
                            if os.path.isdir(dir_to_remove):
                                shutil.rmtree(dir_to_remove)
                except Exception as e:
                    return JsonResponse({e},status=500)
                
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
            return JsonResponse(app_basic_config, status=200)
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
            return JsonResponse(config_reader.get_all_component_configs(),status=200)
        except:
            return JsonResponse({},status=404)
        
    def post(self,request,param):
        try:
            config_reader = ConfigService(param)
            data= json.loads(request.body.decode("utf-8"))
            return JsonResponse(config_reader.get_component_config(data["componentName"]),status=200)
        except:
            return JsonResponse({},status=404)
        
@method_decorator(csrf_exempt, name='dispatch')
class CSSConfig(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body.decode("utf-8"))
            
            css_name = data.get('css_name')
            css_content = data.get('css_content')
            
            if not css_name:
                return JsonResponse({'error': 'CSS Name is required.'}, status=400)
            if not css_content:
                return JsonResponse({'error': 'CSS Content is required.'}, status=400)
            
            folder_path = os.path.join('uploaded_css', css_name)
            
            if os.path.exists(folder_path):
                return JsonResponse({'error': f'A folder with the name "{css_name}" already exists.'}, status=400)

            css_file_name = css_name.lower().replace(" ", "_")
            file_path = os.path.join(folder_path, f"{css_file_name}.css")
            default_storage.save(file_path, ContentFile(css_content))

            rules = tinycss2.parse_stylesheet(css_content, skip_whitespace=True)
            class_names = extract_class_names(rules)
            
            return JsonResponse({
                'message': 'CSS data processed successfully',
                'css_file': css_name,
                'class_names': list(class_names)
            }, status=200)
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    def get(self, request):
        try:
            dir_path = f"uploaded_css/"
            if not default_storage.exists(dir_path):
                return JsonResponse({'files' : []}, status=200)

            files = default_storage.listdir("uploaded_css")[0]
            files_list = [{'css_file': file} for file in files]
            return JsonResponse({'files': files_list}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    def put(self, request):
        try:
            data = json.loads(request.body.decode("utf-8"))
            
            css_name = data.get('css_name')
            css_content = data.get('css_content')
            
            if not css_name:
                return JsonResponse({'error': 'CSS Name is required.'}, status=400)
            if not css_content:
                return JsonResponse({'error': 'CSS Content is required.'}, status=400)
            
            folder_path = os.path.join('uploaded_css', css_name)
            file_name = f"{css_name.lower().replace(' ', '_')}.css"
            file_path = os.path.join(folder_path, file_name)
            
            if default_storage.exists(folder_path):
                shutil.rmtree(default_storage.path(folder_path))
            
            os.makedirs(folder_path, exist_ok=True)
            with default_storage.open(file_path, 'w') as f:
                f.write(css_content)
        
            return JsonResponse({'message': 'CSS configuration updated successfully', 'css_name': css_name}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    def delete(self, request, css_name):
        try:
            folder_path = f"uploaded_css/{css_name}/"
            full_path = default_storage.path(folder_path)

            if default_storage.exists(folder_path):
                shutil.rmtree(full_path)
                return JsonResponse({'message': 'CSS file deleted successfully.'}, status=200)
            else:
                return JsonResponse({'error': 'CSS file not found.'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class CSSConfigReader(APIView):
    def get(self, request, css_name):
        try:
            dir_path = f"uploaded_css/{css_name}/"
            if not default_storage.exists(dir_path):
                raise Http404

            _, files = default_storage.listdir(dir_path)
            if not files:
                return JsonResponse({'error': 'No CSS file found in the specified folder.'}, status=404)

            file_name = files[0]
            file_path = f"{dir_path}{file_name}"

            with default_storage.open(file_path, "r") as f:
                file_content = f.read()

            return JsonResponse({
                'css_name': css_name,
                'file_name': file_name,
                'content': file_content
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        
@method_decorator(csrf_exempt, name='dispatch')
class CSSFileDownloadView(APIView):
    def get(self, request, css_name):
        folder_path = f"uploaded_css/{css_name}/"
        full_folder_path = default_storage.path(folder_path)

        if not default_storage.exists(full_folder_path) or not os.listdir(full_folder_path):
            raise Http404(f"No files found in the folder {css_name}.")

        filename = os.listdir(full_folder_path)[0]
        file_path = os.path.join(folder_path, filename)

        if default_storage.exists(file_path):
            file = default_storage.open(file_path, 'rb')
            response = HttpResponse(file, content_type='text/css')
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
        else:
            raise Http404(f"The file does not exist in the folder {css_name}.")
        
@method_decorator(csrf_exempt, name='dispatch')
class CSSFileUpload(APIView):
    def post(self, request):
        try:
            css_name = request.POST.get('css_name')
            css_file = request.FILES.get('css_file')
            
            if not css_file:
                return JsonResponse({'error': 'No CSS file provided.'}, status=400)
            
            if not css_name:
                return JsonResponse({'error': 'CSS Name is required.'}, status=400)

            base_dir = os.path.join('uploaded_css')
            folder_path = os.path.join(base_dir, css_name)

            if os.path.exists(folder_path):
                return JsonResponse({'error': f'A folder with the name "{css_name}" already exists.'}, status=400)
            
            file_path = f"{folder_path}/{css_file.name}"
            file_name = default_storage.save(file_path, ContentFile(css_file.read()))

            with default_storage.open(file_name, 'r') as f:
                css_text = f.read()

            rules = tinycss2.parse_stylesheet(css_text, skip_whitespace=True)
            class_names = extract_class_names(rules)
            print(len(class_names))
            return JsonResponse({
                'message': 'CSS file uploaded successfully',
                'css_name': css_name,
                'class_names': list(class_names)
            }, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        

@method_decorator(csrf_exempt, name='dispatch')
class HtmlConfigReader(APIView):
    def post(self,request):
        data = json.loads(request.body.decode("utf-8"))
        try:
            componentConfigService = ComponentConfigService(data["project_id"])
            return JsonResponse(componentConfigService.get_html_by_id(data["component"],data["html_id"]),status = 200)
        except IndexError:
            return JsonResponse({},status =404)
        except:
            return JsonResponse({},status=500)

@method_decorator(csrf_exempt,name='dispatch')
class HtmlConfigWriter(APIView):
    def put(self,request):
        data = json.loads(request.body.decode("utf-8"))
        try:
            componentConfigService = ComponentConfigService(data["project_id"])
            componentConfigService.update_html_config(data["component"],data["html_id"],data["html_config"])
            return JsonResponse(data,status=200)
        except Exception as e:
            return JsonResponse({str(e)},status=500)
    
    def delete(self,request):
        data = json.loads(request.body.decode("utf-8"))
        try:
            componentConfigService = ComponentConfigService(data["project_id"])
            res=componentConfigService.delete_html_config(data["component"],data["html_id"])
            return JsonResponse(res,status=200)
        except:
            return JsonResponse({},status=500)

    def post(self,request):
        data = json.loads(request.body.decode("utf-8"))
        try:
            # raise NotImplementedError()
            componentConfigService = ComponentConfigService(data["project_id"])
            new_child_id,child_config,parent_html=componentConfigService.add_child_html(data["component"],data["parent_html_id"],data["child"])
            return JsonResponse({"new_child_id":new_child_id,"child_config":child_config,"parent_html":parent_html},status=200)
        except:
            return JsonResponse({},status=500)
        
@method_decorator(csrf_exempt, name='dispatch')
class ComponentConfigWriter(APIView):
    def put(self, request):
        try:
            data = json.loads(request.body.decode("utf-8"))
            project_id = data["projectId"]
            component_id = data["componentId"]
            if not project_id or not component_id:
                return JsonResponse({"error": "project_id and component_id are required"}, status=400)
            
            componentConfigService = ComponentConfigService(project_id)
            config = componentConfigService.update_component(component_id, data["body"])
            return JsonResponse(config, status=200, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class ComponentConfigOrder(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body.decode("utf-8"))
            project_id = data["projectId"]
            component_id = data["componentId"]
            if not project_id or not component_id:
                return JsonResponse({"error": "project_id and component_id are required"}, status=400)
            
            componentConfigService = ComponentConfigService(project_id)
            result = componentConfigService.reorder_component_actions(component_id, data["body"])
            if result:
                return JsonResponse({"message": "Reordered Successfully"}, status=200)
            else:
                return JsonResponse({"error": "Reordering failed"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


# @method_decorator(csrf_exempt, name='dispatch')
# class LifeCycleConfigWriter(APIView):

#     def post(self, request):
#         try:
#             data = json.loads(request.body)
#             componentConfigService = ComponentConfigService(data["project_id"])
#             lifecycle_data = self.extract_lifecycle_data(data)
#             new_hook = componentConfigService.add_lifecycle(lifecycle_data)
#             return JsonResponse(new_hook, status=200)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON'}, status=400)
#         except ValueError as e:
#             return JsonResponse({'error': str(e)}, status=409)  # 409 Conflict

#     def get(self, request):
#         try:
#             project_id = request.GET.get('project_id')
#             comp_name = request.GET.get('comp_name')
#             hook_name = request.GET.get('hook_name')
#             if not project_id or not comp_name:
#                 return JsonResponse({'error': 'Missing required parameters'}, status=400)
#             componentConfigService = ComponentConfigService(project_id)
#             lifecycle_hooks = componentConfigService.get_lifecycle(comp_name, hook_name)
#             if lifecycle_hooks or isinstance(lifecycle_hooks, list):
#                 return JsonResponse(lifecycle_hooks, safe=False, status=200)
#             return JsonResponse({'error': 'Hook not found'}, status=404)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     def put(self, request):
#         try:
#             data = json.loads(request.body)
#             lifecycle_data = self.extract_lifecycle_data(data)
#             componentConfigService = ComponentConfigService(data["project_id"])
#             updated_hook = componentConfigService.update_lifecycle(lifecycle_data)
#             return JsonResponse(updated_hook, status=200)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON'}, status=400)
#         except (KeyError, LookupError, ValueError) as e:
#             return JsonResponse({'error': str(e)}, status=400)

#     def delete(self, request):
#         try:
#             project_id = request.GET.get('project_id')
#             comp_name = request.GET.get('comp_name')
#             hook_name = request.GET.get('hook_name')
#             if not project_id or not comp_name or not hook_name:
#                 return JsonResponse({'error': 'Missing required parameters'}, status=400)
#             componentConfigService = ComponentConfigService(project_id)
#             isDeleted = componentConfigService.delete_lifecycle(comp_name, hook_name)
#             if isDeleted:
#                 return JsonResponse({'msg': 'Hook deleted.'}, status=200)
#             return JsonResponse({'error': 'Hook not found'}, status=404)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     @staticmethod
#     def extract_lifecycle_data(data):
#         return {
#             "comp_name": data["comp_name"],
#             "type": data["type"],
#             "lifecycleType": data["lifecycleType"],
#             "hook_name": data["hook_name"],
#             "dependentVars": data["dependentVars"],
#             "body": data["body"],
#             "return_body": data.get("return_body")
#         }
        
# @method_decorator(csrf_exempt, name='dispatch')
# class VariablesConfigWriter(APIView):
    
#     def post(self, request):
#         try:
#             data = json.loads(request.body.decode("utf-8"))
#             componentConfigService = ComponentConfigService(data["project_id"])
#             var=componentConfigService.add_variable(data["component"],data["variable_config"])
#             return JsonResponse(var,status=200,safe=False)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)
        
#     def get(self, request):
#         try:
#             project_id = request.GET.get('project_id')
#             comp_name = request.GET.get('comp_name')
#             variable_id = request.GET.get('variable_id')
#             if not project_id or not comp_name:
#                 return JsonResponse({'error': 'Missing required parameters'}, status=400)
#             componentConfigService = ComponentConfigService(project_id)
#             variables = componentConfigService.get_variables(comp_name, variable_id)
#             if variables or isinstance(variables, list):
#                 return JsonResponse(variables, safe=False, status=200)
#             return JsonResponse({'error': 'Variable not found'}, status=404)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     def put(self, request):
#         try:
#             data = json.loads(request.body.decode("utf-8"))
#             componentConfigService = ComponentConfigService(data["project_id"])
#             var=componentConfigService.update_variable(data["component"],data["variable_config"])
#             return JsonResponse(var,status=200,safe=False)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     def delete(self, request):
#         try:
#             project_id = request.GET.get('project_id')
#             comp_name = request.GET.get('comp_name')
#             variable_id = request.GET.get('variable_id')
#             if not project_id or not comp_name or not variable_id:
#                 return JsonResponse({'error': 'Missing required parameters'}, status=400)
#             componentConfigService = ComponentConfigService(project_id)
#             isDeleted = componentConfigService.delete_variable(comp_name, variable_id)
#             if isDeleted:
#                 return JsonResponse({'msg': 'Var deleted.'}, status=200)
#             return JsonResponse({'error': 'Var not found'}, status=404)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)
        
# @method_decorator(csrf_exempt,name="dispatch")
# class FunctionConfigReader(APIView):
    
#     def post(self,request):
#         raise NotImplementedError()
#         return JsonResponse({},status=200)

# @method_decorator(csrf_exempt,name="dispatch")
# class FunctionConfigWriter(APIView):
    
#     def post(self,request):
#         try:
#             data = json.loads(request.body.decode("utf-8"))
#             componentConfigService = ComponentConfigService(data["project_id"])
#             func=componentConfigService.add_function(data["component"],data["function_config"])
#             return JsonResponse(func,status=200,safe=False)
#         except IndexError:
#             return JsonResponse({},status=409)
#         except:
#             return JsonResponse({},status=500)
        
#     def put(self,request):
#         try:
#             data = json.loads(request.body.decode("utf-8"))
#             componentConfigService = ComponentConfigService(data["project_id"])
#             func=componentConfigService.update_function(data["component"],data["function_config"])
#             return JsonResponse(func,status=200,safe=False)
#         except IndexError:
#             return JsonResponse({},status=404)
#         except:
#             return JsonResponse({},status=500)
