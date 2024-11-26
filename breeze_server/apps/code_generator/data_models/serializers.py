from rest_framework import serializers

class GenerateServiceFileRequestBodySerializer(serializers.Serializer):
    filename = serializers.CharField(
        help_text="Name of file",
        max_length=255
    )
    moduleID = serializers.CharField(
        help_text="ID of module",
        max_length=255
    )
class GenerateServiceFileResponse201Serializer(serializers.Serializer):
    items = serializers.ListField(
        child=serializers.CharField(),
        help_text="An array of strings"
    )