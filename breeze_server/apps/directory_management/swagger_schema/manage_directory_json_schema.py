from drf_yasg import openapi

parameter = [
        openapi.Parameter(
            name='project_id',
            description='id of project',
            in_=openapi.IN_PATH,
            type=openapi.TYPE_STRING
        ),
        openapi.Parameter(
            name='target_id',
            in_=openapi.IN_QUERY,
            type=openapi.TYPE_STRING,
            description='id of target node'
        )
    ]


response_200 = openapi.Response(
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
        )