import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.http import JsonResponse
from ..core.entity_management import EntityManager


@csrf_exempt
@api_view(['GET'])
def get_entity_config_by_id(request, project_id, entity_id):
    try:
        entity_manager = EntityManager(projectId=project_id)
        entity = entity_manager.get_entity(entity_id)
        return JsonResponse({"data": entity}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@api_view(['POST'])
def get_entity_config(request, project_id):
    try:
        entity_manager = EntityManager(projectId=project_id)
        data = json.loads(request.body)

        filters = data.get("filters")

        if filters:
            if not isinstance(filters, dict):
                return JsonResponse({"error": "Filters must be a dictionary"}, status=400)
            
            filtered_entities = entity_manager.get_all_entities_by_filters(filters)
            return JsonResponse({"data": filtered_entities}, status=200)
        
        return JsonResponse({"data": entity_manager.entity_config}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
