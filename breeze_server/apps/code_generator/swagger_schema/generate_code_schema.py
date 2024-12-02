from drf_spectacular.utils import OpenApiRequest,OpenApiResponse
from ..data_models.serializers import GenerateServiceFileRequestBodySerializer,GenerateServiceFileResponse201Serializer
generate_service_file_schema = {
    'rb':{'application/json':GenerateServiceFileRequestBodySerializer},
    'response_201':OpenApiResponse(
            response=GenerateServiceFileResponse201Serializer,
            description=''
        )
}