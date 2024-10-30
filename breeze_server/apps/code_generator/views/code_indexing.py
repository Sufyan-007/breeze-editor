from django.http import JsonResponse
from rest_framework.decorators import api_view
from ...common.constants.consts import CONFIG_PATH
import pickle
import json
from ..models.code_indexing import GetConfigByIndexBody,GetConfigByIndexResponse

@api_view(["POST"])
def get_config_by_index(request,project_id):
    data = json.loads(request.body)
    rb = GetConfigByIndexBody(data.get("type"),data.get("index"),data.get("compId"))
    if(rb.__dict__['isError']):
        return JsonResponse({'error':rb.__dict__['errorObj']},status=400)
    fileType = data["type"]
    if fileType == "COMPONENTS":
        compId = data["compId"]
        path = f"{CONFIG_PATH}/{project_id}/pickles/{compId}.bytes"
        with open(path, "rb") as file:
            codeTree = pickle.load(file)
        
        code = codeTree[data["index"]]
        res = GetConfigByIndexResponse(code)
        if(res.__dict__('iError')):
            return JsonResponse({'error':res.__dict__['errorObj']},status=400)
        if code and code.get("children"):
            del code["children"]
        return JsonResponse({"related_config":code}, status=200)
    return JsonResponse({},status=200)