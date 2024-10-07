from drf_yasg import openapi

register_schema ={
    'rb':openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "username":openapi.Schema(type=openapi.TYPE_STRING),
            "email":openapi.Schema(type=openapi.FORMAT_EMAIL),
            "password":openapi.Schema(type=openapi.FORMAT_PASSWORD)
        },
        required=['username','password','email']
    ),
    'response_201':openapi.Response(
                    description='created',
                    schema=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={'accessToken':openapi.Schema(type=openapi.TYPE_STRING)}
                    )
                )
}