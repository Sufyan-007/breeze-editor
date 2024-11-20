from rest_framework import serializers
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiResponse,OpenApiExample,extend_schema_serializer

class ErrorSerializer(serializers.Serializer):
    error = serializers.CharField()
    
class FileApiResponseSerializer(serializers.Serializer):
    filename = serializers.CharField()
    apis = serializers.CharField()
    errors = serializers.ListField(child=serializers.CharField())

class FilesWithApisResponseSerializer(serializers.Serializer):
    files_with_apis = serializers.ListField(child=FileApiResponseSerializer())

class ApiDataSerializer(serializers.Serializer):
    id = serializers.CharField()
    tag = serializers.CharField()
class ModifyFunctionConfigRequestBodySerializer(serializers.Serializer):
    filename = serializers.CharField()
    moduleId = serializers.CharField()
    apiType = serializers.CharField()
    apiData = ApiDataSerializer()
    
class TransferToAuthRequestBodySerializer(serializers.Serializer):
    moduleId = serializers.CharField(help_text = 'id of module')
    id = serializers.CharField(help_text = 'id')
    filename = serializers.CharField(help_text = 'name of file')
    
class EditModuleTitleSerializer(serializers.Serializer):
    moduleId = serializers.CharField(help_text = 'id of module')
    title = serializers.CharField(help_text='title')
    

class AddOrEditSwaggerSerializer(serializers.Serializer):
    schemaId = serializers.CharField(required = False),
    moduleId = serializers.CharField()
    details = serializers.CharField()
    name = serializers.CharField()

class DeleteSchemaSerializer(serializers.Serializer):
    moduleId = serializers.CharField()
    schemaId = serializers.CharField()
    
class AddModuleRequestBodySerializer(serializers.Serializer):
    name = serializers.CharField()
    description = serializers.CharField()