from django.urls import path, include
from .views import manage_configs
from .views import get_file_path

urlpatterns = [
    
    # TODO: create files in views and add required method
    # past endpoint: POST - /editor/write-config 
    # both POST, PUT and DELETE will be handled for all 
    
    # component -> functions, variables, other props
    # services
    # redux
    # reducers
    # context
    # 
    path('update-project-config/', manage_configs.update_configs),
    
    # to manage whole route scenario individually
    path('routes/', include('apps.project_config_management.route_management.urls')),
    
    # to manage whole API client scenario individually
    path('manage-api-client/', include('apps.project_config_management.api_client_management.urls')),
    # ......./api-client-generator/fetch-all-intermediates
    # ......./api-client-generator/edit-module-name/
    # ......./api-client-generator/convert-standard-json
    # ......./api-client-generator/add-schema/
    # ......./api-client-generator/delete-schema/
    # ......./api-client-generator/edit-schema/
    # one API is present in code generator module
    
    
    # APIs with derived data
    path('get-file-path/', get_file_path.get_file_path),
    
    path('file/', include('apps.file_management.urls')),
]

# new endpoint -> /editor/get-file-path
# in write-resource-config -> 
    # /editor/update-html-config
    # /editor/write-services/
# manage-routes -> /editor/handle-base-route


# resource_obj = {
#   name: 'resource1', ( like component_config, app_basic_config, etc)
#   category: __through_some_enum__,
#   select : [abc, pqr, ...] -> the properties i want to see
#   filter : { 
#              operation : "ANY | All"
#              conditions :[
#                  id : [{ abc: 12 }]
#                  Name : [ 'jap', 'patel' ]
#                  AGE : [{ GT: 7}]
#              ]
#          }
#   order : "ASCENDING"
#   limit : 5
#   offset : 2
#   count : 15
# }