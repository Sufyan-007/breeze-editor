from django.http import JsonResponse
from ..core.retrive_app_config import RetriveAppConfig
from django.views import View
import json

class ReriveStateVariablesComponent(View):
    
    def get(self, request,app,comp_id):

        retrive_config = RetriveAppConfig()
        variables = retrive_config.get_state_variables(app,comp_id)
        if variables["error"] is False:
            return JsonResponse({
                "error" : False,
                "data" : variables["data"]}, status = 201)
        else:
            return JsonResponse({"error" : True,"message" : variables["message"]}, status = 500)