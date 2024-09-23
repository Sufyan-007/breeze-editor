import json
import os
import re
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from ...common.constants.enums.ResourceCategory import ResourceCategory
from ...common.utils.file_helper import read_json_file,read_file,write_json_file
from ...common.constants.consts import CONFIG_PATH,THIRD_PARTY_CONFIG_PATH
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
# from ...common.constants
# found_keys=[]
@swagger_auto_schema(
        method='post',
        manual_parameters=[
            openapi.Parameter(
                name=openapi.TYPE_STRING,
                in_=openapi.IN_PATH,
                description='name of project',
                type=openapi.TYPE_STRING,
            )
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "catagory":openapi.Schema(type = openapi.TYPE_STRING),
                "resource":openapi.Schema(type = openapi.TYPE_STRING),
                "select":openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type= openapi.TYPE_STRING
                    )
                ),
                "filter": openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "operation":openapi.Schema(type = openapi.TYPE_STRING),
                        "condition":openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(
                                type = openapi.TYPE_STRING
                            )
                        )
                    }
                ),
                "order":openapi.Schema(type = openapi.TYPE_STRING),
                "limit": openapi.Schema(type = openapi.TYPE_STRING),
                "offset": openapi.Schema(type = openapi.TYPE_STRING),
                "count": openapi.Schema(type = openapi.TYPE_STRING),
                "libname":openapi.Schema(type = openapi.TYPE_STRING),
                "libversion":openapi.Schema(type = openapi.TYPE_STRING),
            }
        )

        # responses={
        #     200:openapi.Response(
        #         description='returned successfully',
        #         schema=openapi.Schema(
        #             type=openapi.TYPE_OBJECT,
        #             properties={

        #             }
        #         )
        #     )
        # }
)
@csrf_exempt
@require_POST
@api_view(['POST'])
@permission_classes([AllowAny])

def manage_resource(request,param):
    try:
        projectname = param
        data = json.loads(request.body)
        category = data.get('category') or None
        resource = data.get('resource') or None
        select = data.get('select') or None
        filter = data.get('filter') or None
        order = data.get('order') or None
        limit = data.get('limit') or None
        offset = data.get('offset') or None
        count=data.get('count') or None
        libname=data.get('libname') or None
        libversion=data.get('libversion') or None
    
        selected_data={}
        if not category:
            return JsonResponse({'error':'categroy is required'},status=400)
        
        elif category not in [ResourceCategory.COMPONENTS.value , ResourceCategory.SERVICES.value , ResourceCategory.THIRD_PARTY.value]:
            return JsonResponse({"error":"categroy is not defined"},status = 400)
        
        if category in [ResourceCategory.COMPONENTS.value,ResourceCategory.SERVICES.value]:
            if not resource:
                resource='index'
            selected_data=get_json_config_data(resource, category, projectname)
            # return JsonResponse({"message": f"{selected_data}"}, status=200)
        
        if category in [ResourceCategory.THIRD_PARTY.value]:
            if not libname or not libversion:
                config_path=os.path.join(THIRD_PARTY_CONFIG_PATH,'index.json')
                selected_data=read_file(config_path)
                return JsonResponse({"data":f"{selected_data}"},status=200) 
            else:
                try:
                    library=f"{libname}@{libversion}"
                    # print(library)
                    config_path=os.path.join(THIRD_PARTY_CONFIG_PATH,library,'component')
                    if not resource:
                        resource="index"
                        config_path=os.path.join(config_path,f'{resource}.json')
                        selected_data=read_file(config_path)
                        # print(selected_data)
                    else:
                        file_name=''
                        with open(f"{config_path}/index.json",'rb') as index_config:
                            index_data = json.load(index_config)
                            for key,value  in index_data.items():
                                if value == resource:
                                    file_name=key
                                    break
                        config_path=os.path.join(config_path,f'{file_name}.json')
                        selected_data=read_file(config_path)
                except Exception as e:
                    return JsonResponse({"error":"Error while read third_party data"},status=400)
                                      
        if select:
            if not resource:
                return JsonResponse({"error":'Resource are not there'},status = 400)
            
            else:
                try:
                    selected_data = {key: get_nested_value(selected_data, key) for key in select}
                except Exception as e:
                    return JsonResponse({"error2":str(e)},status = 400)
        

        return JsonResponse({'data':selected_data},status=200)
    except Exception as e:
        return JsonResponse({"error":str(e)},status=500)
    
def get_json_config_data(resource, category, projectname):
    try:
        config_path=os.path.join(CONFIG_PATH,projectname)
        config_data = read_json_file(config_path, category.lower(),resource,version="latest")
        return config_data
    except Exception as e:
        print(f"Error loading JSON config: {str(e)}")
        return None
    

