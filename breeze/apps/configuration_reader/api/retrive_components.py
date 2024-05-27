from django.http import JsonResponse
from ..core.retrive_app_config import RetriveAppConfig
from django.views import View


class ReriveComponents(View):
    
    def get(self,app):

        retrive_config = RetriveAppConfig()
        comp_config = retrive_config.get_components(app)
        if comp_config["error"] is False:
            return JsonResponse({"error" : False,"data" : comp_config["data"]}, status = 201)
        else:
            return JsonResponse({
                "error" : True,
                "message" : comp_config["message"]}, status = 500)