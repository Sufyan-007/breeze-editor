import os, json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


@csrf_exempt
@swagger_auto_schema(
    method='post',
    
    request_body = openapi.Schema(
       title=openapi.TYPE_STRING,
       description=openapi.TYPE_STRING,
       type=openapi.TYPE_OBJECT,
       properties={
           'property_name':openapi.Schema(type=openapi.TYPE_STRING)
       },
    ),
    # operation description override
    operation_description= "Swagger template for dummy project", 
    
    # operation summary string
    operation_summary= 'operation summary', 
    
    #operation ID override; the operation ID must be unique across the whole API
    operation_id='dummy_project_create',
    
    #security requirements override; used to specify which authentication mechanism is required to call this API
    #an empty list marks the endpoint as unauthenticated (i.e. removes all accepted authentication schemes),  
    #and None will inherit the top-level security requirements
    security=[],
    
    #list of drf_yasg.openapi.Parameter
    manual_parameters = [   
        #in path parameter                        
        openapi.Parameter(
            name='id',
            in_=openapi.IN_PATH,
            description='ID',
            type=openapi.TYPE_INTEGER,
            required=True
        ),
        # in query parameter
        openapi.Parameter(
            name='status',
            in_=openapi.IN_QUERY,
            description='Status',
            type=openapi.TYPE_STRING,
            required=False,
            enum=['active', 'inactive']
        ),
        #in header parameter
        openapi.Parameter(
            name='Authorization',
            in_=openapi.IN_HEADER,
            description='Authorization token',
            type=openapi.TYPE_STRING,
            required=True
        )
        
    ],
    responses = {
                200:openapi.Response(
                   description='Success',
                    schema=openapi.Schema(
                       type=openapi.TYPE_OBJECT,
                       properties={'key':openapi.Schema(type=openapi.TYPE_STRING)}
                    ),
                ),
                201:openapi.Response(
                    description="Created",
                ),
                202:openapi.Response(
                    description="Accepted",
                ),
                400:openapi.Response(
                    description="Bad Request",
                    schema=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={'error':openapi.Schema(type=openapi.TYPE_STRING)}
                    ), 
                    examples={'application/json':{'error':'Invalid credentials'}}
                ),
                401:openapi.Response(
                    description="Unauthorized Error",
                ),
                403:openapi.Response(
                    description="Forbidden",
                ),
                404:openapi.Response(
                    description="Not found",
                ),
                500:openapi.Response(
                    description="Internal Server Error",
                ),
                501:openapi.Response(
                    description="Not Implemented",
                ),
                
    },
    tags=['Dummy Project']
)
@api_view(['POST'])
def add(request):
    data = json.loads(request.body.decode("utf-8"))
    logo_file = request.FILES.get('logo')

    response = {"name": data["name"]}
    return JsonResponse(response, status=200)
