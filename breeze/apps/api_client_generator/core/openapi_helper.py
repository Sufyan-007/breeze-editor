import yaml
import json
from .openapi_swagger_converter import OpenapiConverter
from ..helper_models.base_models.api_model import ApiModel


class OpenApiHelper:
    @staticmethod
    def open_api_helper(json_data):
        try:
            if not json_data:
                raise ValueError("Empty JSON data")

            openapi_data = yaml.safe_load(json_data) if json_data.endswith('.yml') else yaml.safe_load(json_data)
            
            filename = f"{openapi_data.get('info').get('title')}.json"
            result = {}
            paths = openapi_data.get('paths', {})
            operations = []
            openApiConverter = OpenapiConverter()
            api_models = []
            for path, path_data in paths.items():
                operations = list(path_data.keys())
                for operation in operations:
                    request_obj = openApiConverter.create_request(
                        path_data=path_data,   
                        operation=operation,
                        security_schemes=openapi_data.get("components").get("securitySchemes"),
                        servers=openapi_data.get("servers"))
                    response_obj = openApiConverter.create_response(path_data=path_data, operation=operation)
                    api_model = ApiModel(
                        path_data.get(operation).get("operationId"),
                        path_data.get(operation).get("tags"),
                        request_obj,
                        response_obj,
                        path_data.get(operation).get("summary"),
                        isAuthenticationApi= False,
                        isLogin=False,
                        isToken=False
                    )
                    api_models.append(api_model)
                    
            result = {"filename": filename, "api_models": api_models}
            return result
        
        except Exception as e:
            return {"error": str(e)}
