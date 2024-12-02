from drf_yasg import openapi
from drf_spectacular.utils import OpenApiParameter,OpenApiResponse,OpenApiExample
from drf_spectacular.types import OpenApiTypes
from ..data_models.serializers import GetThirdPartyResponse200Serializer,AddOrUpdateThirdPartyRequestBodySerializer
from ...common.serializers.ResponseSerializers import ResponseStatus200Serializer,ResponseStatus400Serializer
add_third_party_dependency_schema = {
    'parameters':[
            OpenApiParameter(
                name='projectName',
                location=OpenApiParameter.PATH,
                description='name of project',
                type=OpenApiTypes.STR
            )
    ],
    'rb':{'application/json':AddOrUpdateThirdPartyRequestBodySerializer},
    'response_200':OpenApiResponse(
        description='ok',
        response=ResponseStatus200Serializer,
         examples=[
            OpenApiExample(
                name='success',
                value={'message':'Package added successfully'}
            )
        ]
    ),
    'response_500':OpenApiResponse(
        description='Request is failed due to an error.',
        response=ResponseStatus400Serializer
    ),
     'response_400':OpenApiResponse(
            description='Request has failed due to incorrect parameters in the request.',
            response=ResponseStatus400Serializer
    ),
}

get_third_party_dependency_schema = {
    'parameters':[
            OpenApiParameter(
                name='projectName',
                location=OpenApiParameter.PATH,
                description='name of project',
                type=OpenApiTypes.STR
            )
        ],
    'response_200':OpenApiResponse(
            description='ok',
            response=GetThirdPartyResponse200Serializer,
            examples=[
            OpenApiExample(
                name='success',
                value={'package_name':'version'}
            )
            ],
        ),
    'response_500':OpenApiResponse(
            description='Request is failed due to an error.',
            response=ResponseStatus400Serializer
    ),
}

update_third_party_dependency_schema = {
    'parameters':[
            OpenApiParameter(
                name='projectName',
                location=OpenApiParameter.PATH,
                description='name of project',
                type=OpenApiTypes.STR
            )
    ],
    'rb':{'application/json':AddOrUpdateThirdPartyRequestBodySerializer},
    'response_200':OpenApiResponse(
            description='ok',
            response=ResponseStatus200Serializer,
            examples=[
            OpenApiExample(
                name='success',
                value={'message':'Package updated successfully'}
            )
            ],
        ),
    'response_500':OpenApiResponse(
            description='Request is failed due to an error.',
            response=ResponseStatus400Serializer
    ),
     'response_400':OpenApiResponse(
            description='Request has failed due to incorrect parameters in the request.',
            response=ResponseStatus400Serializer
    ),
    
}

delete_third_party_dependency_schema = {
    'parameters':[
            OpenApiParameter(
                name='projectName',
                location=OpenApiParameter.PATH,
                description='name of project',
                type=OpenApiTypes.STR
            )
    ],
    'response_200':OpenApiResponse(
            description='ok',
            response=ResponseStatus200Serializer,
            examples=[
            OpenApiExample(
                name='success',
                value={'message':'Package deleted successfully'}
            )
            ]
        ),
    'response_500':OpenApiResponse(
            description='Request is failed due to an error.',
            response=ResponseStatus400Serializer
    ),
     'response_400':OpenApiResponse(
            description='Request has failed due to incorrect parameters in the request or package name is required.',
            response=ResponseStatus400Serializer
    ),
}

