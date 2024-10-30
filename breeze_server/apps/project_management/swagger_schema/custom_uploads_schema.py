from drf_yasg import openapi

add_custom_package_schema = {
 'rb':openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            # 'file':openapi.Schema(type=openapi.TYPE_FILE),
            'fileName':openapi.Schema(type=openapi.TYPE_STRING,description='name of file')
                                  
        }
    ),
'response_200':openapi.Response(
            description='success',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message':openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
            examples={'application/json':{'message':'File uploaded Successfully'}}
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
 'response_400':openapi.Response(
            description='Request has failed due to incorrect parameters in the request.',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error':openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
            examples={'application/json':{'error':'A folder with this name already exists.'}}
    ),
}

get_custom_package_schema = {
    'response_200':openapi.Response(
            description='success',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'folders':openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'name':openapi.Schema(type=openapi.TYPE_STRING,description='name of folder'),
                                'lastModified':openapi.Schema(type=openapi.FORMAT_DATETIME)
                            }
                        )
                        ),
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
 'response_400':openapi.Response(
            description='Request has failed due to incorrect parameters in the request.',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error':openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
            examples={'application/json':{'error':'Project name is required.'}}
    ),
}

delete_custom_package_schema = {
'rb':openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'fileName':openapi.Schema(type=openapi.TYPE_STRING,description='name of file')
                                  
        }
    ),
'response_200':openapi.Response(
            description='success',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message':openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
            examples={'application/json':{'message':'File deleted Successfully'}}
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
 'response_400':openapi.Response(
            description='Request has failed due to incorrect parameters in the request.',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error':openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
            examples={'application/json':{'error':'Project name or file name is required'}}
    ),
}