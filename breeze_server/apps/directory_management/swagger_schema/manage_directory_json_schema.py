from drf_yasg import openapi
from drf_spectacular.utils import OpenApiParameter,OpenApiResponse
from drf_spectacular.types import OpenApiTypes
from .. data_models.serializers import GetDirectorySchemaResponse200Serializer
get_directories_schema = {
    'parameters':[
        OpenApiParameter(
            name='project_id',
            description='id of project',
            location=OpenApiParameter.PATH,
            type=OpenApiTypes.STR
        ),
        OpenApiParameter(
            name='target_id',
            description='id of target node',
            location=OpenApiParameter.QUERY,
            type=OpenApiTypes.STR
            
        )
    ],
    'response_200':OpenApiResponse(
        description='success',
        response=GetDirectorySchemaResponse200Serializer
    )
}
