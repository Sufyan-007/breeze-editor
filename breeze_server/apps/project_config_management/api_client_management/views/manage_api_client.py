import traceback,json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from ....common.constants.consts import CONFIG_PATH
from django.http import JsonResponse
from ..core.openapi_swagger_convertor import prepare_api_models,wrap_conversion
from ..utils.api_models.custom_exception import CustomeException
@api_view(['POST'])
@permission_classes([AllowAny])
def generateServiceConfig(request, collectionType, projectId):
        project_name = projectId
        folder_path = f"{CONFIG_PATH}/{project_name}/api_client_intermediate_json" 
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
        
        
   
            
