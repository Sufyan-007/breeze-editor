from django.http import JsonResponse
from ..core.retrive_app_config import RetriveAppConfig
from django.views import View


class ReriveComponent(View):
    
    def get(self, request,app,compId):

        retrive_config = RetriveAppConfig()
        entity = request.GET.get('entity', None)
        comp_config = retrive_config.get_comp_config(app,compId,entity)
        if comp_config["error"] is False:
            return JsonResponse({compId : comp_config["data"]}, status = 201)
        else:
            return JsonResponse({compId : comp_config["message"]}, status = 500)