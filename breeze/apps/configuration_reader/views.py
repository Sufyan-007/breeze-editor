from django.views import View
from django.http import JsonResponse
import json, os
from .core.app_config_reader import AppConfigReader
from common.utils.app_consts import THIRD_PARTY_CONFIG_PATH
from common.utils.config_reader import read_file_json
from .core.third_party_components import ThirdPartyComponents
## this APIs are for common custom global components shared by each project
class GetComponents(View):
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        print(data)
        app_config_reader = AppConfigReader()
        # third_party_components= app_config_reader.get_third_party_component_list(library,lib_version)
        response = app_config_reader.get_components(data)
        return JsonResponse(response, status = 200)
    
class GetComponentConfig(View):
    
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        print(data)
        app_config_reader = AppConfigReader()
        response = app_config_reader.get_component_config(data)

        return JsonResponse(response, status = 200)
    
class ReadFromPath(View):

    def get(self, request, filepath):
        # filepath = filepath.replace("@@@", "/")
        full_path = f"{THIRD_PARTY_CONFIG_PATH}/react-bootstrap/others/{filepath}"

        response = read_file_json(full_path)

        return JsonResponse(response, status = 200)


class GetThirdPartyComponents(View):
    
    def get(self,request):
        data = json.loads(request.body.decode("utf-8"))
        library = data.get('library')
        lib_version = data.get('lib_version')
        zip_file = data.get('zip_file')
        project_id= data.get('project_id')
        
        third_party_components = ThirdPartyComponents()
        
        if zip_file:
            response, status = third_party_components.get_components_from_zip(zip_file,project_id)
            
        else:
            response, status= third_party_components.get_third_party_components(library, lib_version)
            
        return JsonResponse(response, status=status)
    
class GetThirdPartyComponentConfig(View):
    
    def get(self, request ):
        try:
            data = json.loads(request.body.decode("utf-8"))
            project_id = data.get('project_id')
            library = data.get("library")
            lib_version = data.get("lib_version")
            component_name = data.get("component_name")
            zip_file = data.get("zip_file")
            
            if not project_id:
                return JsonResponse({"error":"projectid not found"}, status=400)
            
            third_party_components = ThirdPartyComponents()
            
            if zip_file:
                response, status_code = third_party_components.get_component_config_from_zip(zip_file, project_id, component_name)
            else:  
                response, status_code = third_party_components.get_third_party_component_config(library, component_name, lib_version)
            return JsonResponse(response, status=status_code)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        
class GetProjectLibrariesList(View):
    
    def get(self, request):
        try:
            data = json.loads(request.body.decode("utf-8"))
            project_id = data.get('project_id')

            if not project_id:
                return JsonResponse({'error': 'projectId is required'}, status=400)
            third_party_components = ThirdPartyComponents()
            response = third_party_components.get_project_lib_list(project_id)
            
            return JsonResponse(response, status=200, safe=False)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        