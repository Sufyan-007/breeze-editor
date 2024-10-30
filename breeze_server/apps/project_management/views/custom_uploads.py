
import json, os
import threading
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view,parser_classes
from dotenv import load_dotenv
from ..core.custom_package_service import check_existing_folder, upload_file, get_zip_files, delete_file
from apps.common.constants.consts import PORT  
from drf_yasg.utils import swagger_auto_schema
from ..swagger_schema.custom_uploads_schema import add_custom_package_schema,get_custom_package_schema,delete_custom_package_schema
from ..models.custom_upload import AddCustomPackageBody,DeleteCustomPackageBody,GetCustomPackagesResponse
from drf_yasg import openapi
from rest_framework.parsers import MultiPartParser, FormParser

@swagger_auto_schema(
    method='post',
    manual_parameters=[
        openapi.Parameter(name='file',in_=openapi.IN_FORM,type=openapi.TYPE_FILE),
        openapi.Parameter(name='fileName',in_=openapi.IN_FORM,type=openapi.TYPE_STRING,description='name of file')
    ],
    # request_body=add_custom_package_schema['rb'],
    responses={
        200:add_custom_package_schema['response_200'],
        500:add_custom_package_schema['response_500']
    },
    tags=['resources']
)
@csrf_exempt
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def add_custom_package(request, projectName):
    try:
        file = request.FILES.get('file')
        fileName = request.POST.get("filename")
        #this will validate request body 
        rb = AddCustomPackageBody(file,fileName)
        if(rb.__dict__['isError']):
            return JsonResponse({'error':rb.__dict__['errorObj']},status=400)

        # if not file:
        #     return JsonResponse({'error': 'No file provided.'}, status=400)

        if fileName.endswith('.zip'):
            fileName = fileName.replace('.zip', '')

        # Check if the folder already exists in extracted_zip_folders
        if check_existing_folder(projectName, fileName):
            return JsonResponse({'error': 'A folder with this name already exists.'}, status=400)

        upload_file(projectName, file, fileName)

        # After the file is uploaded, call the external API asynchronously
        load_dotenv()
        SERVER_HOST = os.getenv("SERVER_HOST") 
        api_url = f"http://{SERVER_HOST}:{PORT}/custom"
        payload = {
            "projName": projectName,
            "fileName": fileName
        }
        print(payload,"payload")
        trigger_api(api_url, payload)

        return JsonResponse({'message': 'File uploaded successfully'}, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@swagger_auto_schema(
    method='get',
    request_body=None,
    responses={
        200:get_custom_package_schema['response_200'],
        500:get_custom_package_schema['response_500'],
        400:get_custom_package_schema['response_400']
    },
    tags=['resources']
)
@csrf_exempt
@api_view(['GET'])
def get_custom_packages(request, projectName):
    try:
        if not projectName:
            return JsonResponse({'error': 'Project name is required.'}, status=400)

        zip_files_info = get_zip_files(projectName)
        res = GetCustomPackagesResponse(zip_files_info)
        if(res.__dict__['isError']):
            raise Exception(res.__dict__['errorObj'])
        return JsonResponse(zip_files_info, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@swagger_auto_schema(
    method='delete',
    request_body=delete_custom_package_schema['rb'],
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
        #this will validate request body 
        rb = DeleteCustomPackageBody(data.get("fileName"))
        if(rb.__dict__['isError']):
            return JsonResponse({'error':rb.__dict__['errorObj']},status = 400)
        fileName = data.get("fileName")

        if not projectName:
            return JsonResponse({'error': 'Project name is required'}, status=400)

        # if not fileName:
        #     return JsonResponse({'error': 'File name is required'}, status=400)

        delete_file(projectName, fileName)
        return JsonResponse({'message': "File deleted successfully"}, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# Helper function to handle asynchronous API calls
def call_external_api_async(api_url, payload):
    try:
        response = requests.post(api_url, json=payload)
        if response.status_code == 200:
            print("External API call successful")
        else:
            print(f"Failed to call external API: {response.text}")
    except Exception as e:
        print(f"Error during external API call: {str(e)}")

# Trigger the API in a separate thread
def trigger_api(api_url, payload):
    threading.Thread(target=call_external_api_async, args=(api_url, payload)).start()
