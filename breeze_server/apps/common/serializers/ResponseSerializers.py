from rest_framework import serializers

class ResponseStatus200Serializer(serializers.Serializer):
    message = serializers.CharField()
    
class ResponseStatus400Serializer(serializers.Serializer):
    error = serializers.CharField()