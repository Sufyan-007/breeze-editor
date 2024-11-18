import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.http import JsonResponse
from ..core import file_management

@api_view(["POST"])
def add(request,project_id):
    data = json.loads(request.body.decode("utf-8"))
    fileName = data['fileName']
    parentId = data.get('parentId')
    node = file_management.add_code_file(projectId=project_id,fileName=fileName, parentId=parentId)
    return JsonResponse(node,status=200)


@api_view(["POST"])
def update(request, project_id):
    data = json.loads(request.body.decode("utf-8"))
    fileId = data['fileId']
    config = data['config']
    file_management.update_code_file(projectId=project_id,fileId=fileId,config=config)
    return JsonResponse({},status = 200)

@api_view(["POST"])
def add_statements(request,project_id):
    data = json.loads(request.body.decode('utf8'))
    fileId = data['fileId']
    parentId = data['parentId']
    config = data['config']
    conf = file_management.add_statement(projectId=project_id,fileId=fileId,parentId=parentId,statement=config)
    return JsonResponse(conf,status=200)

@api_view(['POST'])
def get_statement_config(request,project_id):
    data = json.loads(request.body.decode('utf-8'))
    fileId= data['fileId']
    statementId = data['statementId']
    try:
        res = file_management.get_statement_config(project_id,fileId,statementId)
        return JsonResponse(res,status=200)
    except KeyError as e:
        return JsonResponse({"err":"Key not found"},statu=404)