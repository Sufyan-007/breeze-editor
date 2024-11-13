import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.http import JsonResponse, FileResponse
from ..core.resource_upload_service import file_duplicacy
from apps.common.utils.file_helpers.file_handler import upload_file as uf, delete_file as df, get_file_path
from apps.project_management.core.resource_upload_service import update_config, save_file, delete_config
@csrf_exempt
@api_view(['POST'])
def upload_file(request, project_id):
    try:
        file = request.FILES.get('file')
        data = request.POST.dict()
        file_name = data.get('filename')
        description = data.get('description')
        parentFolderId = data.get('selectedFolderId')
        if not file:
            return JsonResponse({'error': 'No file provided.'}, status=400)

        if project_id is not None:
            if file_duplicacy(project_id, file_name):
                return JsonResponse({'error': 'File with the same name already exists.'}, status=400)
                
        file_id = uf(project_id, file)
        destination_path = update_config(project_id, file_name, description, file_id, parentFolderId)
        save_file(project_id, file_id, destination_path)
        return JsonResponse({
            'message': 'File uploaded successfully',
            'fileId': file_id
        }, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@api_view(['DELETE'])
def delete_file(request, project_id):
    try:
        data = json.loads(request.body) 
        file_id = data.get('file_id')

        if not project_id:
            return JsonResponse({'error': 'Project ID is required.'}, status=400)

        if not file_id:
            return JsonResponse({'error': 'File name is required.'}, status=400)

        df(project_id, file_id)
        delete_config(project_id, file_id)
        # TODO: User should be given warning on logo deletion and for that
        # we need to implement resources usage check feature
        return JsonResponse({
            'message': 'File deleted successfully'
        }, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@api_view(['GET'])
def download_file(request, project_id, fileId):
    try:
        if not project_id:
            return JsonResponse({'error': 'Project ID is required.'}, status=400)

        if not fileId:
            return JsonResponse({'error': 'File ID is required.'}, status=400)

        file_path = get_file_path(project_id, fileId)

        if file_path is None:
            return JsonResponse({'error': 'File not found.'}, status=404)

        response = FileResponse(open(file_path, 'rb'), as_attachment=True)
        return response
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
