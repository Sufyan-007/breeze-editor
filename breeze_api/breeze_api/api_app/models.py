from django.db import models
from rest_framework import serializers

# Create your models here.
class ConfigWriterSerializer(serializers.Serializer):
    name = serializers.CharField()
    description = serializers.CharField()
    author = serializers.CharField()
    defaultComponent = serializers.CharField()
    strictMode = serializers.BooleanField()
    path = serializers.CharField()
    components_src_dir = serializers.CharField()
    dependencies = serializers.DictField()

