from rest_framework import serializers

class ChildRouteSerializer(serializers.Serializer):
    id = serializers.CharField(help_text="ID of route")
    path = serializers.CharField(help_text="Path of route")
    component_id = serializers.CharField(help_text="Route's component ID")
    component_name = serializers.CharField(help_text="Route's component name")

class GetRouteResponseStatus200Serializer(serializers.Serializer):
    node = serializers.CharField(help_text="Target ID")
    children = serializers.ListSerializer(
        child=ChildRouteSerializer(),
        help_text="Array of node's children, each with route details"
    )
    
class LeafNodeSerializer(serializers.Serializer):
    id = serializers.CharField(help_text="ID of leaf node")
    path = serializers.CharField(help_text="Path to leaf node")

class GetAllRoutesResponeStatus200Serializer(serializers.Serializer):
    nodes = serializers.ListSerializer(
        child=LeafNodeSerializer(),
        help_text="Array of objects where each object has the ID of a leaf node and the path to the leaf node stored as key"
    )
    
class AddRouteRequestBodySerializer(serializers.Serializer):
    path = serializers.CharField(help_text="The URL path for the route",required=True)
    parentPath = serializers.CharField(help_text="path of parent", required=False, allow_null=True)
    props = serializers.ListField(child=serializers.CharField(), help_text="Properties to pass to the component", required=False, allow_null=True)
    element = serializers.CharField(help_text="The hpath to redirect to, if applicable", required=True, allow_null=True)
    errorElement = serializers.CharField(help_text=" error element", required=False, allow_null=True)
    loader = serializers.CharField(help_text="The loader function for the route", required=False, allow_null=True)
    lazy = serializers.CharField(help_text="The lazy load function for the component", required=False, allow_null=True)
    action = serializers.CharField(help_text="Action function to run on the route", required=False, allow_null=True)
    caseSensitive = serializers.BooleanField(help_text="Whether the path is case-sensitive",required=False)
    index = serializers.BooleanField(help_text="Indicates if the route is an index route",required=False)
    componentId = serializers.CharField(help_text="The ID of the component to render for the route")


class UpdateRouteRequestBodySerializer(AddRouteRequestBodySerializer):
    id = serializers.CharField(
        help_text="Unique identifier for the route"
    )  
    
class DeleteRouteRequestBodySerializer(serializers.Serializer):
    # ROUTING_CONFIG_CURRENT_VERSION = serializers.CharField(help_text="The latest version of routing config")
    id = serializers.CharField(
        help_text="Unique identifier for the route"
    )
    
class ResponseStatus200Serializer(serializers.Serializer):
    message = serializers.CharField()
    