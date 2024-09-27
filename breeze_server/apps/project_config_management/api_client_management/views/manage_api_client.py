import traceback,json,os
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from ....common.constants.consts import CONFIG_PATH,CLIENT_API
from django.http import JsonResponse
from ..core.openapi_swagger_convertor import prepare_api_models,wrap_conversion
from ..core.intermediate_modification_helper import process_api_data,transfer_to_auth,add_auth_function
from ..utils.api_models.custom_exception import CustomeException
@api_view(['POST'])
@permission_classes([AllowAny])
def generate_service_config(request, collectionType, project_id):
        project_name = project_id
        folder_path = f"{CONFIG_PATH}/{project_name}/{CLIENT_API}" 
        filename = ''
        try:
            json_file = request.FILES['file']
            json_data = json_file.read().decode("utf-8")

            # if collectionType.lower() == 'postman' and json_file.name.endswith('.json'):
            #     postman_converter = PostmanCollectionConverter()
            #     converted_data = postman_converter.prepare_api_models(json_data)
            #     model_dict, filename = postman_converter.wrap_conversion(converted_data=converted_data, folder_path=folder_path)
                
            #     return JsonResponse({"data": model_dict, "filename": filename}, status=201)

            if collectionType.lower() == 'openapi' and (json_file.name.endswith('.yml') or json_file.name.endswith('.yaml') or json_file.name.endswith('.json')):
                converted_data = prepare_api_models(json_data, project_name)
                files_with_apis = wrap_conversion(converted_data=converted_data, project_name=project_name, folder_path=folder_path)
                return JsonResponse({"files_with_apis": files_with_apis}, status=201)
            
            # elif collectionType.lower() == 'websocket' and (json_file.name.endswith('.yml') or json_file.name.endswith('.yaml') or json_file.name.endswith('.json')):
            #     model_dict,filename,error_obj = WebsocketConverter.prepare_api_models(json_data)
            #     return JsonResponse({"data": model_dict, "filename": filename,"error_obj" : error_obj}, status=201)
            
            else:
                return JsonResponse({"error": "Invalid collection type or file format."}, status=400)
        except CustomeException as e:
            print(e)
            return JsonResponse({"error": str(e)}, status=500)
        
        except Exception as e:
            print(traceback.format_exc())
            return JsonResponse({"error": str(e)}, status=500)
        

            
@api_view(['POST'])
@permission_classes([AllowAny])
def modify_function_config(request,operation,project_id):
    data = json.loads(request.body.decode("utf-8"))
    filename = data.get("filename")
    module_id = data.get("moduleId")
    api_type = data.get("api_type")
    api_data = data.get("api_data")
    if api_type.lower() == "auth":
        result = add_auth_function(auth_model=api_data,appName=project_id,moduleId=module_id)
    else:
        result = process_api_data(operation,api_data, filename,project_id,module_id)
    if result:
        return JsonResponse({"message": "Function Added Successfully" }, status=201)
    else:
        return JsonResponse({"message": result }, status=201)
    

def transfer_to_auth (request,project_id):
    data = json.loads(request.body.decode("utf-8"))
    filename = data.get("filename")
    id_value = data.get("id")
    module_id = data.get("module_id")
    file_path = os.path.join(f"{CONFIG_PATH}/{project_id}/{CLIENT_API}/{module_id}", f"{filename}.json")
    target_file_path = f"{CONFIG_PATH}/{project_id}/{CLIENT_API}/swagger_metadata.json"
    result = transfer_to_auth(filename= filename, id_value=id_value,file_path=file_path,target_file_path=target_file_path,module_id=module_id)
    return JsonResponse(result)
    


