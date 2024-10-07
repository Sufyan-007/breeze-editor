from drf_yasg import openapi

login_schema ={
    'rb':openapi.Schema(
        type = openapi.TYPE_OBJECT,
        properties = {
            'username':openapi.Schema(type = openapi.TYPE_STRING),
            'password':openapi.Schema(type = openapi.FORMAT_PASSWORD)
        },
        required = ['username','password']
    ),
    'response_200':openapi.Response(
                   description='Success',
                    schema=openapi.Schema(
                       type=openapi.TYPE_OBJECT,
                       properties={'accessToken':openapi.Schema(type=openapi.TYPE_STRING)}
                    ),
    ),
    'response_400':openapi.Response(
                    description="Bad Request",
                    schema=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={'error':openapi.Schema(type=openapi.TYPE_STRING)}
                    ),
                    examples={'application/json':{'error':'Invalid credentials'}}
                    
                    
    )
}