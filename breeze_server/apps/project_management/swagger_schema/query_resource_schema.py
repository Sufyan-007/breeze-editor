from drf_yasg import openapi
from drf_spectacular.utils import OpenApiParameter,OpenApiResponse
from drf_spectacular.types import OpenApiTypes
from ..data_models.serializers import ManageResourceRequestBodySerializer,ManageResourceResponse200Serializer
from ...common.serializers.ResponseSerializers import ResponseStatus400Serializer
manage_resource_schema ={
    'parameters':[
            OpenApiParameter(
                name='param',
                location=OpenApiParameter.PATH,
                description='name of project',
                type=OpenApiTypes.STR
            )
        ],
    'rb':{'application/json':ManageResourceRequestBodySerializer},

    'response_200':OpenApiResponse(
        description='Query Resource',
        response=ManageResourceResponse200Serializer
    ),
    'response_500':OpenApiResponse(
        description='Request is failed due to an error.',
        response=ResponseStatus400Serializer
    )
}