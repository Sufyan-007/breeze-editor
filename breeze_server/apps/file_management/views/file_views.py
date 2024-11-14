import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.http import JsonResponse
from ..core.file_management import add_code_file,update_code_file

@api_view(["POST"])
def add(request,project_id):
    data = json.loads(request.body.decode("utf-8"))
    fileName = data['fileName']
    parentId = data.get('parentId')
    node = add_code_file(projectId=project_id,fileName=fileName, parentId=parentId)
    return JsonResponse(node,status=200)


@api_view(["POST"])
def update(request, project_id):
    data = json.loads(request.body.decode("utf-8"))
    fileId = data['fileId']
    config = data['config']
    update_code_file(projectId=project_id,fileId=fileId,config=config)
    return JsonResponse({},status = 200)