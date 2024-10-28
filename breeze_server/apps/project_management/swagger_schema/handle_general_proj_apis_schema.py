from drf_yasg import openapi

get_all_schema = {
    'response_200':openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'name':openapi.Schema(
            description='name of project',
            type=openapi.TYPE_OBJECT,
            properties={
                'name': openapi.Schema(type=openapi.TYPE_STRING, description="The name of the project which is used by the system"),
                'description': openapi.Schema(type=openapi.TYPE_STRING, description="Description of the project", nullable=True),
                'author': openapi.Schema(type=openapi.TYPE_STRING, description="Author of the project", nullable=True),
                'framework': openapi.Schema(type=openapi.TYPE_STRING, description="The framework used (e.g., React)"),
                'language': openapi.Schema(type=openapi.TYPE_STRING, description="Programming language (e.g., JavaScript)"),
                'styling': openapi.Schema(type=openapi.TYPE_STRING, description="Styling framework or library used (e.g., Bootstrap)"),
                'buildTool': openapi.Schema(type=openapi.TYPE_STRING, description="The build tool for the project (e.g., Create React App)"),
                'logo': openapi.Schema(type=openapi.TYPE_STRING, description="URL or path to the logo", nullable=True),
                'projectPath': openapi.Schema(type=openapi.TYPE_STRING, description="The path where the project will be located"),
                'defaultComponent': openapi.Schema(type=openapi.TYPE_STRING, description="The default component of the project"),
                'projectName': openapi.Schema(type=openapi.TYPE_STRING, description="The project name given by the user"),
                'currentEnvironment': openapi.Schema(type=openapi.TYPE_STRING, description="Current environment for the project", nullable=True),
                'path': openapi.Schema(type=openapi.TYPE_STRING, description="Full file path for the project"),
                'componentsSrcDir': openapi.Schema(type=openapi.TYPE_STRING, description="Directory where component source files are stored"),
                'dependencies': openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    description="Project dependencies",
                    properties={
                        'react-router-dom': openapi.Schema(type=openapi.TYPE_STRING, description="Version of React Router DOM"),
                        'bootstrap': openapi.Schema(type=openapi.TYPE_STRING, description="Version of Bootstrap"),
                        'react-bootstrap': openapi.Schema(type=openapi.TYPE_STRING, description="Version of React Bootstrap"),
                        "react": openapi.Schema(type=openapi.TYPE_STRING, description="Version of React"),
                        "react-dom": openapi.Schema(type=openapi.TYPE_STRING, description="Version of React Dom")
                    }
                ),
    },
            )
    }
    
)
}

add_schema ={
    # 'rb':openapi.Schema(
    #     type=openapi.TYPE_OBJECT,
    #     properties={
    #         'name':openapi.Schema(type=openapi.TYPE_STRING,description='name of project'),
    #         'description':openapi.Schema(type=openapi.TYPE_STRING,description='null'),
    #         'author':openapi.Schema(type=openapi.TYPE_STRING,description='author name'),
    #         'framework':openapi.Schema(type=openapi.TYPE_STRING,description='name of framework used in the project'),
    #         'language':openapi.Schema(type=openapi.TYPE_STRING,description='name of programming language used in the project'),
    #         'styling':openapi.Schema(type=openapi.TYPE_STRING,description='name of styling used in the project'),
    #         'buildTool':openapi.Schema(type=openapi.TYPE_STRING,description='command to create app'),
    #         'logo':openapi.Schema(type=openapi.TYPE_FILE,description='logo file'),
    #         'technology':openapi.Schema(type=openapi.TYPE_STRING,description='name of technology')
    #     }
    # ),
    'form_data' : [
    openapi.Parameter(
        'name',
        in_=openapi.IN_FORM,
        type=openapi.TYPE_STRING,
        description='name of project',
        required=True
        
    ),
    openapi.Parameter(
        'author',
        in_=openapi.IN_FORM,
        type=openapi.TYPE_STRING,
        description='author name',
        required=True
    ),
    openapi.Parameter(
        'language',
        in_=openapi.IN_FORM,
        type=openapi.TYPE_STRING,
        description='name of programming language used in the project',
        required=True,
    ),
    openapi.Parameter(
        'styling',
        in_=openapi.IN_FORM,
        type=openapi.TYPE_STRING,
        description='name of styling used in the project',
        required=True
    ),
    openapi.Parameter(
        'buildTool',
        in_=openapi.IN_FORM,
        type=openapi.TYPE_STRING,
        description='command to create app',
        required = True
    ),
    openapi.Parameter(
        'technology',
        in_=openapi.IN_FORM,
        type=openapi.TYPE_STRING,
        description='name of technology',
        required=True
    )
],

    'response_200':openapi.Response(
            description='ok',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'name':openapi.Schema(type=openapi.TYPE_STRING)
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
}

delete_schema ={
    'parameters':[
        openapi.Parameter(
            name='project_id',
            description='id of project',
            in_=openapi.IN_PATH,
            type=openapi.TYPE_STRING
        )
    ],
    'response_200':openapi.Response(
            description='',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message':openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
            examples={'application/json':{'message':'Deleted Successfully'}}
            
    ),
    'response_500':openapi.Response(
            description='Request is failed due to an error.',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error':openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
            examples={'application/json':{'error':'Failed to delete the project'}}
            
    )
}