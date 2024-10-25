from drf_yasg import openapi

add_or_edit_swagger_schema = {
    
    'rb':openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'schemaId':openapi.Schema(type=openapi.TYPE_STRING,description='id of schema'),
            'moduleId':openapi.Schema(type=openapi.TYPE_STRING,description='id of module'),
            'details':openapi.Schema(type=openapi.TYPE_STRING,description='details of schema'),
            'name':openapi.Schema(type=openapi.TYPE_STRING,description='name of schema')
        },
        required=['name']
    ),
    'response_200':openapi.Response(
            description='created or edited',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message':openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
            examples={'application/json':{'error':'Schema Deleted or Edited Successfully'}}
    ),
    'response_400':openapi.Response(
            description='Request has failed due to incorrect parameters in the request.',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error':openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
            examples={'application/json':{'error':'Schema not found for editing or schema already exist'}}
    ),
    'response_500':openapi.Response(
            description='Error',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error':openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
        )
    
}

delete_schema_swagger = {
    'rb':openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'moduleId':openapi.Schema(type=openapi.TYPE_STRING,description='id of module'),
            'schemaId':openapi.Schema(type=openapi.TYPE_STRING,description='id of schema')
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
            examples={'application/json':{'message':'schema deleted successfully'}}
    ),
    'response_400':openapi.Response(
            description='Request has failed due to incorrect parameters in the request.',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error':openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
            examples={'application/json':{'error':'Schema id not found'}}
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