from django.http import JsonResponse
import json
from ..core.intermediate_modification_helper import IntermediateModificationHelper
from django.views import View

class ModifyIntermediateJson(View):
    def post(self, request):
        try:
            data = json.loads(request.body.decode("utf-8"))
            filename = data.get("filename")
            result = IntermediateModificationHelper.process_api_data(data, filename)
            return JsonResponse({"message": result}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
