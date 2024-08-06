from django.http import JsonResponse
import json, os
from django.views import View
from common.utils.app_consts import CONFIG_PATH
from ..utils.append_dict_file import append_to_dict_file
from ..utils.uuid_as_key import generate_uuid_as_key

class RetrieveSchemaDetails(View):

   def get(self, request, projectName,moduleId=None, schemaName=None):
    try:
        base_dir = os.path.join(CONFIG_PATH, projectName, "swagger_schema")
        swagger_metadata_path = f"{CONFIG_PATH}/{projectName}/swagger_metadata.json"
        final_data = []
        schema_details = {}
        with open(swagger_metadata_path, "r") as file:
                    swagger_metadata = json.load(file)
        # Helper function to process JSON files
        def process_file(file_path, module_id, title):
            schema_list = []
            try:
                with open(file_path, "r") as file:
                    schema_data = json.load(file)
                    if moduleId and schemaName and schemaName in schema_data:
                        schema_details.update(schema_data[schemaName])
                    else:
                        for key, value in schema_data.items():
                            schema_list.append({"id": key, "name": value.get("name")})
                        final_data.append({"module_id": module_id, "schemas": schema_list, "title": title})
            except json.JSONDecodeError:
                # Skip files with invalid JSON
                pass

        # Walk through the base directory and process each JSON file
        for root, dirs, files in os.walk(base_dir):
            if moduleId != 'null':
                for file in files:
                    file_name, _ = os.path.splitext(file)
                    file_path = os.path.join(root, file)
                    for key,value in swagger_metadata.items():
                        if moduleId and (moduleId == file_name) and (file_name == key):
                                process_file(file_path, moduleId,value.get('title'))
                                break
            else:    
                for file in files:
                    if file.endswith(".json"):
                                file_name, _ = os.path.splitext(file)
                                file_path = os.path.join(root, file)
                                for key,value in swagger_metadata.items():
                                    if key == file_name:
                                        process_file(file_path, key, value.get("title") )
                            # process_file(file_path)

        if final_data:
            return JsonResponse({"data": final_data}, status=200)
        else:
            return JsonResponse({"data": schema_details}, status=200)

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
    def post(self, request, projectName,moduleId):
        return self._add_or_edit_schema(request, projectName, moduleId)
    
    def put(self, request, projectName,schemaId, moduleId):
        return self._add_or_edit_schema(request, projectName,moduleId, schemaId)
    
    def _add_or_edit_schema(self, request, projectName, moduleId, schema_id=None):
        try:
            data = json.loads(request.body.decode("utf-8"))
            schema_details = data.get("details")
            # schema_file_path = os.path.join(CONFIG_PATH, projectName, "swagger_schema",".json")
            schema_file_path = f"{CONFIG_PATH}/{projectName}/swagger_schema/{moduleId}.json"
            
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

    def delete(self, request, projectName, schemaId, moduleId):
        try:
            schema_file_path = f"{CONFIG_PATH}/{projectName}/swagger_schema/{moduleId}.json"
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