from drf_yasg import openapi

manage_resource_schema ={
    'parameters':[
            openapi.Parameter(
                name='param',
                in_=openapi.IN_PATH,
                description='name of project',
                type=openapi.TYPE_STRING,
            )
        ],
    'rb':openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "category":openapi.Schema(type = openapi.TYPE_STRING),
                "resource":openapi.Schema(type = openapi.TYPE_STRING),
                "select":openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type= openapi.TYPE_STRING
                    )
                ),
                "filter": openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "operation":openapi.Schema(type = openapi.TYPE_STRING),
                        "condition":openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(
                                type = openapi.TYPE_STRING
                            )
                        )
                    }
                ),
                "order":openapi.Schema(type = openapi.TYPE_STRING),
                "limit": openapi.Schema(type = openapi.TYPE_STRING),
                "offset": openapi.Schema(type = openapi.TYPE_STRING),
                "count": openapi.Schema(type = openapi.TYPE_STRING),
                "libname":openapi.Schema(type = openapi.TYPE_STRING),
                "libversion":openapi.Schema(type = openapi.TYPE_STRING),
                "module":openapi.Schema(type = openapi.TYPE_STRING),
                "files":openapi.Schema(type = openapi.TYPE_STRING)
            }
        ),
    'response_200':openapi.Response(
                description='Query Resource',
                schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'name': openapi.Schema(type=openapi.TYPE_STRING, description="Name of the component"),
        'id': openapi.Schema(type=openapi.TYPE_STRING, description="ID of the component"),
        'containingFile': openapi.Schema(type=openapi.TYPE_STRING, description="File where the component is contained"),
        'imports': openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'components': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(type=openapi.TYPE_STRING),
                    description="List of component imports"
                ),
                'other': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(type=openapi.TYPE_STRING),
                    description="List of other imports"
                )
            }
        ),
        'propsVars': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
        'resources': openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'name': openapi.Schema(type=openapi.TYPE_STRING, description="Resource name"),
                    'type': openapi.Schema(type=openapi.TYPE_STRING, description="Type of the resource"),
                    'body': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'datatype': openapi.Schema(type=openapi.TYPE_STRING, description="Data type"),
                            'defaultValue': openapi.Schema(type=openapi.TYPE_STRING, description="Default value"),
                            'description': openapi.Schema(type=openapi.TYPE_STRING, description="Description"),
                            'declarationType': openapi.Schema(type=openapi.TYPE_STRING, description="Declaration type")
                        }
                    ),
                    'id': openapi.Schema(type=openapi.TYPE_STRING, description="Resource ID")
                }
            )
        ),
        'html': openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                '_id': openapi.Schema(type=openapi.TYPE_STRING, description="ID of the HTML structure")
            }
        ),
        'wrapper_store': openapi.Schema(type=openapi.TYPE_STRING, description="Wrapper store value, can be null"),
         'html_elements': openapi.Schema(
            type=openapi.TYPE_OBJECT,
            additional_properties=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'type': openapi.Schema(type=openapi.TYPE_STRING, description="Element type"),
                    'elementType': openapi.Schema(type=openapi.TYPE_STRING, description="Type of HTML element"),
                    'typeId': openapi.Schema(type=openapi.TYPE_STRING, description="Element type ID"),
                    'tagName': openapi.Schema(type=openapi.TYPE_STRING, description="HTML tag name"),
                    'attributes': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        additional_properties=openapi.Schema(
                            type=openapi.TYPE_STRING
                        )
                    ),
                    'children': openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                '_id': openapi.Schema(type=openapi.TYPE_STRING, description="Child element ID")
                            }
                        )
                    )
                }
            )
        )
    }
)
            ),
    'response_500':openapi.Response(
            description='Request is failed due to an error.',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error':openapi.Schema(type=openapi.TYPE_STRING)
                }
        )
    ),
}