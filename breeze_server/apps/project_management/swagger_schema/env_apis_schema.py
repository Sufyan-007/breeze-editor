from drf_yasg import openapi


set_env_schema = {
    'rb':openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'environmentName':openapi.Schema(type=openapi.TYPE_STRING,description='name of environment')
        }
    ),
     'response_200':openapi.Response(
            description='success',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'status':openapi.Schema(type=openapi.TYPE_STRING),
                    'message':openapi.Schema(type=openapi.TYPE_STRING)
                },
                examples={'application/json':{'message':'Environment default has been set as active'}}
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

get_env_config_schema = {
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

# add_env_config_schema = {
#     'rb':openapi.Schema(
#         type=openapi.TYPE_OBJECT,
#         properties={
#             'envVars':openapi.Schema(type=openapi.TYPE_STRING),
#             'environments':openapi.Schema(type=openapi.TYPE_STRING)
#         }
#     )
# }

# update_env_config_schema = {
#     'rb':openapi.Schema(
#         type=openapi.TYPE_OBJECT,
#         properties={
#             'envVariableId':openapi.Schema(type=openapi.TYPE_STRING),
#             'envVars':openapi.Schema(type=openapi.TYPE_STRING)
#         }
#     )
# }