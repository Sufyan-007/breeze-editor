from drf_yasg import openapi

generate_service_file_schema = {
    'rb':openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'filename':openapi.Schema(
                type=openapi.TYPE_STRING,
                description='name of file'
            ),
            'moduleID':openapi.Schema(
                type=openapi.TYPE_STRING,
                description='id of module'
            )
        }
    ),
    'response_201':openapi.Response(
            schema=openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(type=openapi.TYPE_STRING)
            ),
            description=''
        )
}