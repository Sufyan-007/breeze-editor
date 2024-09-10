from django.http import JsonResponse
import json, os
from django.views import View
from common.utils.app_consts import CONFIG_PATH

class GetAllServices(View):
    def get(self, request, projectName):
        api_folder_path = f"{CONFIG_PATH}/{projectName}/api_client_intermediate_json"
        swagger_metadata_path = f"{CONFIG_PATH}/{projectName}/swagger_metadata.json"

        # Load swagger metadata
        with open(swagger_metadata_path, 'r') as file:
            swagger_metadata = json.load(file)

        response_data = {}

        # Process auth APIs from swagger metadata
        for key, value in swagger_metadata.items():
            function_obj = {}
            for id, config in value.get("auth_apis", {}).items():
                function_obj[id] = {"name": config["operation_id"]}
            response_data[key] = {
                "name": value.get("title"),
                "services": {
                    "auth": {
                        "name": "auth",
                        "functions": function_obj
                    }
                }
            }

        # Process API files from subfolders
        subfolders = [f for f in os.listdir(api_folder_path) if os.path.isdir(os.path.join(api_folder_path, f))]
        for subfolder in subfolders:
            subfolder_path = os.path.join(api_folder_path, subfolder)
            files = [f for f in os.listdir(subfolder_path) if os.path.isfile(os.path.join(subfolder_path, f))]

            # Initialize subfolder_data for each subfolder
            subfolder_data = {}
            for filename in files:
                full_file_path = os.path.join(subfolder_path, filename)
                with open(full_file_path, "r") as file:
                    api_models = json.load(file)

                # Initialize api_function_obj for the current file
                api_function_obj = {}
                for key, value in api_models.items():
                    api_function_obj[key] = {"name": value["operation_id"]}

                # Update subfolder_data to include current file's data
                subfolder_data[filename] = {
                    "name": filename,
                    "functions": api_function_obj
                }

            # Only add subfolder to response_data if it exists in swagger_metadata
            if subfolder in swagger_metadata:
                if subfolder not in response_data:
                    response_data[subfolder] = {
                        "name": swagger_metadata[subfolder].get("title"),
                        "services": {}
                    }
                response_data[subfolder]["services"].update(subfolder_data)

        return JsonResponse(response_data)
    
    

class GetServiceFunctionConfig(View):
    def get(self, request, projectName):
        data = json.loads(request.body.decode("utf-8"))
        
        module_id = data.get("module_id")
        service_id = data.get("service_id")
        function_id = data.get("function_id")

        # Check for missing parameters
        if not all([module_id, service_id, function_id]):
            return JsonResponse({"error": "Missing required parameters: module_id, service_id, or function_id"})

        api_folder_path = os.path.join(CONFIG_PATH, projectName, "api_client_intermediate_json")
        swagger_metadata_path = os.path.join(CONFIG_PATH, projectName, "swagger_metadata.json")

        # Handle 'auth' service_id
        if service_id == "auth":
            try:
                with open(swagger_metadata_path, "r") as file:
                    swagger_metadata = json.load(file)
            except FileNotFoundError:
                return JsonResponse({"error": "Swagger metadata file not found."})
            except json.JSONDecodeError as e:
                return JsonResponse({"error":f"Error decoding swagger metadata: {str(e)}"})

            auth_apis = swagger_metadata.get(module_id, {}).get("auth_apis", {})
            function_config = auth_apis.get(function_id, {})

            if not function_config:
                return JsonResponse({"error":"Function not found in auth APIs."})
            return JsonResponse(function_config)
        
        # Handle other service_id
        api_function_path = os.path.join(api_folder_path, module_id, service_id + ".json")
        
        try:
            with open(api_function_path, 'r') as file:
                file_data = json.load(file)
        except FileNotFoundError:
            return JsonResponse({"error":"API function file not found."})
        except json.JSONDecodeError as e:
            return JsonResponse({"error":f"Error decoding API function file: {str(e)}"})
        
        function_config = file_data.get(function_id, {})

        if not function_config:
            return JsonResponse({"error":"Function not found in API file."})

        return JsonResponse(function_config)
        