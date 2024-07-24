
import subprocess
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
import shutil
from .core.styles_config_service import StylesConfigService
from .core.app_startup_manager import start_app
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .core.helpers.get_attributes_utils import get_attributes_logic
from .core.helpers.get_component_list import update_components
from .core.files_upload_service import FileService
from .core.resource_config_service import ResourceConfigGenerator
from .core.helpers.function_ast_parser import FunctionParser

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



@method_decorator(csrf_exempt, name="dispatch")
class ConfigReader(APIView):
    def get(self, request, param):
        try:
            app_editor = AppEditor(param)
            return JsonResponse(app_editor.get_comp_config(), status=200)
        except:
            return JsonResponse({}, status=404)


@method_decorator(csrf_exempt, name="dispatch")
class AppBasicConfigReader(APIView):
    def get(self, request, param):
        try:
            app_editor = AppEditor(param)
            return JsonResponse(app_editor.app_config, status=200)
        except:
            return JsonResponse({}, status=404)


@method_decorator(csrf_exempt, name="dispatch")
class ComponentWriter(APIView):
    def post(self, request, param):
        data = json.loads(request.body.decode("utf-8"))
        try:
            app_component_writer = AppEditor(param)
            return JsonResponse(app_component_writer.write_component(data), status=200)
        except:
            return JsonResponse({}, status=500)


@method_decorator(csrf_exempt, name="dispatch")
class RoutingReader(APIView):
    def get(self, request, param):
        try:
            app_editor = AppEditor(param)
            return JsonResponse(app_editor.get_router_config(), status=200)
        except Exception as e:
            print(str(e))
            return JsonResponse({}, status=404)


