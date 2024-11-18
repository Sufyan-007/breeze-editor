from drf_yasg import openapi
from drf_spectacular.utils import OpenApiResponse,OpenApiExample
from ..data_models.serializers import *
from ...common.serializers.ResponseSerializers import ResponseStatus200Serializer,ResponseStatus400Serializer
add_custom_package_schema = {

'rb':AddCustomPackageRequestBodySerializer,
'response_200':OpenApiResponse(
       description='success',
       response=ResponseStatus200Serializer,
        examples=[
            OpenApiExample(
                name='Success',
                value={'message':'File uploaded Successfully'}
            )
        ]
    ),
'response_500':OpenApiResponse(
       description='Request is failed due to an error.',
       response=ResponseStatus400Serializer,
    ),
'response_400':OpenApiResponse(
       description='Request has failed due to incorrect parameters in the request.',
       response=ResponseStatus400Serializer,
        examples=[
            OpenApiExample(
                name='Error',
                value={'error':'A folder with this name already exists.'}
            )
        ]
    ),
}
get_custom_package_schema = {
 'response_200':GetCustomPackageResponse200Serializer,
'response_500':OpenApiResponse(
       description='Request is failed due to an error.',
       response=ResponseStatus400Serializer,
    ),
'response_400':OpenApiResponse(
       description='Request has failed due to incorrect parameters in the request.',
       response=ResponseStatus400Serializer,
        examples=[
            OpenApiExample(
                name='Error',
                value={'error':'A folder with this name already exists.'}
            )
        ]
    ),
}
delete_custom_package_schema = {
'rb':DeleteCustomPackageRequestBodySerializer,
'response_200':OpenApiResponse(
       description='success',
       response=ResponseStatus200Serializer,
        examples=[
            OpenApiExample(
                name='Success',
                value={'message':'File deleted Successfully'}
            )
        ]
    ),
'response_500':OpenApiResponse(
       description='Request is failed due to an error.',
       response=ResponseStatus400Serializer,
    ),
'response_400':OpenApiResponse(
       description='Request has failed due to incorrect parameters in the request.',
       response=ResponseStatus400Serializer,
        examples=[
            OpenApiExample(
                name='Error',
                value={'error':'Project name or file name is required'}
            )
        ]
    ),
}