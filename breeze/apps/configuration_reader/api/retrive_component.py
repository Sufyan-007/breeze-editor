from django.http import JsonResponse
from ..core.retrive_app_config import RetriveAppConfig
from django.views import View


class ReriveComponent(View):
    
    def get(self, request,app,comp_id):

        retrive_config = RetriveAppConfig()
        entity = request.GET.get('entity', None)
        comp_config = retrive_config.get_comp_config(app,comp_id,entity)
        if comp_config["error"] is False:
            return JsonResponse({
                "error" : False,
                comp_id : comp_config["data"]}, status = 201)
        else:
            return JsonResponse({"error" : True,"message" : comp_config["message"]}, status = 500)