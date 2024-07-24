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
        folder_path = f"{CONFIG_PATH}/{project_name}/generated_intermediate_json"
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
                auth_file = "auth.json"
                auth_model_dict = {}
                for model in security_schemes_models:
                    auth_model_dict[model.id] = model.as_dict()    
                full_auth_file_path = os.path.join(folder_path, auth_file)
                append_to_dict_file(full_auth_file_path,auth_model_dict)
                
                ## for other models
                tag_models = converted_data.get("tag_models")
                # resultant_filename = []
                files_with_apis = []
                
                for tag, api_models in tag_models.items():
                    function_with_errors = set()
                    model_dict = {}
                    filename = tag+".json"
                    full_file_path = os.path.join(folder_path, filename)
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
        
        
    
    def get(self, request, projectName,files_only):
        folder_path = f"{CONFIG_PATH}/{projectName}/generated_intermediate_json"
        files_with_apis = []

        try:
            # Get list of files in the folder
            files = os.listdir(folder_path)
            if files_only and files_only == 'true':
                return JsonResponse({"files":  files}, status=200)
            
            for filename in files:
                full_file_path = os.path.join(folder_path, filename)
                function_with_errors = set()
                result_arr = []
                # Read the file
                if filename != "allSchemas.json":
                    with open(full_file_path, "r") as file:
                        api_models = json.load(file)
                        for data in api_models.values():
                            data_errors = data.get('errors')
                            if data_errors and len(data_errors.get("root_errors"))>0:
                                function_with_errors.add(data["operation_id"])
                            result_arr.append({
                                "id" : data.get("id"),
                                "operation_id" : data.get("operation_id"),
                            })
                filename_without_extension = os.path.splitext(filename)[0]
                function_with_errors_list = list(function_with_errors)
                # Append file name and APIs to the list
                files_with_apis.append({
                    "filename": filename_without_extension,
                    "apis": api_models,
                    "errors": function_with_errors_list
                })

            return JsonResponse({"files_with_apis": files_with_apis}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        
        #gijson-auth.json appname