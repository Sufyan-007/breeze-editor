from django.http import JsonResponse
import json, os
from django.views import View
from common.utils.app_consts import CONFIG_PATH
from ..utils.append_dict_file import append_to_dict_file
from ..utils.uuid_as_key import generate_uuid_as_key

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
                # schema_list = list(schema_data.keys())
                for key,value in schema_data.items():
                    schema_list.append({"id": key, "name": value.get("name")})
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
    
class SchemaSettings(View):
    def post(self, request, projectName):
        return self._add_or_edit_schema(request, projectName)
    
    def put(self, request, projectName,schemaId):
        return self._add_or_edit_schema(request, projectName, schemaId)
    
    def _add_or_edit_schema(self, request, projectName, schema_id=None):
        try:
            data = json.loads(request.body.decode("utf-8"))
            schema_details = data.get("details")
            schema_file_path = os.path.join(CONFIG_PATH, projectName, "generated_intermediate_json", "allSchemas.json")
            
            if not schema_details.get("name"):
                return JsonResponse({"error": "Schema Name is required "})
            try:
                with open(schema_file_path, "r") as file:
                    schema_data = json.load(file)
            except FileNotFoundError:
                schema_data = {}
           
            if schema_id:
                if schema_id not in schema_data:
                    return JsonResponse({"error": f"Schema '{schema_details.get('name')}' not found for editing"})
                schema_data[schema_id] = schema_details
            else:
                id = generate_uuid_as_key()
                schema_data[id] = schema_details
            append_to_dict_file(schema_file_path, schema_data)
            if schema_id:
                return JsonResponse({"message": "Schema Edited Successfully"})
            else:
                return JsonResponse({"message": "Schema Added Successfully"})
        
        except Exception as e:
            return JsonResponse({"error": str(e)})

    def delete(self, request, projectName, schemaId):
        try:
            schema_file_path = os.path.join(CONFIG_PATH, projectName, "generated_intermediate_json", "allSchemas.json")
            with open(schema_file_path, "r+") as file:
                schema_data = json.load(file)
            if schemaId in schema_data:
                del schema_data[schemaId]
                append_to_dict_file(schema_file_path, schema_data,False)
                return JsonResponse({"message": f"Schema deleted successfully."}, status=200)
            else:
                return JsonResponse({"error": f"Schema '{schemaId}' not found."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)