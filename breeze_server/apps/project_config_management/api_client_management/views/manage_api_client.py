import traceback,json,os
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from ....common.constants.consts import CONFIG_PATH,CLIENT_API
from django.http import JsonResponse
from ..core.openapi_swagger_convertor import prepare_api_models,wrap_conversion
from ..core.intermediate_modification_helper import process_api_data, transfer_data_to_auth,add_auth_function
from ..core.module_manager import add_module_helper,edit_module_title_helper
from ..swagger_schema.manage_api_client_schema import generate_service_config_schema,modify_function_config_schema,transfer_to_auth_schema,edit_module_title_schema
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from ....code_generator.core.api_client_generator import generate_react_service
from ....directory_management.core.directory_management_service import DirectoryManager



@swagger_auto_schema(
    method='post',
    request_body=generate_service_config_schema['rb'],
    responses={
        201:generate_service_config_schema['response_201'],
        500:generate_service_config_schema['response_501']
    },
    tags=['manage-api-client']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def generate_service_config(request, collectionType, project_id):
        folder_path = f"{CONFIG_PATH}/{project_id}/{CLIENT_API}" 

        try:
            json_file = request.FILES['file']
            json_data = json_file.read().decode("utf-8")

            # if collectionType.lower() == 'postman' and json_file.name.endswith('.json'):
            #     postman_converter = PostmanCollectionConverter()
            #     converted_data = postman_converter.prepare_api_models(json_data)
            #     model_dict, filename = postman_converter.wrap_conversion(converted_data=converted_data, folder_path=folder_path)
                
            #     return JsonResponse({"data": model_dict, "filename": filename}, status=201)

            if collectionType.lower() == 'openapi' and (json_file.name.endswith('.yml') or json_file.name.endswith('.yaml') or json_file.name.endswith('.json')):
                isJson = json_file.name.endswith('.json')
                converted_data = prepare_api_models(json_data, project_id,isJson)
                module_id = converted_data.get("id")
                module_name = converted_data.get("title")
                security_schemes = converted_data.get("security_schemes")
                files_with_apis, is_erroroneous = wrap_conversion(converted_data=converted_data, project_name=project_id, folder_path=folder_path)
                if not is_erroroneous:
                    directory_manager = DirectoryManager(project_name=project_id)
                    directory_manager.add_node_to_config(
                        parent_id= "SERVICES",
                        tag= "SERVICES",
                        name=module_name,
                        node_type="DIRECTORY",
                        file_id= module_id,
                        entity_id=module_id,
                        isProtected=False
                    )
                    for file in files_with_apis:
                        generate_react_service(app_name=project_id, filename=file.get("fileId"), service_type="ORDINARY", module_id=module_id, module_name= module_name, security_schemes= security_schemes)
                return JsonResponse({"module_id": module_id}, status=201)
            
            # elif collectionType.lower() == 'websocket' and (json_file.name.endswith('.yml') or json_file.name.endswith('.yaml') or json_file.name.endswith('.json')):
            #     model_dict,filename,error_obj = WebsocketConverter.prepare_api_models(json_data)
            #     return JsonResponse({"data": model_dict, "filename": filename,"error_obj" : error_obj}, status=201)
            
            else:
                return JsonResponse({"error": "Invalid collection type or file format."}, status=400)
        
        except Exception as e:
            print(traceback.format_exc())
            return JsonResponse({"error": str(e)}, status=500)
        

@swagger_auto_schema(
    method='post',
    request_body=modify_function_config_schema['rb'],
    responses={
            200:modify_function_config_schema['response_200']
        },
    tags=['manage-api-client']
) 
@api_view(['POST'])
@permission_classes([AllowAny])
def modify_function_config(request,operation,project_id):
    data = json.loads(request.body.decode("utf-8"))
    filename = data.get("filename")
    module_id = data.get("moduleId")
    api_type = data.get("api_type")
    api_data = data.get("api_data")
    if api_type.lower() == "auth":
        result = add_auth_function(auth_model=api_data,appName=project_id,moduleId=module_id,operation=operation)
    else:
        result = process_api_data(operation,api_data, filename,project_id,module_id)
    if result:
        return JsonResponse({"message": "Function Added Successfully" }, status=200)
    else:
        return JsonResponse({"message": result }, status=200)

@swagger_auto_schema(
    method='post',
    request_body=transfer_to_auth_schema['rb'],
    responses={
        200:transfer_to_auth_schema['response_201']
    },
    tags=['manage-api-client']
)   
@api_view(['POST'])
@permission_classes([AllowAny])
def transfer_to_auth(request,project_id):
    data = json.loads(request.body.decode("utf-8"))
    filename = data.get("filename")
    id_value = data.get("id")
    module_id = data.get("module_id")
    file_path = os.path.join(f"{CONFIG_PATH}/{project_id}/{CLIENT_API}/{module_id}", f"{filename}.json")
    target_file_path = f"{CONFIG_PATH}/{project_id}/{CLIENT_API}/swagger_metadata.json"
    result,status = transfer_data_to_auth(filename= filename, id_value=id_value,file_path=file_path,target_file_path=target_file_path,module_id=module_id)
    return JsonResponse(result, status=status)

@swagger_auto_schema(
    method='post',
    request_body=edit_module_title_schema['rb'],
    responses={
        200:edit_module_title_schema['response_200'],
        400:edit_module_title_schema['response_400']
    },
    tags=['manage-api-client']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def edit_module_title(request, project_id):
        data = json.loads(request.body)
        new_title = data.get("title")
        module_id = data.get("moduleId")
        swagger_metadata_file_path = f"{CONFIG_PATH}/{project_id}/{CLIENT_API}/swagger_metadata.json"
        swagger_schema_index_path = f"{CONFIG_PATH}/{project_id}/models/index.json"
        result,status = edit_module_title_helper(swagger_file_path=swagger_metadata_file_path,schema_index_file=swagger_schema_index_path, module_id=module_id, new_title=new_title)
        return JsonResponse(result,status=status)
    
@api_view(['GET'])
@permission_classes([AllowAny])   
def get_response_token( request, project_id,apiId, moduleId):
        try:
            file_path = f"{CONFIG_PATH}/{project_id}/{CLIENT_API}/swagger_metadata.json"
            if not os.path.exists(file_path):
                return JsonResponse({"error": "File not found"}, status=404)
            if moduleId=='null' or moduleId == 'undefined':
                return JsonResponse({"error": "Module ID not provided"}, status=400)
            result = {}
            with open(file_path, "r") as file:
                file_content = json.load(file)
                result = None
                auth_apis = file_content.get(moduleId).get("auth_apis",{})
                if apiId == 'null':
                    result = []
                    for key, api in auth_apis.items():
                        response_tokens = ''
                        for res in api.get("response", []):
                            if res:
                                if res.get("status") == 'S_200':
                                    response_tokens = res.get("token_store")
                        result.append({
                            "id" : key,
                            "operation_id" : api.get("operation_id"),
                            "response_tokens": response_tokens,
                        })
                else:
                    result = auth_apis.get(apiId)
                    
            return JsonResponse({"data": result}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)



@api_view(['POST'])
@permission_classes([AllowAny])
def add_module(request,project_id):
    data = json.loads(request.body.decode("utf-8"))
    module_name = data.get("name")
    module_description = data.get("description")
    if not module_name or not module_description:
        return JsonResponse({"error": "Module name and description are required."}, status=400)
    swagger_metadata_path = f"{CONFIG_PATH}/{project_id}/{CLIENT_API}/"
    swagger_schema_path = f"{CONFIG_PATH}/{project_id}/models"
    result,status = add_module_helper(swagger_metadata_path=swagger_metadata_path, swagger_schema_path=swagger_schema_path, module_name=module_name, module_description= module_description, project_id=project_id)
    return JsonResponse(result, status=status)



