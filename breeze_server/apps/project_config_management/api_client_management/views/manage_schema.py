import json,os
from django.http import JsonResponse
from ....common.constants.consts import CONFIG_PATH
from ..core.schema_manager import add_or_edit_schema_helper, delete_schema_helper, resolve_schemas_helper,get_all_schemas_helper,get_schema_by_id_helper
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from ..swagger_schema.manage_schema_schema import add_or_edit_swagger_schema,delete_schema_swagger
from drf_spectacular.utils import extend_schema

@extend_schema(
    methods=['POST','PUT'],
    request=add_or_edit_swagger_schema['rb'],
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
    edited_name = data.get("editedName")
    schema_name = schema_details.get("name")
    if not module_id:
        return JsonResponse({'error': 'Module ID is required'}, status=400)
    schema_file_path = f"{CONFIG_PATH}/{project_id}/models/{module_id}.json"
    if schema_id:
        result,status = add_or_edit_schema_helper(schema_details=schema_details, schema_name=schema_name,file_path=schema_file_path, schema_id=schema_id, edited_name=edited_name)
    else:
        result,status = add_or_edit_schema_helper(schema_details=schema_details,schema_name=schema_name,file_path=schema_file_path )
    return JsonResponse(result, status=status)



@extend_schema(
    methods=['DELETE'],
    request=delete_schema_swagger['rb'],
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
    schema_file_path = f"{CONFIG_PATH}/{project_id}/models/{module_id}.json"
    result,status = delete_schema_helper(schema_file_path=schema_file_path, schemaId=schema_id)
    return JsonResponse(result, status=status)

@extend_schema(
    tags=['manage-api-client'],
    request=None,
    responses=None
)
@api_view(['POST'])
@permission_classes([AllowAny])
def resolve_schemas(request,project_id):
    data = json.loads(request.body.decode("utf-8"))
    module_id = data.get("moduleId")
    schema_id = data.get("schemaId")
    new_schema_name = data.get("newName")
    schema_details = data.get("schemaDetails")
    property_details = data.get("propertyDetails")
    existing_schema_id = data.get("existingSchemaId")
    schema_file_path = f"{CONFIG_PATH}/{project_id}/models/{module_id}.json"
    result,status = resolve_schemas_helper(schema_file_path=schema_file_path, schemaId=schema_id, new_schema_name=new_schema_name, details=schema_details, property_details=property_details, existing_schema_id = existing_schema_id)
    return JsonResponse(result, status=status)


@api_view(['POST'])
@permission_classes([AllowAny])
def get_all_schemas(request,project_id):
    result,status = get_all_schemas_helper(project_id)
    return JsonResponse(result, status=status)
    
    
@api_view(['GET'])
@permission_classes([AllowAny])
def get_schema_by_id(request,project_id,schema_id):
    result,status = get_schema_by_id_helper(project_id, schema_id)
    return JsonResponse(result, status=status)