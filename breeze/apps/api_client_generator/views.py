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
                
                api_models = converted_data.get("api_models",[])
                filename = converted_data.get("filename","")+".json"
                model_dict = {}
                for model in api_models:
                    model_dict[model.id] = model.as_dict()
                full_file_path = os.path.join(folder_path, filename)
                
                append_to_dict_file(full_file_path,model_dict)
                
                return JsonResponse({"data": model_dict, "filename": filename}, status=201)

            elif collectionType.lower() == 'openapi' and (json_file.name.endswith('.yml') or json_file.name.endswith('.yaml') or json_file.name.endswith('.json')):
                open_api_converter = OpenapiConverter()
                converted_data = open_api_converter.prepare_api_models(json_data, project_name)
                
                ## for auth.json
                security_schemes_models = converted_data.get("security_schemes_models")
                # security_schemes_models = result.get("security_schemes_models")
                swagger_metadata_key = converted_data.get("id")
                swagger_metadata_config_path = f"{CONFIG_PATH}/{project_name}/swagger_metadata.json"
                with open(swagger_metadata_config_path, "r") as file:
                        swagger_metadata_content = json.load(file)
                
                auth_model_dict = {}
                for model in security_schemes_models:
                    auth_model_dict[model.id] = model.as_dict()    
                swagger_metadata_content[swagger_metadata_key]["auth_apis"] = auth_model_dict
                append_to_dict_file(swagger_metadata_config_path,swagger_metadata_content)
                
                ## for other models
                tag_models = converted_data.get("tag_models")
                # resultant_filename = []
                files_with_apis = []
                api_models_folder_path = folder_path + f"/{swagger_metadata_key}"
                if not os.path.exists(api_models_folder_path):
                    os.makedirs(api_models_folder_path)
                for tag, api_models in tag_models.items():
                    function_with_errors = set()
                    model_dict = {}
                    filename = tag+".json"
                    full_file_path = os.path.join(api_models_folder_path, filename)
                    # resultant_filename.append(filename)
                    for model in api_models:
                        model_as_dict = model.as_dict()
                        model_dict[model.id] = model_as_dict
                        if len(model_as_dict["errors"]["root_errors"])>0:
                            function_with_errors.add(model.operation_id)
                    function_with_errors_list = list(function_with_errors)
                    files_with_apis.append({"filename": tag, "apis": model_dict, "errors": function_with_errors_list})
                    append_to_dict_file(full_file_path,model_dict)
                return JsonResponse({"files_with_apis": files_with_apis}, status=201)
            elif collectionType.lower() == 'websocket' and (json_file.name.endswith('.yml') or json_file.name.endswith('.yaml') or json_file.name.endswith('.json')):
                converted_data = WebsocketConverter.prepare_api_models(json_data)
                error_obj = converted_data.get("error_obj",{})
                model = converted_data.get("channel_obj",{})
                filename = converted_data.get("filename","")+".json"
                model_dict = {}
                model_dict[model.id] = model.as_dict()
                full_file_path = os.path.join(folder_path, filename)
                append_to_dict_file(full_file_path,model_dict)
                
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
        auth_api_folder_path = f"{CONFIG_PATH}/{projectName}/swagger_metadata.json"
        files_with_apis = []
        swagger_metadata = {}

        try:
            # Load authentication API data from Swagger metadata
            auth_api_data = []
            

            with open(auth_api_folder_path, "r") as file:
                swagger_metadata = json.load(file)

            for key, value in swagger_metadata.items():
                apis = []
                if key == "custom_schemas":
                    continue
                auth_apis = value.get("auth_apis", {})
                for k, v in auth_apis.items():
                    apis.append(v)
                auth_api_data.append({
                    "model_id": key,
                    "apis": apis,
                    "title": value.get("title")
                })

            # If only files should be returned, return the list of files
            # if files_only and files_only == 'true':
            #     all_files = []
            #     subfolders = [f for f in os.listdir(api_folder_path) if os.path.isdir(os.path.join(api_folder_path, f))]
            #     for subfolder in subfolders:
            #         subfolder_path = os.path.join(api_folder_path, subfolder)
            #         files = [os.path.join(subfolder, file) for file in os.listdir(subfolder_path) if os.path.isfile(os.path.join(subfolder_path, file))]
            #         all_files.extend(files)
            #     return JsonResponse({"files": all_files}, status=200)

            # Process each subfolder and its files
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