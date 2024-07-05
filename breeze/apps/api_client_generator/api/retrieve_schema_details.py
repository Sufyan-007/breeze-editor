from django.http import JsonResponse
import json, os
from django.views import View
from common.utils.app_consts import CONFIG_PATH


class RetrieveSchemaDetails(View):

   def get(self, request, projectName, schemaName):
    try:
        schema_file_path = os.path.join(CONFIG_PATH, projectName, "generated_intermediate_json", "allSchemas.json")
        schema_list = []
        schema_details = {}
        with open(schema_file_path, "r") as file:
            try:
                schema_data = json.load(file)
            except json.JSONDecodeError:
                return JsonResponse({"data": []}, status=200)
            if schemaName and schemaName in schema_data:
                schema_details = schema_data[schemaName]
            else:
                schema_list = list(schema_data.keys())
        if len(schema_list)>0:
            return JsonResponse({"data": schema_list}, status=200)
        else:
            return JsonResponse({"data": schema_details}, status = 200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


class RetrieveSchemaProperties(View):

   def get(self, request, projectName, schemaName, property):
    try:
        schema_file_path = os.path.join(CONFIG_PATH, projectName, "generated_intermediate_json", "allSchemas.json")
        schema_info = {}
        with open(schema_file_path, "r") as file:
            try:
                schema_data = json.load(file)
            except json.JSONDecodeError:
                return JsonResponse({"data": []}, status=200)
            if schemaName in schema_data and property in schema_data[schemaName].get("properties"):
                schema_info = schema_data[schemaName].get("properties").get(property)
                if '$ref' in schema_info:
                    schema_name = schema_info.get('$ref').split('/')[-1]
                    if schema_name in schema_data:
                        schema_info = schema_data[schema_name]

        return JsonResponse({"data": schema_info}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)