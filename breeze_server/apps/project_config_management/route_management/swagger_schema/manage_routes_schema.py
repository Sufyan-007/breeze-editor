from drf_yasg import openapi

get_routes_schema = {
    'parameters':[
        openapi.Parameter(
            name='target_id',
            in_=openapi.IN_QUERY,
            type=openapi.TYPE_STRING,
            description='id of target node'
        )
    ],
    'response_200':openapi.Response(
            description='success',
            schema= openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                            'node':openapi.Schema(type=openapi.TYPE_STRING,description='target_id'),
                            'children':openapi.Schema(
                                type=openapi.TYPE_ARRAY,description="array of node's children",
                                items=openapi.Schema(
                                    type=openapi.TYPE_OBJECT,
                                    description='details of each child node',
                                    properties={
                                        'id':openapi.Schema(type=openapi.TYPE_STRING,description='id of node'),
                                        'name':openapi.Schema(type=openapi.TYPE_STRING,description='name of node'),
                                        'parent_id':openapi.Schema(type=openapi.TYPE_STRING,description='parent id'),
                                        'type':openapi.Schema(type=openapi.TYPE_STRING,description='type of node - either Directory or File')
                                    }
                                )
                            )
                }
            )
    ),
    'response_400':openapi.Response(
            description='Request has failed due to incorrect parameters in the request.',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error':openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
            examples={'application/json':{'error':'id not found'}}
    ),
}

get_all_routes_fullpath_schema = {
    'parameters':[
        openapi.Parameter(
            name='target_id',
            in_=openapi.IN_QUERY,
            type=openapi.TYPE_STRING,
            description='id of target node'
        )
    ],
    'response_200':openapi.Response(
            description='ok',
            schema = openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'nodes':openapi.Schema(
                        description='Array of objects where each object has id of leaf node and path to leaf node stored as key ',
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'id':openapi.Schema(type=openapi.TYPE_STRING,description='id of leaf node'),
                                'path':openapi.Schema(type=openapi.TYPE_STRING,description='path to leaf node')
                            }
                        )
                    )
                }
            )
        )
}

add_route_schema ={
    'rb':openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'path': openapi.Schema(type=openapi.TYPE_STRING, description="The URL path for the route"),
        'componentId': openapi.Schema(type=openapi.TYPE_STRING, description="The ID of the component to render for the route"),
        'children': openapi.Schema(type=openapi.TYPE_ARRAY, description="List of child routes", items=openapi.Schema(type=openapi.TYPE_OBJECT)),
        'parentId': openapi.Schema(type=openapi.TYPE_STRING, description="The parent route ID, if applicable", nullable=True),
        'props': openapi.Schema(type=openapi.TYPE_STRING, description="Properties to pass to the component", nullable=True),
        'redirectTo': openapi.Schema(type=openapi.TYPE_STRING, description="The path to redirect to, if applicable", nullable=True),
        'hydrateFallbackElementId': openapi.Schema(type=openapi.TYPE_STRING, description="Fallback element for hydration", nullable=True),
        'errorElementId': openapi.Schema(type=openapi.TYPE_STRING, description="Element ID to display on error", nullable=True),
        'loader': openapi.Schema(type=openapi.TYPE_STRING, description="The loader function for the route", nullable=True),
        'lazy': openapi.Schema(type=openapi.TYPE_STRING, description="The lazy load function for the component", nullable=True),
        'action': openapi.Schema(type=openapi.TYPE_STRING, description="Action function to run on the route", nullable=True),
        'shouldRevalidate': openapi.Schema(type=openapi.TYPE_STRING, description="Function to determine if the route should revalidate", nullable=True),
        'caseSensitive': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Whether the path is case-sensitive"),
        'index': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Indicates if the route is an index route"),
    },
    required=['path', 'componentId']  # Marking required fields
),
    'response_500':openapi.Response(
            description='Request is failed due to an error.',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error':openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
        )
}

update_route_schema = {
    'rb':openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'path': openapi.Schema(type=openapi.TYPE_STRING, description="The URL path for the route"),
            'componentId': openapi.Schema(type=openapi.TYPE_STRING, description="The ID of the component to render for the route"),
            'id': openapi.Schema(type=openapi.TYPE_STRING, description="Unique identifier for the route"),
        },
        required=['path', 'componentId', 'id']  # Marking required fields
    ),
    'response_500':openapi.Response(
            description='Request is failed due to an error.',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error':openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
    )
    
}

delete_route_schema ={
    'rb':openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'id':openapi.Schema(type=openapi.TYPE_STRING,description='Unique identifier for the route')
        }
    ),
    'response_200':openapi.Response(
            description='Delete on a resource is successful',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message':openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
            examples={'application/json':{'message':'deleted successfully'}}
    ),
    'response_500':openapi.Response(
            description='Request is failed due to an error.',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error':openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
    )
}