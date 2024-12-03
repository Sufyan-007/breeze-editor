
import json, os ,uuid
import threading
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from dotenv import load_dotenv
from ..core.custom_package_service import check_existing_folder, upload_file, delete_file, set_prop_config_service, update_resource_config , add_prop_config_service, delete_prop_config_service
from drf_spectacular.utils import extend_schema
from ..swagger_schema.custom_uploads_schema import add_custom_package_schema,get_custom_package_schema,delete_custom_package_schema
from ..utils.get_uploaded_resources import get_uploaded_resources as get_resources

@extend_schema(
    methods=['POST'],
    request=add_custom_package_schema['rb'],
    responses={
        200:add_custom_package_schema['response_200'],
        500:add_custom_package_schema['response_500']
    },
    tags=['resources']
)
@csrf_exempt
@api_view(['POST'])
def add_custom_package(request, projectName):
    file_id = str(uuid.uuid4()).replace("-", "_")
    try:
        file = request.FILES.get('file')
        fileName = request.POST.get("filename")

        if not file:
            return JsonResponse({'error': 'No file provided.'}, status=400)
        
        if not fileName:
            return JsonResponse({'error': 'No fileName provided.'}, status=400)
        
        # Check if file size exceeds 5 MB (5 * 1024 * 1024 bytes)
        if file.size > 5 * 1024 * 1024:
            return JsonResponse({'error': 'File size exceeds the 5MB limit.'}, status=400)
        
        if fileName.endswith('.zip'):
            fileName = fileName.replace('.zip', '')

        if check_existing_folder(projectName, fileName):
            return JsonResponse({'error': 'A folder with this name already exists.'}, status=400)

        update_resource_config(projectName, fileName,file_id, status="extracting...", tag="ZIP")       
        thread =  threading.Thread(target= upload_and_update_file ,args=(projectName, file, fileName, file_id) )
        thread.start()
        return JsonResponse({'file_id': file_id  }, status=200)

    except Exception as e:
        update_resource_config(projectName, fileName, file_id,status="file upload failed", tag="ZIP")
        return JsonResponse({'error': str(e)}, status=500)
                           
def upload_and_update_file(projectName, file, fileName , file_id):
    try:
        upload_file(projectName, file, fileName,file_id)
        
        update_resource_config(projectName, fileName, file_id, status="file uploading...", tag="ZIP")

        # Call the external API asynchronously after upload is done
        load_dotenv()
        SERVER_HOST = os.getenv("SERVER_HOST") 
        THIRD_PARTY_PARSER_PORT = os.getenv("THIRD_PARTY_PARSER_PORT")
        api_url = f"http://{SERVER_HOST}:{THIRD_PARTY_PARSER_PORT}/custom"
        payload = {
            "projName": projectName,
            "fileName": fileName
        }
        trigger_api(api_url, payload, projectName, fileName, file_id)

    except Exception as e:
        update_resource_config(projectName, fileName, file_id, status="file upload failed", tag="ZIP")
        return JsonResponse({'error': str(e)}, status=500)
    
@extend_schema(
    methods=['GET'],
    request=None,
    responses={
        200:get_custom_package_schema['response_200'],
        500:get_custom_package_schema['response_500'],
        400:get_custom_package_schema['response_400']
    },
    tags=['resources']
)
@csrf_exempt
@api_view(['GET'])
def get_uploaded_resources(request, projectName):
    try:
        if not projectName:
            return JsonResponse({'error': 'Project name is required.'}, status=400)

        tag = request.GET.get('tag')
        zip_files_info = get_resources(projectName, tag)
        return JsonResponse(zip_files_info, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@extend_schema(
    methods=['DELETE'],
    request=delete_custom_package_schema['rb'],
    responses={
        200:delete_custom_package_schema['response_200'],
        400:delete_custom_package_schema['response_400'],
        500:delete_custom_package_schema['response_500']
    },
    tags=['resources']
)
@csrf_exempt
@api_view(['DELETE'])
def delete_custom_package(request, projectName):
    try:
        data = json.loads(request.body)
        fileName = data.get("fileName")
        file_id = data.get("fileId")

        if not projectName:
            return JsonResponse({'error': 'Project name is required'}, status=400)

        if not fileName or not file_id :
            return JsonResponse({'error': 'File name or Id is required'}, status=400)

        delete_file(projectName, fileName, file_id)
        return JsonResponse({'message': "File deleted successfully"}, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@extend_schema(
    methods=['PUT'],
    request=None,
    responses=None
)
@csrf_exempt
@api_view(['PUT'])
def set_prop_config(request, projectName):    
    try:
        data= json.loads(request.body)
        prop_id= data.get('id')
        new_prop_name = data.get('prop_name')
        new_type = data.get('type')
        new_default_value = data.get('default_value')
        file_name = data.get('fileName')
        component_id =  data.get('componentId')
 
        if not projectName:
            return JsonResponse({'error': 'Project name is required'}, status=400)
        
        if not (prop_id and component_id and file_name):
            return JsonResponse({'error': 'Missing required fields'}, status=400)
        
        updated_component_config = set_prop_config_service(projectName, file_name, component_id, prop_id, new_prop_name, new_type, new_default_value)
        
        return JsonResponse(updated_component_config, status=200)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
        
@csrf_exempt
@api_view(['POST'])
def add_prop_config(request, projectName):    
    prop_id = str(uuid.uuid4()).replace("-", "_")
    try:
        data= json.loads(request.body)
        prop_name = data.get('prop_name')
        type = data.get('type')
        default_value = data.get('default_value')
        file_name = data.get('fileName')
        component_id =  data.get('componentId')
 
        if not projectName:
            return JsonResponse({'error': 'Project name is required'}, status=400)
        
        if not (component_id and file_name):
            return JsonResponse({'error': 'Missing required fields'}, status=400)
        
        add_prop_config_service(projectName, file_name, component_id, prop_id, prop_name, type, default_value)
        
        return JsonResponse({'message': "Prop added successfully"}, status=200)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    
@csrf_exempt
@api_view(['DELETE'])
def delete_prop_config(request, projectName):
    try:
        data = json.loads(request.body)
        prop_id = data.get("propId")
        file_name = data.get("fileName")
        component_id = data.get("componentId")

        if not projectName:
            return JsonResponse({'error': 'Project name is required'}, status=400)

        if not file_name or not component_id or not prop_id :
            return JsonResponse({'error': 'missing fields'}, status=400)

        delete_prop_config_service(projectName, prop_id,file_name, component_id)
        return JsonResponse({'message': "File deleted successfully"}, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
# Helper function to handle asynchronous API calls
def call_external_api_async(api_url, payload, projectName , fileName, file_id):
    try:
        
        response = requests.post(api_url, json=payload)
        if response.status_code == 200:
            update_resource_config(projectName, fileName,file_id, status="success", tag="ZIP")
            print("External API call successful")
        else:
            update_resource_config(projectName, fileName,file_id, status="components upload failed", tag="ZIP")
            print(f"Failed to call external API: {response.text}")

    except Exception as e:
        print(f"Error during external API call: {str(e)}")
        update_resource_config(projectName, fileName, file_id,status="components upload failed", tag="ZIP")
        raise Exception(f"Error during external API call:{str(e)}")
    
# Trigger the API in a separate thread
def trigger_api(api_url, payload, projectName, fileName, file_id):
    threading.Thread(target=call_external_api_async, args=(api_url, payload , projectName, fileName, file_id)).start()
 