from drf_yasg import openapi

login_schema ={
    'rb':openapi.Schema(
        type = openapi.TYPE_OBJECT,
        properties = {
            'username':openapi.Schema(type = openapi.TYPE_STRING,default='breeze_user'),
            'password':openapi.Schema(type = openapi.FORMAT_PASSWORD,default='breeze_user')
        },
        required = ['username','password']
    ),
    # 'form_data' : [
    # openapi.Parameter(
    #     'username',
    #     in_=openapi.IN_FORM,
    #     type=openapi.TYPE_STRING,
    #     description='username',
    #     required=True,
    #     default='breeze_user'
        
    # ),
    # openapi.Parameter(
    #     'password',
    #     in_=openapi.IN_FORM,
    #     type=openapi.TYPE_STRING,
    #     description='password',
    #     required=True,
    #     default='breeze_user'
    # ),
    # ],
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