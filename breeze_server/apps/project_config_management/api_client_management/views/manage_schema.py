import json
from django.http import JsonResponse
from ....common.constants.consts import CONFIG_PATH
from ..core.schema_manager import add_or_edit_schema_helper, delete_schema_helper
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from ..swagger_schema.manage_schema_schema import add_or_edit_swagger_schema,delete_schema_swagger
from drf_yasg.utils import swagger_auto_schema

@swagger_auto_schema(
    methods=['post','put'],
    request_body=add_or_edit_swagger_schema['rb'],
    responses={
        200:add_or_edit_swagger_schema['response_200'],
        400:add_or_edit_swagger_schema['response_400'],
        500:add_or_edit_swagger_schema['response_500']
    },
    tags=['manage-api-client']
)
@api_view(['POST', 'PUT'])
@permission_classes([AllowAny])
def add_or_edit_schema(request,project_id):
    data = json.loads(request.body.decode("utf-8"))
    schema_id = data.get("schemaId")
    module_id = data.get("moduleId")
    schema_details = data.get("details")
    schema_name = schema_details.get("name")
    schema_file_path = f"{CONFIG_PATH}/{project_id}/swagger_schema/{module_id}.json"
    if schema_id:
        result = add_or_edit_schema_helper(schema_details=schema_details, schema_name=schema_name,file_path=schema_file_path, schema_id=schema_id)
    else:
        result = add_or_edit_schema_helper(schema_details=schema_details,schema_name=schema_name,file_path=schema_file_path )
    if not result or result.get('error'):
        return JsonResponse({"error": result.get('error') or "something went wrong.."}, status=500)
    return JsonResponse(result, status=200)


@swagger_auto_schema(
    method='delete',
    request_body=delete_schema_swagger['rb'],
    responses={
        200:delete_schema_swagger['response_200'],
        400:delete_schema_swagger['response_400'],
        500:delete_schema_swagger['response_500']
    },
    tags=['manage-api-client']
)
@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_schema(request,project_id):
    data = json.loads(request.body.decode("utf-8"))
    module_id = data.get("moduleId")
    schema_id = data.get("schemaId")
    schema_file_path = f"{CONFIG_PATH}/{project_id}/swagger_schema/{module_id}.json"
    result = delete_schema_helper(schema_file_path=schema_file_path, schemaId=schema_id)
    if not result or result.get('error'):
        return JsonResponse({"error": result.get('error') or "something went wrong.."}, status=500)
    return JsonResponse(result, status=200)