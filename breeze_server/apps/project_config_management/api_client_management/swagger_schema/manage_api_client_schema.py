from drf_yasg import openapi

from drf_spectacular.utils import OpenApiResponse,OpenApiExample,extend_schema_serializer
from ..data_models.serializers import *
from ....common.serializers.ResponseSerializers import ResponseStatus200Serializer,ResponseStatus400Serializer
generate_service_config_schema ={
    'rb': {
        'multipart/form-data': {
            'type': 'object',
            'properties': {
                'file':{
                    'type':'string',
                    'format':'binary',
                }
            },
        }
        
    },
    'response_500':OpenApiResponse(
        response = ErrorSerializer,
    ),
    'response_201':OpenApiResponse(
        response=FilesWithApisResponseSerializer,
        description=''
    )
}


modify_function_config_schema={
    'rb':{'application/json':ModifyFunctionConfigRequestBodySerializer},
    'response_200':OpenApiResponse(
        description='created',
        response=ResponseStatus200Serializer,
        examples=[
            OpenApiExample(
                name='Success',
                value={'message':'Function added successfully'}
            )
        ]
    )
    
}

transfer_to_auth_schema = {
    'rb':{'application/json':TransferToAuthRequestBodySerializer},
    'response_200':OpenApiResponse(
        description='successful',
        response=ResponseStatus200Serializer,
        examples=[
            OpenApiExample(
                name='Success',
                value={'message':'Data transfer Successfully'}
            )
        ]
    )
}


edit_module_title_schema = {
    'rb':{'application/json':EditModuleTitleSerializer},
    'response_200':OpenApiResponse(
        description='Edit on a resource is successful',
        response=ResponseStatus200Serializer,
        examples=[
            OpenApiExample(
                name='Success',
                value={'message':'Module name edited Successfully'}
            )
        ]
    ),
    'response_400':OpenApiResponse(
        description='Request has failed due to incorrect parameters in the request.',
        response=ResponseStatus400Serializer,
        examples=[
            OpenApiExample(
                name='Not Found',
                value={'error':'module not found or module name should be unique'}
            ),
            OpenApiExample(
                name='Not Unique',
                value={'error':'module name should be unique'}
            )
        ]
    )
}

get_response_token_schema = {
    'response_400':OpenApiResponse(
        description='Request has failed due to incorrect parameters in the request.',
        response=ResponseStatus400Serializer,
        examples=[
            OpenApiExample(
                name='Bad Request',
                value={'error':'Module ID or API ID not provided'}
            )
        ]
    ),
    'response_404':OpenApiResponse(
        description='Not Found',
        response=ResponseStatus400Serializer,
        examples=[
            OpenApiExample(
                name='Not Found',
                value={'error':'File Not Found'}
            )
        ]
    )
}

add_module_schema = {
    'rb':{'application/json':AddModuleRequestBodySerializer}
}
