from django.http import JsonResponse
import json
from ..core.intermediate_modification_helper import IntermediateModificationHelper
from django.views import View
from ..utils.uuid_as_key import generate_uuid_as_key
class ModifyIntermediateJson(View):
    def post(self, request,projectName,filename,operation, moduleId):
        try:
            data = json.loads(request.body.decode("utf-8"))
            filename = filename+".json"
            if operation == 'ADD':
                data["id"] = generate_uuid_as_key()
            intermediate_modification_helper = IntermediateModificationHelper(project_name=projectName, moduleId=moduleId)
            result = intermediate_modification_helper.process_api_data(data, filename)
            if result:
                return JsonResponse({"message": "Function Added Successfully" }, status=201)
            else:
                return JsonResponse({"message": result }, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    
    
    
