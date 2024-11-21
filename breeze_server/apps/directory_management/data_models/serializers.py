from rest_framework import serializers

class GetFileContentResponse200Serializer(serializers.Serializer):
    code = serializers.CharField(help_text="Content of the file")

class ChildNodeSerializer(serializers.Serializer):
    id = serializers.CharField(help_text="ID of the node")
    name = serializers.CharField(help_text="Name of the node")
    parent_id = serializers.CharField(help_text="Parent ID")
    type = serializers.CharField(help_text="Type of node - either Directory or File")

class GetDirectorySchemaResponse200Serializer(serializers.Serializer):
    node = serializers.CharField(help_text="Target ID")
    children = ChildNodeSerializer(many=True, help_text="Array of node's children", required=False)