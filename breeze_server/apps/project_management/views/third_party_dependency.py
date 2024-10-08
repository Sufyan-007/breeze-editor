from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from apps.common.constants.consts import CONFIG_FILES_PATH, CONFIG_PATH
from apps.common.utils.file_helpers.json_handler import read_project_config_file
from django.http import JsonResponse
import json


@csrf_exempt
@api_view(["POST"])
def addThirdPartyDependency(request, projectName):
    try:
        data = json.loads(request.body)
        print(data)
        return JsonResponse("Done", status=200)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)


@csrf_exempt
@api_view(["GET"])
def getThirdPartyDependency(request, projectName):
    try:
        app_config_dir = f"{CONFIG_PATH}/{projectName}"
        app_config = read_project_config_file(
            app_config_dir, CONFIG_FILES_PATH["APP_CONFIG"]
        )
        dependencies = app_config["dependencies"]
        return JsonResponse(dependencies, status=200)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)


@csrf_exempt
@api_view(["PUT"])
def updateThirdPartyDependency(request, projectName):
    return ""


@csrf_exempt
@api_view(["DELETE"])
def deleteThirdPartyDependency(request, projectName):
    return ""