@method_decorator(csrf_exempt, name='dispatch')
class NewComponentWriter(APIView):
    def post(self, request, param):
        data = json.loads(request.body.decode("utf-8"))
        try:
            app_component_writer = AppEditor(param)
            res = app_component_writer.add_component(
                data["name"], data["type"], data['route'])
            print("djfvnskjvnsri",res)
            update_components()

            return JsonResponse(res)
        except:
            return JsonResponse({}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
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
    def get(self, request, param):
        try:
            app_editor = AppEditor(param)
            return JsonResponse(app_editor.get_reducer_config(), status=200)
        except:
            return JsonResponse({}, status=404)

    def post(self, request, param):
        data = json.loads(request.body.decode("utf-8"))
        try:
            app_editor = AppEditor(param)
            res = app_editor.write_reducers_config(data)
            return JsonResponse(res, status=200)
        except:
            return JsonResponse({}, status=404)


@method_decorator(csrf_exempt, name='dispatch')
class StoreConfig(APIView):
    def get(self, request, param):
        try:
            app_editor = AppEditor(param)
            return JsonResponse(app_editor.get_redux_store_config(), status=200)
        except:
            return JsonResponse({}, status=404)

    def post(self, request, param):
        data = json.loads(request.body.decode("utf-8"))
        try:
            app_editor = AppEditor(param)
            store_config = app_editor.write_redux_config(data)
            # app_editor.write_redux_store()
            return JsonResponse(store_config, status=200)
        except:
            return JsonResponse({}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class ProjectConfig(APIView):
    def get(self, param):
        projects = GenerateProject.get_projects()
        return JsonResponse(projects, status=200)

    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        data['defaultComponent'] = "Main"
        data["projectName"] = data["name"]
        data["name"] = data['name'].lower().replace(" ", "_")
        generated_paths = os.path.join(
            os.path.dirname(os.getcwd()), "generated_projects")
        # os.makedirs(generated_paths,exist_ok=True)
        data["path"] = os.path.join(generated_paths, data["name"])
        if (data["name"] in GenerateProject.get_projects().keys()):
            return JsonResponse({"error": "Application name should be unique."}, status=400)
        app_config_writer = AppConfigWriter()
        app_config_writer.create_or_update_app_config(data)
        response = {"name": data["name"]}
        return JsonResponse(response, status=200)

    def put(self, request, param):
        GenerateProject.generate_project({"name": param})
        return JsonResponse({"name": param}, status=200)

    def delete(self, request, param):
        print("Deleting project : " + param)
        try:
            GenerateProject.delete_project(param)
            return JsonResponse({"deleted": param}, status=200)
        except FileNotFoundError:
            return JsonResponse({"Project not found": param}, status=404)
        except:
            return JsonResponse({}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class ProjectDetailsConfig(APIView):
    def put(self, request):
        try:
            data = json.loads(request.body.decode("utf-8"))
            # rename the project folder name, rename the name and the projectName field in
            #  app_basic_config file
            file_name = f"{CONFIG_PATH}/{data['oldConfig']['name']}/app_basic_config.json"
            with open(file_name, 'r') as file:
                app_basic_config = json.load(file)
                app_basic_config['name'] = data['newProjectName'].lower().replace(
                    " ", "_")
                app_basic_config['author'] = data['newAuthor']
                app_basic_config['description'] = data['newDescription']
                app_basic_config['projectName'] = data['newProjectName']

                # generation path for new app_basic_config
                generated_paths = os.path.split(app_basic_config['path'])
                app_basic_config['path'] = os.path.join(
                    generated_paths[0], app_basic_config['name'])

                # remove all the extra project folders whose config files are not present
                # in the configuration folder but are present in the generated_projects
                # folder for eg. with a .cache folder in a previously named folder
                try:
                    project_names_in_config = os.listdir(CONFIG_PATH)
                    project_names_in_generated_proj = os.listdir(
                        generated_paths[0])
                    for dir in project_names_in_generated_proj:
                        if dir not in project_names_in_config:
                            dir_to_remove = os.path.join(
                                generated_paths[0], dir)
                            if os.path.isdir(dir_to_remove):
                                shutil.rmtree(dir_to_remove)
                except Exception as e:
                    return JsonResponse({e}, status=500)

                # renaming all the affected folders
                try:
                    os.rename(
                        f"{data['oldConfig']['path']}/{data['oldConfig']['name']}",
                        f"{data['oldConfig']['path']}/{app_basic_config['name']}"
                    )
                    os.rename(data['oldConfig']['path'],
                              app_basic_config['path'])
                    os.rename(
                        f"{CONFIG_PATH}/{data['oldConfig']['name']}", f"{CONFIG_PATH}/{app_basic_config['name']}")

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
                        json.dump(package_json_data,
                                  package_json_file, indent=4)

                    with open(package_lock_json_path, 'r') as package_lock_file:
                        package_lock_data = json.load(package_lock_file)
                        package_lock_data['name'] = app_basic_config['name']
                        package_lock_data['packages']['']['name'] = app_basic_config['name']

                    with open(package_lock_json_path, 'w') as package_lock_file:
                        json.dump(package_lock_data,
                                  package_lock_file, indent=4)

                except (FileNotFoundError, OSError) as error:
                    print('Error while renaming folders: ', error)

                newData = json.dumps(app_basic_config, indent=4)

            file_name = f"{CONFIG_PATH}/{app_basic_config['name']}/app_basic_config.json"
            with open(file_name, 'w') as file:
                file.write(newData)

            print(
                '--------------- ALL APPLICATION NAME CHANGES CONDUCTED SUCCESSFULLY -----------')
            return JsonResponse(app_basic_config, status=200)
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({e}, status=500)


class ServiceConfig(APIView):
    def get(self, request, param):
        try:
            app_editor = AppEditor(param)
            return JsonResponse(app_editor.get_service_config(), status=200)
        except:
            return JsonResponse({}, status=500)

    def post(self, request, param):
        data = json.loads(request.body.decode("utf-8"))
        try:
            app_editor = AppEditor(param)
            return JsonResponse(app_editor.write_service_config(data), status=200)
        except:
            return JsonResponse({}, status=500)


class AppStartup(APIView):
    def get(self, request, param):
        try:
            app_editor = AppEditor(param)
            app_basic_config = app_editor.get_basic_config()
            return JsonResponse(start_app(app_basic_config), status=200)
        except:
            return JsonResponse({}, status=500)


class ComponentReader(APIView):
    def get(self, request, param):
        try:
            config_reader = ConfigService(param)
            return JsonResponse(config_reader.get_all_component_configs(), status=200)
        except:
            return JsonResponse({}, status=404)

    def post(self, request, param):
        try:
            config_reader = ConfigService(param)
            data = json.loads(request.body.decode("utf-8"))
            return JsonResponse(config_reader.get_component_config(data["componentName"]), status=200)
        except:
            return JsonResponse({}, status=404)

@method_decorator(csrf_exempt, name='dispatch')
class StylesConfig(APIView):
    def post(self, request):
        try:
            if 'css_file' in request.FILES:
                css_file = request.FILES['css_file']
                css_content = css_file.read().decode("utf-8")
                data = request.POST.dict() 
            else:
                data = request.data
                print(data)
                css_content = data.get("css_content")
           
            project_id = data.get("projectId")

            if not project_id:
                return JsonResponse({"error": "project_id is required"}, status=400)   
            if not css_content:
                return JsonResponse({"error": "No css is provided"}, status=400)   
                
            data['css_content'] = css_content       
            stylesConfigService = StylesConfigService(project_id)
            config = stylesConfigService.save_style(data)
            return JsonResponse(config, status=200, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    def get(self, request):
        try:
            project_id = request.GET.get("projectId")
            css_name = request.GET.get("css_name")

            if not project_id:
                return JsonResponse({"error": "project_id is required"}, status=400)

            stylesConfigService = StylesConfigService(project_id)
            if css_name:
                result = stylesConfigService.get_styles(css_name)
            else:
                result = stylesConfigService.get_styles()
                
            status_code = 200 if "error" not in result else 404
            return JsonResponse(result, status=status_code, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    def delete(self, request):
        try:
            project_id = request.GET.get("projectId")
            css_name = request.GET.get("css_name")

            if not project_id:
                return JsonResponse({"error": "project_id is required"}, status=400)
            if not css_name:
                return JsonResponse({"error": "css_name is required"}, status=400)

            stylesConfigService = StylesConfigService(project_id)
            result = stylesConfigService.delete_styles(css_name)
            return JsonResponse(result, status=200, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
@method_decorator(csrf_exempt, name='dispatch')
class FileUpload(APIView):
    def post(self, request, projectName= None):
        try:
            file = request.FILES.get('file')
            fileName = request.POST.get('filename')
            if not file:
                return JsonResponse({'error': 'No file provided.'}, status=400)

            if projectName is not None:
                resource_config = ResourceConfigGenerator(projectName)
                if resource_config.file_duplicacy(fileName):
                    return JsonResponse({'error': 'File with the same name already exists.'}, status=400)
                    
            fileId = FileService.upload_file(file, projectName)

            return JsonResponse({
                'message': 'File uploaded successfully',
                'fileId': fileId
            }, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

        
    def delete(self, request,projectName= None):
        try:
            data = json.loads(request.body) 
            file_id = data.get('file_id')

            if not projectName:
                return JsonResponse({'error': 'Project ID is required.'}, status=400)

            if not file_id:
                return JsonResponse({'error': 'File name is required.'}, status=400)

            file_service = FileService()
            file_service.delete_file(file_id, projectName)

            return JsonResponse({
                'message': 'File deleted successfully'
            }, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class ResourceConfig(APIView):
    def post(self, request, projectName):
        try:
            data = json.loads(request.body) 
            file_name = data.get('fileName')
            file_path = data.get('filePath')
            description = data.get('description')
            fileId = data.get('fileId')

            resource_config = ResourceConfigGenerator(projectName)
            config_data = resource_config.update_config(file_name, file_path, description, fileId)

            return JsonResponse({
                'message': 'Configuration created successfully',
                'config_data': config_data
            }, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        
    def get(self, request, projectName):
        try:
            if not projectName:
                return JsonResponse({'error': 'Project ID is required.'}, status=400)

            resource_config = ResourceConfigGenerator(projectName)
            config_data = resource_config.get_uploaded_files()

            if config_data is None:
                return JsonResponse({'error': 'Configuration file not found.'}, status=404)

            return JsonResponse({"data":config_data}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    def delete(self, request, projectName):
        try:            
            data = json.loads(request.body)
            file_name = data.get('name')
            file_id = data.get('id')

            if not projectName:
                return JsonResponse({'error': 'Project ID is required.'}, status=400)
            if not file_name:
                return JsonResponse({'error': 'File name is required.'}, status=400)
                
            resource_config = ResourceConfigGenerator(projectName)
            resource_config.delete_config(file_id, file_name)
            return JsonResponse({
                'message': 'File deleted successfully'
            }, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
@method_decorator(csrf_exempt, name='dispatch')
class HtmlConfigReader(APIView):
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        try:
            componentConfigService = ComponentConfigService(data["project_id"])
            return JsonResponse(componentConfigService.get_html_by_id(data["component"], data["html_id"]), status=200)
        except IndexError:
            return JsonResponse({}, status=404)
        except:
            return JsonResponse({}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class HtmlConfigWriter(APIView):
    def put(self, request):
        data = json.loads(request.body.decode("utf-8"))
        try:
            componentConfigService = ComponentConfigService(data["project_id"])
            componentConfigService.update_html_config(
                data["component"], data["html_id"], data["html_config"])
            return JsonResponse(data, status=200)
        except Exception as e:
            return JsonResponse({str(e)}, status=500)

    def delete(self, request):
        data = json.loads(request.body.decode("utf-8"))
        try:
            componentConfigService = ComponentConfigService(data["project_id"])
            res = componentConfigService.delete_html_config(
                data["component"], data["html_id"])
            return JsonResponse(res, status=200)
        except:
            return JsonResponse({}, status=500)

    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        try:
            # raise NotImplementedError()
            componentConfigService = ComponentConfigService(data["project_id"])
            new_child_id, child_config, parent_html = componentConfigService.add_child_html(
                data["component"], data["parent_html_id"], data["child"])
            return JsonResponse({"new_child_id": new_child_id, "child_config": child_config, "parent_html": parent_html}, status=200)
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

@method_decorator(csrf_exempt, name='dispatch')
class GetAttributes(APIView):
    def post(self, request):
        try:
            return get_attributes_logic(request.body)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        
@method_decorator(csrf_exempt,name="dispatch")  
class GetResources(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body.decode("utf-8"))
            app_editor = ComponentConfigService(data["project_id"])
            return JsonResponse(app_editor.get_resource(data["component"],data.get("resource_id")),status=200)
        except IndexError:
            return JsonResponse({},status=404)
        
@method_decorator(csrf_exempt,name="dispatch")
class ASTParser(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body.decode("utf-8"))
            function_generator = FunctionParser()
            function_code = function_generator.generate_statement_code(data)
            formatted_function_code = subprocess.check_output(" ".join(['npx', 'prettier', '--parser', 'babel']), shell=True, input=function_code, text=True)
            return JsonResponse({"function": formatted_function_code},status=200)
        except:
            return JsonResponse({}, status=500)