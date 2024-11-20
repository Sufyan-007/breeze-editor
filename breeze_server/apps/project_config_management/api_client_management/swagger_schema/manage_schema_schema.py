from drf_yasg import openapi
from rest_framework import serializers
from drf_spectacular.utils import OpenApiResponse,OpenApiExample
from ..data_models.serializers import AddOrEditSwaggerSerializer,DeleteSchemaSerializer
from ....common.serializers.ResponseSerializers import ResponseStatus200Serializer,ResponseStatus400Serializer
    
add_or_edit_swagger_schema = {
    'rb':AddOrEditSwaggerSerializer,
    'response_200':OpenApiResponse(
          description='created or edited',
          response=ResponseStatus200Serializer,
          examples=[
            OpenApiExample(
                name='Success',
                value={'message':'Schema Deleted or Edited Successfully'}
            )
        ]
        ),
    'response_400':OpenApiResponse(
          description='Request has failed due to incorrect parameters in the request.',
          response=ResponseStatus400Serializer,
          examples=[
            OpenApiExample(
                name='Error',
                value={'error':'Schema not found for editing or schema already exist'}
            )
        ]
        ),
    'response_500':OpenApiResponse(
          description='Error',
          response=ResponseStatus400Serializer,
        ),
    
    
}

delete_schema_swagger = {
    'rb':DeleteSchemaSerializer,
    'response_200':OpenApiResponse(
        description='Delete on a resource is successful',
        response=ResponseStatus200Serializer,
        examples=[
            OpenApiExample(
                name='Success',
                value={'message':'schema deleted successfully'}
            )
        ]
    ),
    'response_400':OpenApiResponse(
          description='Request has failed due to incorrect parameters in the request.',
          response=ResponseStatus400Serializer,
          examples=[
            OpenApiExample(
                name='Error',
                value={'error':'Schema id not found'}
            )
        ]
        ),
    'response_500':OpenApiResponse(
          description='Request is failed due to an error',
          response=ResponseStatus400Serializer,
        ),
}