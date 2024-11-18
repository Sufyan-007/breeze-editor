from drf_yasg import openapi
from ..data_models.serializers import GetAllRoutesResponeStatus200Serializer,GetRouteResponseStatus200Serializer,AddRouteRequestBodySerializer,UpdateRouteRequestBodySerializer,DeleteRouteRequestBodySerializer
from drf_spectacular.utils import OpenApiResponse,OpenApiExample,OpenApiParameter,OpenApiRequest
from drf_spectacular.types import OpenApiTypes
from ....common.serializers.ResponseSerializers import ResponseStatus200Serializer,ResponseStatus400Serializer
get_routes_schema = {
    'parameters':[
        OpenApiParameter(
            name='target_id',
            location=OpenApiParameter.QUERY,
            type=OpenApiTypes.STR,
            description='id of target route'
        )
        ],
    # 'response_200':openapi.Response(
    #         description='success',
    #         schema= openapi.Schema(
    #             type=openapi.TYPE_OBJECT,
    #             properties={
    #                         'node':openapi.Schema(type=openapi.TYPE_STRING,description='target_id'),
    #                         'children':openapi.Schema(
    #                             type=openapi.TYPE_ARRAY,description="array of node's children",
    #                             items=openapi.Schema(
    #                                 type=openapi.TYPE_OBJECT,
    #                                 description='details of each child route',
    #                                 properties={
    #                                     'id':openapi.Schema(type=openapi.TYPE_STRING,description='id of route'),
    #                                     'path':openapi.Schema(type=openapi.TYPE_STRING,description='path of route'),
    #                                     'component_id':openapi.Schema(type=openapi.TYPE_STRING,description='route\'s component id'),
    #                                     'component_name':openapi.Schema(type=openapi.TYPE_STRING,description='route\'s component name')
    #                                 }
    #                             )
    #                         )
    #             }
    #         )
    # ),
    'response_200':OpenApiResponse(
        description='success',
        response=GetRouteResponseStatus200Serializer
    ),
    # 'response_400':openapi.Response(
    #         description='Request has failed due to incorrect parameters in the request.',
    #         schema=openapi.Schema(
    #             type=openapi.TYPE_OBJECT,
    #             properties={
    #                 'error':openapi.Schema(type=openapi.TYPE_STRING)
    #             }
    #         ),
    #         examples={'application/json':{'error':'id not found'}}
    # ),
    'response_400':OpenApiResponse(
          description='Request has failed due to incorrect parameters in the request.',
          response=ResponseStatus400Serializer,
          examples=[
            OpenApiExample(
                name='Error',
                value={'error':' id not found'}
            )
        ]
        ),
}

get_all_routes_fullpath_schema = {
    # 'parameters':[
    #     openapi.Parameter(
    #         name='target_id',
    #         in_=openapi.IN_QUERY,
    #         type=openapi.TYPE_STRING,
    #         description='id of target route'
    #     )
    # ],
    'parameters':[
        OpenApiParameter(
            name='target_id',
            location=OpenApiParameter.QUERY,
            type=OpenApiTypes.STR,
            description='id of target route'
        )
    ],
    # 'response_200':openapi.Response(
    #         description='ok',
    #         schema = openapi.Schema(
    #             type=openapi.TYPE_OBJECT,
    #             properties={
    #                 'nodes':openapi.Schema(
    #                     description='Array of objects where each object has id of leaf node and path to leaf node stored as key ',
    #                     type=openapi.TYPE_ARRAY,
    #                     items=openapi.Schema(
    #                         type=openapi.TYPE_OBJECT,
    #                         properties={
    #                             'id':openapi.Schema(type=openapi.TYPE_STRING,description='id of leaf node'),
    #                             'path':openapi.Schema(type=openapi.TYPE_STRING,description='path to leaf node')
    #                         }
    #                     )
    #                 )
    #             }
    #         )
    #     )
    'response_200':OpenApiResponse(
        description='ok',
        response=GetAllRoutesResponeStatus200Serializer
    )
}

add_route_schema ={
#     'rb':openapi.Schema(
#     type=openapi.TYPE_OBJECT,
#     properties={
#         'path': openapi.Schema(type=openapi.TYPE_STRING, description="The URL path for the route"),
#         'componentId': openapi.Schema(type=openapi.TYPE_STRING, description="The ID of the component to render for the route"),
#         'children': openapi.Schema(type=openapi.TYPE_ARRAY, description="List of child routes", items=openapi.Schema(type=openapi.TYPE_OBJECT)),
#         'parentId': openapi.Schema(type=openapi.TYPE_STRING, description="The parent route ID, if applicable", nullable=True),
#         'props': openapi.Schema(type=openapi.TYPE_ARRAY, items = openapi.Schema(type=openapi.TYPE_STRING) , description="Properties to pass to the component", nullable=True),
#         'redirectTo': openapi.Schema(type=openapi.TYPE_STRING, description="The path to redirect to, if applicable", nullable=True),
#         'hydrateFallbackElementId': openapi.Schema(type=openapi.TYPE_STRING, description="Fallback element for hydration", nullable=True),
#         'errorElementId': openapi.Schema(type=openapi.TYPE_STRING, description="Element ID to display on error", nullable=True),
#         'loader': openapi.Schema(type=openapi.TYPE_STRING, description="The loader function for the route", nullable=True),
#         'lazy': openapi.Schema(type=openapi.TYPE_STRING, description="The lazy load function for the component", nullable=True),
#         'action': openapi.Schema(type=openapi.TYPE_STRING, description="Action function to run on the route", nullable=True),
#         'shouldRevalidate': openapi.Schema(type=openapi.TYPE_STRING, description="Function to determine if the route should revalidate", nullable=True),
#         'caseSensitive': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Whether the path is case-sensitive"),
#         'index': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Indicates if the route is an index route"),
#     },
#     required=['path', 'componentId']  # Marking required fields
# ),
    'rb':OpenApiRequest(
        request=AddRouteRequestBodySerializer
    ),
    'response_500':OpenApiResponse(
        description='Request is failed due to an error.',
        response=ResponseStatus400Serializer
    )
}

update_route_schema = {
    'rb':UpdateRouteRequestBodySerializer,
    'response_500':OpenApiResponse(
        description='Request is failed due to an error.',
        response=ResponseStatus400Serializer
    )
    
}

delete_route_schema ={
    'rb':DeleteRouteRequestBodySerializer,
    'response_200':OpenApiResponse(
        description='Delete on a resource is successful',
        response=ResponseStatus200Serializer,
        examples=[
            OpenApiExample(
                name='Success',
                value={'message':'deleted Successfully'}
            )
        ]
        
    ),
    'response_500':OpenApiResponse(
         description='Request is failed due to an error.',
         response=ResponseStatus400Serializer
    )
}