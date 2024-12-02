from drf_yasg import openapi
from ..data_models.serializers import *
from drf_spectacular.utils import OpenApiResponse,OpenApiRequest,OpenApiExample
from ...common.serializers.ResponseSerializers import ResponseStatus400Serializer
set_env_schema = {
    'rb':{'application/json':SetEnvironmentSerializer},
    'response_200':OpenApiResponse(
        description='success',
        response=SetEnvironmentResponse200Serializer,
         examples=[
            OpenApiExample(
                name='success',
                value={'message':'Environment default has been set as active'}
            )
        ]
    ),
    
    'response_500':OpenApiResponse(
        description='Request is failed due to an error.',
        response=ResponseStatus400Serializer
    )
}

get_env_config_schema = {
    'response_500':OpenApiResponse(
        description='Request is failed due to an error.',
        response=ResponseStatus400Serializer
    ),
    'response_200':OpenApiResponse(
        
    )
}
