from ..data_models.serializers import UserDetailsSerializer
from ...common.serializers.ResponseSerializers import ResponseStatus400Serializer
get_user_schema = {
    'response_200':UserDetailsSerializer,
    'response_400':ResponseStatus400Serializer
}