from drf_yasg import openapi

add_third_party_dependency_schema = {
    'parameters':[
            openapi.Parameter(
                name='projectName',
                in_=openapi.IN_PATH,
                description='name of project',
                type=openapi.TYPE_STRING,
            )
    ],
    'rb': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'name':openapi.Schema(
                type=openapi.TYPE_STRING,
                description='name of package'
            ),
            'version':openapi.Schema(
                type=openapi.TYPE_STRING,
                description='version of package'
            )
        }
    ),
    'response_200':openapi.Response(
            description='ok',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message':openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
            examples={'application/json':{'message':'Package added successfully'}}
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
            )
    ),
}

get_third_party_dependency_schema = {
    'parameters':[
            openapi.Parameter(
                name='projectName',
                in_=openapi.IN_PATH,
                description='name of project',
                type=openapi.TYPE_STRING,
            )
        ],
    'response_200':openapi.Response(
            description='ok',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'package_name':openapi.Schema(type=openapi.TYPE_STRING,description='package name and its version')
                }
            ),
            examples={'application/json':{'package_name':'version'}}
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

update_third_party_dependency_schema = {
    'parameters':[
            openapi.Parameter(
                name='projectName',
                in_=openapi.IN_PATH,
                description='name of project',
                type=openapi.TYPE_STRING,
            )
    ],
    'rb': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'name':openapi.Schema(
                type=openapi.TYPE_STRING,
                description='name of package'
            ),
            'version':openapi.Schema(
                type=openapi.TYPE_STRING,
                description='version of package'
            )
        }
    ),
    'response_200':openapi.Response(
            description='ok',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message':openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
            examples={'application/json':{'message':'Package updated successfully'}}
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
            )
    ),
    
}

delete_third_party_dependency_schema = {
    'parameters':[
            openapi.Parameter(
                name='projectName',
                in_=openapi.IN_PATH,
                description='name of project',
                type=openapi.TYPE_STRING,
            )
    ],
    'response_200':openapi.Response(
            description='ok',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message':openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
            examples={'application/json':{'message':'Package deleted successfully'}}
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
            description='Request has failed due to incorrect parameters in the request or package name is required.',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error':openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
    ),
}

