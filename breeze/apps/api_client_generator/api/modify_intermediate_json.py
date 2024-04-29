from django.http import JsonResponse
import json
from ..core.intermediate_modification_helper import IntermediateModificationHelper
from django.views import View

class ModifyIntermediateJson(View):
    def post(self, request,projectName,filename):
        try:
            data = json.loads(request.body.decode("utf-8"))
            filename = filename+".json"
            intermediate_modification_helper = IntermediateModificationHelper(project_name=projectName)
            result = intermediate_modification_helper.process_api_data(data, filename)
            return JsonResponse({"message": result}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    
    
    
