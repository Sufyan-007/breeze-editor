from django.http import JsonResponse
import json
from ..core.intermediate_modification_helper import IntermediateModificationHelper
from django.views import View
from .intermediate_validation_helper import IntermediateValidationHelper

class ModifyIntermediateJson(View):
    def post(self, request):
        try:
            data = json.loads(request.body.decode("utf-8"))
            filename = data.get("filename")
            intermediate_validation_helper = IntermediateValidationHelper(errors= {})
            # Check the validity of the intermediate's structure
            errors =  intermediate_validation_helper.validate_intermediate_structure(data)
            if any(errors.values()):
                 return JsonResponse({"errors": errors}, status=400)
            else:
                intermediate_modification_helper = IntermediateModificationHelper()
                result = intermediate_modification_helper.process_api_data(data, filename)
                return JsonResponse({"message": result}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    
    
    
