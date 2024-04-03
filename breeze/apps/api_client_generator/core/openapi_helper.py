import yaml

from ..helper_models.base_models.api_model import ApiModel
from .openapi_swagger_converter import OpenapiConverter

class OpenApiHelper:
    @staticmethod
    def open_api_helper(json_data):
        try:
            if not json_data:
                raise ValueError("Empty JSON data")

            openapi_data = yaml.safe_load(json_data) if json_data.endswith('.yml') else yaml.safe_load(json_data)

            result = {}
            paths = openapi_data.get('paths', {})
            tags_map = {}
            for path, path_data in paths.items():
                for operation, operation_data in path_data.items():
                    tags = operation_data.get("tags", [])
                    for tag in tags:
                        if tag not in tags_map:
                            tags_map[tag] = []
                        tags_map[tag].append((path, operation, operation_data))

            for tag, tag_operations in tags_map.items():
                api_models = []
                for path, operation, operation_data in tag_operations:
                    openApiConverter = OpenapiConverter()
                    request_obj = openApiConverter.create_request(
                        path_data=operation_data,
                        operation=operation,
                        security_schemes=openapi_data.get("components").get("securitySchemes"),
                        servers=openapi_data.get("servers"),
                        schemas=openapi_data.get("components").get("schemas"))
                    response_obj = openApiConverter.create_response(
                        path_data=operation_data,
                        operation=operation)
                    api_model = ApiModel(
                        operation_data.get("operationId"),
                        operation_data.get("tags"),
                        request_obj,
                        response_obj,
                        operation_data.get("summary"),
                        isAuthenticationApi=False,
                        isLogin=False,
                        isToken=False
                    )
                    api_models.append(api_model)

                filename = f"{tag}Service.json"
                result[filename] = api_models

            return result

        except Exception as e:
            return {"error": str(e)}

