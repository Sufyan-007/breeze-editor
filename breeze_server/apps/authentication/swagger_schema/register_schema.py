from drf_spectacular.utils import OpenApiResponse
from ..data_models.serializers import RegisterResponseSerializer,RegisterSerializer
register_schema ={
    'rb':RegisterSerializer,
    'response_201': OpenApiResponse(
        response = RegisterResponseSerializer,
        description = 'created'
    )
}

