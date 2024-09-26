import json
from django.http import JsonResponse
from ....common.constants.consts import CONFIG_PATH
from ..core.schema_manager import add_or_edit_schema, delete_schema
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny


@api_view(['POST', 'PUT'])
@permission_classes([AllowAny])
def addOrEditSchema(request,projectId):
    data = json.loads(request.body.decode("utf-8"))
    schema_id = data.get("schemaId")
    module_id = data.get("moduleId")
    schema_details = data.get("details")
    schema_name = schema_details.get("name")
    schema_file_path = f"{CONFIG_PATH}/{projectId}/swagger_schema/{module_id}.json"
    if schema_id:
        result = add_or_edit_schema(schema_details=schema_details, schema_name=schema_name,file_path=schema_file_path, schema_id=schema_id)
    else:
        result = add_or_edit_schema(schema_details=schema_details,schema_name=schema_name,file_path=schema_file_path )
    return JsonResponse(result)



@api_view(['DELETE'])
@permission_classes([AllowAny])
def deleteSchema(request,projectId):
    data = json.loads(request.body.decode("utf-8"))
    module_id = data.get("moduleId")
    schema_id = data.get("schemaId")
    schema_file_path = f"{CONFIG_PATH}/{projectId}/swagger_schema/{module_id}.json"
    result = delete_schema(schema_file_path=schema_file_path, schemaId=schema_id)
    return JsonResponse(result)