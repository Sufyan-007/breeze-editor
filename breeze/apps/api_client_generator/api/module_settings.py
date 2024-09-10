from django.http import JsonResponse
import json, os
from django.views import View
from common.utils.app_consts import CONFIG_PATH
class ModuleSettings(View):
    def put(self,request, moduleId, projectName):
        data = json.loads(request.body)
        new_title = data.get("title")
        file_path = f"{CONFIG_PATH}/{projectName}/swagger_metadata.json"
        if not os.path.exists(file_path):
            return JsonResponse({"message": "Module not found"}, status=404)
        with open(file_path, "r") as file:
            swagger_metadata = json.load(file)
        if moduleId not in swagger_metadata:
            return JsonResponse({"message": "Module not found"}, status=404)
        for id, value in swagger_metadata.items():
            if value["title"] == new_title:
                return JsonResponse({"message": "Module name should be unique"}, status=404)
        module_data = swagger_metadata[moduleId]
        module_data["title"] = new_title
        swagger_metadata[moduleId] = module_data
        with open(file_path, "w") as file:
            json.dump(swagger_metadata, file, indent=4)
        return JsonResponse({"message": "Module name edited Successfully"}, status=404)
        