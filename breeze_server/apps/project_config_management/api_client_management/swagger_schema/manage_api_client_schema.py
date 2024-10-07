from drf_yasg import openapi


generate_service_config_schema ={
    'rb':openapi.Schema(
        type=openapi.TYPE_FILE
    ),
    'response_501':openapi.Response(
            description='',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error':openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
        ),
    'response_201':openapi.Response(
            description='',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'files_with_apis':openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'filename':openapi.Schema(type=openapi.TYPE_STRING),
                                'apis':openapi.Schema(type=openapi.TYPE_STRING),
                                'errors':openapi.Schema(
                                    type=openapi.TYPE_ARRAY,
                                    items = openapi.Schema(
                                        type=openapi.TYPE_STRING
                                    )
                                )
                            }
                        )
                    )
                }
            )
        )
}


modify_function_config_schema={
    'rb':openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'filename':openapi.Schema(type=openapi.TYPE_STRING),
            'moduleId':openapi.Schema(type=openapi.TYPE_STRING),
            'api_type':openapi.Schema(type=openapi.TYPE_STRING),
            'api_data':openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'id':openapi.Schema(type=openapi.TYPE_STRING),
                    'tag':openapi.Schema(type=openapi.TYPE_STRING)
                }
                )
        }
    ),
    'response_201':openapi.Response(
                description='Created',
                schema = openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'message':openapi.Schema(type=openapi.TYPE_STRING)
                    }
                ),
                examples={'application/json':{'message':'Functions added successfully'}}
            )
}

transfer_to_auth_schema = {
    'rb':openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'moduleId':openapi.Schema(type=openapi.TYPE_STRING,description='id of module'),
            'id':openapi.Schema(type=openapi.TYPE_STRING,description='id'),
            'filename':openapi.Schema(type=openapi.TYPE_STRING,description='name of file')
        }
    ),
    'response_201':openapi.Response(
            description='successful',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message':openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
            examples={'application/json':{'message':' Data transfer Successfully'}}
        )
}


edit_module_title_schema = {
    'rb':openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'moduleId':openapi.Schema(type=openapi.TYPE_STRING,description='id of module'),
            'title':openapi.Schema(type=openapi.TYPE_STRING,description='title')
        }
    ),
    'response_200':openapi.Response(
            description='Edit on a resource is successful',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message':openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
            examples={'application/json':{'message':'Module name edited Successfully'}}
        ),
    'response_400':openapi.Response(
            description='Request has failed due to incorrect parameters in the request.',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error':openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
            examples={'application/json':{'error':'module not found or module name should be unique'}}
        )
}
