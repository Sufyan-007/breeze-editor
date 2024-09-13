import json
from django.shortcuts import render
from rest_framework.views import APIView
from django.http import JsonResponse
from .core.query_resource_service2 import QueryResourceService

class QueryResource(APIView):
    
    def post(self, request, projectName):
        try:   
            data = json.loads(request.body)
            category = data.get('category')
            resource = data.get('resource', None)
            select = data.get('select', [])
            filter_criteria = data.get('filter_criteria', None)
            order = data.get('order',None)
            limit = data.get("limit",None)
            offset = data.get('offset',None)

            if not category:
                return JsonResponse({'error': "Category is required"}, status=400)

            query_resource_service = QueryResourceService(projectName)
            selected_data = query_resource_service.get_json_config_data(resource, category)
        
            if selected_data is None:
                return JsonResponse({'error': "Could not load the configuration data"}, status=500)

            if filter_criteria:
                filtered_data = query_resource_service.apply_filter(selected_data, resource, filter_criteria, select, category, order, limit, offset)
        
                if filtered_data:
                    return JsonResponse({"data": filtered_data}, status=200)
                else:
                    return JsonResponse({}, status=200)
                
            # Return the unfiltered data if no filter is applied 
            return JsonResponse({"data": selected_data}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
