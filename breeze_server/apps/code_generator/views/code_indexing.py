from django.http import JsonResponse
from rest_framework.decorators import api_view
from ...common.constants.consts import CONFIG_PATH
import pickle
import json

@api_view(["POST"])
def get_config_by_index(request,project_id):
    data = json.loads(request.body)
    fileType = data["type"]
    if fileType == "COMPONENTS":
        compId = data["compId"]
        path = f"{CONFIG_PATH}/{project_id}/pickles/{compId}.bytes"
        with open(path, "rb") as file:
            codeTree = pickle.load(file)
        
        code = codeTree[data["index"]]
        if code and code.get("children"):
            del code["children"]
        return JsonResponse({"related_config":code}, status=200)
    return JsonResponse({},status=200)