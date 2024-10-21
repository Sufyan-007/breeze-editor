import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from apps.common.utils.file_helpers.config_handler import get_breeze_config_file
from django.http import JsonResponse
from ..core.third_party_dependency_service import (
    add_package_to_dependencies,
    update_package_in_dependencies,
    delete_package_from_dependencies
)
from ..utils.request_data_parser import parse_request_data

@csrf_exempt
@api_view(["POST"])
def add_third_party_dependency(request, projectName):
    try:
        package_name, package_version = parse_request_data(request)
        add_package_to_dependencies(projectName, package_name, package_version)
        return JsonResponse({"message": "Package added successfully"}, status=200)
    except ValueError as ve:
        return JsonResponse({"error": str(ve)}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@api_view(["GET"])
def get_third_party_dependency(request, projectName):
    try:
        app_config = get_breeze_config_file(projectName, "APP_CONFIG")
        dependencies = app_config.get("dependencies", {})
        return JsonResponse(dependencies, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@api_view(["PUT"])
def update_third_party_dependency(request, projectName):
    try:
        package_name, package_version = parse_request_data(request)
        update_package_in_dependencies(projectName, package_name, package_version)
        return JsonResponse({"message": "Package updated successfully"}, status=200)
    except ValueError as ve:
        return JsonResponse({"error": str(ve)}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@api_view(["DELETE"])
def delete_third_party_dependency(request, projectName):
    try:
        data = json.loads(request.body.decode("utf-8"))
        package_name = data.get("name")
        
        if not package_name:
            return JsonResponse({"error": "Package name is required"}, status=400)
        
        delete_package_from_dependencies(projectName, package_name)
        return JsonResponse({"message": "Package deleted successfully"}, status=200)
    except ValueError as ve:
        return JsonResponse({"error": str(ve)}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
