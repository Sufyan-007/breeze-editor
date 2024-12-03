from drf_yasg import openapi
from drf_spectacular.utils import OpenApiParameter,OpenApiResponse,OpenApiExample
from drf_spectacular.types import OpenApiTypes
from ..data_models.serializers import GetAllResponse200Serializer,ProjectFormSerializer,AddResponse200Serializer
from ...common.serializers.ResponseSerializers import ResponseStatus200Serializer,ResponseStatus400Serializer
get_all_schema = {
'response_200':GetAllResponse200Serializer
}

add_schema ={
    'form_data':ProjectFormSerializer,
    'response_200':OpenApiResponse(
            description='ok',
            response=AddResponse200Serializer
        ),
    'response_500':OpenApiResponse(
            description='Request is failed due to an error.',
            response = ResponseStatus400Serializer
    ),
}

delete_schema ={
    'parameters':[
        OpenApiParameter(
            name='project_id',
            description='id of project',
            location=OpenApiParameter.PATH,
            type=OpenApiTypes.STR
        )
    ],
    'response_200':OpenApiResponse(
        description='',
        response=ResponseStatus200Serializer,
         examples=[
            OpenApiExample(
                name='success',
                value={'message':'Deleted Successfully'}
            )
        ]
        ),
    'response_500':OpenApiResponse(
        description='Request is failed due to an error.',
        response=ResponseStatus400Serializer,
         examples=[
            OpenApiExample(
                name='error',
                value={'message':'Failed to delete the project'}
            )
        ]
    )
}