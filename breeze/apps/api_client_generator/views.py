import os,json,traceback
from .utils.append_dict_file import append_to_dict_file

from .core.openapi_swagger_converter import OpenapiConverter
from .core.postman_collection_converter import PostmanCollectionConverter
from .core.websocket_converter import WebsocketConverter

from common.utils.app_consts import CONFIG_PATH
from django.views import View
from django.http import JsonResponse
from .utils.jsonencoder import EnhancedJSONEncoder
from .api_models.custom_exception import CustomeException

class ApiClientGenerator(View):

    def post(self, request, collectionType, appName):
        project_name = appName
        folder_path = f"{CONFIG_PATH}/{project_name}/api_client_intermediate_json" 
        filename = ''
        try:
            json_file = request.FILES['file']
            json_data = json_file.read().decode("utf-8")

            if collectionType.lower() == 'postman' and json_file.name.endswith('.json'):
                postman_converter = PostmanCollectionConverter()
                converted_data = postman_converter.prepare_api_models(json_data)
                model_dict, filename = postman_converter.wrap_conversion(converted_data=converted_data, folder_path=folder_path)
                
                return JsonResponse({"data": model_dict, "filename": filename}, status=201)

            elif collectionType.lower() == 'openapi' and (json_file.name.endswith('.yml') or json_file.name.endswith('.yaml') or json_file.name.endswith('.json')):
                open_api_converter = OpenapiConverter()
                converted_data = open_api_converter.prepare_api_models(json_data, project_name)
                files_with_apis = open_api_converter.wrap_conversion(converted_data=converted_data, project_name=project_name, folder_path=folder_path)
                return JsonResponse({"files_with_apis": files_with_apis}, status=201)
            
            elif collectionType.lower() == 'websocket' and (json_file.name.endswith('.yml') or json_file.name.endswith('.yaml') or json_file.name.endswith('.json')):
                model_dict,filename,error_obj = WebsocketConverter.prepare_api_models(json_data)
                return JsonResponse({"data": model_dict, "filename": filename,"error_obj" : error_obj}, status=201)
            
            else:
                return JsonResponse({"error": "Invalid collection type or file format."}, status=400)
        except CustomeException as e:
            print(e)
            return JsonResponse({"error": str(e)}, status=500)
        
        except Exception as e:
            print(traceback.format_exc())
            return JsonResponse({"error": str(e)}, status=500)
        
        
    
    def get(self, request, projectName, files_only):
        api_folder_path = f"{CONFIG_PATH}/{projectName}/api_client_intermediate_json"
        auth_api_folder_path = f"{CONFIG_PATH}/{projectName}/api_client_intermediate_json/swagger_metadata.json"
        files_with_apis = []
        swagger_metadata = {}

        try:
            # Load authentication API data from Swagger metadata
            auth_api_data = []
            with open(auth_api_folder_path, "r") as file:
                swagger_metadata = json.load(file)
            if "custom" not in swagger_metadata:
                swagger_metadata["custom"] = {"title": "custom_module", "description": "custom_description", "auth_apis":{}}
                append_to_dict_file(auth_api_folder_path, swagger_metadata)
                
            for key, value in swagger_metadata.items():
                apis = []
                # if key == "custom":
                #     continue
                auth_apis = value.get("auth_apis", {})
                for k, v in auth_apis.items():
                    apis.append(v)
                auth_api_data.append({
                    "model_id": key,
                    "apis": apis,
                    "title": value.get("title")
                })
                
            custom_module_path = os.path.join(api_folder_path, "custom")
            os.makedirs(custom_module_path, exist_ok=True)
            
            subfolders = [f for f in os.listdir(api_folder_path) if os.path.isdir(os.path.join(api_folder_path, f))]
            for subfolder in subfolders:
                subfolder_path = os.path.join(api_folder_path, subfolder)
                subfolder_data = {
                    "subfolder": subfolder,
                    "files": [],
                    "title": ""
                }
                for key, value in swagger_metadata.items():
                        if key == subfolder:
                            subfolder_data["title"] = value.get("title")
                            break

                # List and process files in each subfolder
                files = [f for f in os.listdir(subfolder_path) if os.path.isfile(os.path.join(subfolder_path, f))]
                for filename in files:
                    full_file_path = os.path.join(subfolder_path, filename)
                    function_with_errors = set()
                    result_arr = []
                    
                    if filename != "allSchemas.json":
                        with open(full_file_path, "r") as file:
                            api_models = json.load(file)
                            for data in api_models.values():
                                data_errors = data.get('errors', {})
                                if data_errors and len(data_errors.get("root_errors", [])) > 0:
                                    function_with_errors.add(data.get("operation_id"))
                                result_arr.append({
                                    "id": data.get("id"),
                                    "operation_id": data.get("operation_id"),
                                })
                    
                    filename_without_extension = os.path.splitext(filename)[0]
                    function_with_errors_list = list(function_with_errors)
                    
                    subfolder_data["files"].append({
                        "filename": filename_without_extension,
                        "apis": api_models,
                        "errors": function_with_errors_list
                    })

                files_with_apis.append(subfolder_data)

            return JsonResponse({"files_with_apis": files_with_apis, "auth_api_files": auth_api_data}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
            
            #gijson-auth.json appname