def get_nested_value(data, path):
    keys = path.split(".")  # Split path by dot notation
    value = data

    for key in keys:
        # Check if the current value is a list, which indicates an array
        if isinstance(value, list):
            # If the key is referring to an attribute inside objects in the array
            value = [item.get(key, None) for item in value if isinstance(item, dict)]
        elif isinstance(value, dict):
            if key in value:
                value=value[key]

            else:
                found_keys=[]
                for element_name, val in value.items():
                    if isinstance(val, dict):
                        for k,v in val.items():
                            found_keys.append(k)
                if key in found_keys:
                    object_data={}
                    for element_name, val in value.items():
                        if isinstance(val, dict) and key in val:
                            object_data[f"{element_name}.{key}"] = val[key]
                    return object_data
                else:
                    return None  # Key doesn't exist, return None
        else:
            return None  # If it's neither a list nor a dict, return None

    return value
























# def get_nested_value(data, path):
#     keys = path.split(".")
#     value = data

#     for key in keys:
#         if isinstance(value, dict):
#             if key in value:
#                 value = value[key]  # Traverse deeper into the dictionary
#             else:
#                 return None  # Key doesn't exist, return None
#         else:
#             return None  # If it's neither a list nor a dict, return None

#     return value

# # Recursive function to traverse object of objects and extract a specific key (e.g., 'type')
# def get_all_nested_values(data, path):
#     results = {}

#     for key, value in data.items():
#         if isinstance(value, dict):
#             if path in value:
#                 # Collect the value from the nested object
#                 results[key] = value[path]
#             # Recursively go deeper for nested dictionaries
#             nested_results = get_all_nested_values(value, path)
#             for nested_key, nested_value in nested_results.items():
#                 results[f"{key}.{nested_key}"] = nested_value

#     return results

# # Function to handle both object traversal and array-like access for selected fields
# def get_data_for_select(data, select):
#     selected_data = {}
    
#     for path in select:
#         keys = path.split(".")
#         if keys[-1] == "type" and len(keys) > 2:
#             # Special case for extracting 'type' in an object of objects
#             base_path = ".".join(keys[:-1])  # Get the path up to the base (e.g., Xcv.html_elements)
#             nested_obj = get_nested_value(data, base_path)
#             if isinstance(nested_obj, dict):
#                 selected_data.update({f"{base_path}.{k}.type": v for k, v in get_all_nested_values(nested_obj, "type").items()})
#         else:
#             # Standard key extraction
#             selected_data[path] = get_nested_value(data, path)

#     return selected_data


# def get_selected_data(data, select):
#     result = {}

#     for field in select:
#         keys = field.split(".")
#         value = data

#         for key in keys:
#             if isinstance(value, dict):
#                 if key in value:
#                     value = value[key]
#                 elif isinstance(value, list):  # Handle lists
#                     value = [item.get(key) for item in value if isinstance(item, dict) and key in item]
#                     break
#                 else:
#                     value = None
#                     break
#             else:
#                 value = None
#                 break
        
#         # If value is found, format it in the result
#         if value is not None:
#             # For nested structures, add keys to results in a dot notation
#             if isinstance(value, dict):
#                 for nested_key, nested_value in value.items():
#                     if isinstance(nested_value, dict) or isinstance(nested_value, list):
#                         result[f"{field}.{nested_key}"] = nested_value
#                     else:
#                         result[f"{field}.{nested_key}"] = nested_value
#             elif isinstance(value, list):
#                 result[field] = value
#             else:
#                 result[field] = value

#     return result


# def get_nested_value(data, path):
#     keys = path.split(".")  # Split path by dot notation
#     value = data

#     for key in keys:
#         if isinstance(value, list):
#             # If we're at a list, return the values from the list based on the current key
#             value = [item.get(key, None) for item in value if isinstance(item, dict)]
#         elif isinstance(value, dict):
#             if key in value:
#                 value = value[key]  # Traverse deeper into the dictionary
#             else:
#                 return None  # Key doesn't exist, return None
#         else:
#             return None  # If it's neither a list nor a dict, return None

#     return value


# def get_all_nested_values(data, path):
#     results = {}

#     for key, value in data.items():
#         if isinstance(value, dict):
#             if path in value:
#                 results[key] = value[path]
#             nested_results = get_all_nested_values(value, path)
#             for nested_key, nested_value in nested_results.items():
#                 results[f"{key}.{nested_key}"] = nested_value
#         elif isinstance(value, list):
#             for index, item in enumerate(value):
#                 nested_results = get_all_nested_values(item, path)
#                 for nested_key, nested_value in nested_results.items():
#                     results[f"{key}[{index}].{nested_key}"] = nested_value

#     return results


# def get_data_for_select(data, select):
#     selected_data = {}

#     for path in select:
#         # Check if it's a nested path to handle complex cases
#         if '.' in path:
#             value = get_nested_value(data, path)
#             if value is None:
#                 # If the direct path returns None, attempt to look for keys within values
#                 base_path = path.rsplit('.', 1)[0]  # Remove the last part
#                 if base_path in data:
#                     nested_values = get_all_nested_values(data[base_path], path.split('.')[-1])
#                     selected_data.update(nested_values)
#             else:
#                 selected_data[path] = value
#         else:
#             selected_data[path] = get_nested_value(data, path)

#     return selected_data