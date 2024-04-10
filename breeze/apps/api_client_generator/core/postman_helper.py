import json, uuid
from .postman_collection_converter import PostmanCollectionConverter
from ..helper_models.base_models.api_model import ApiModel 


class PostmanHelper:
    @staticmethod
    def postman_helper(json_data):
        data = json.loads(json_data)
        postmanConverter = PostmanCollectionConverter()
        api_models = []
        # filename = f"{data.get('info').get('name')}.json"
        result = {}
        for item in data.get("item", []):
            request_data = item.get("request", {})
            response_data = item.get("response", {})
            request_obj_by_postmanConverter = postmanConverter.create_request(request_data=request_data)
            response_obj_by_postmanConverter = postmanConverter.create_response(response_data=response_data)
            api_uuid = str(uuid.uuid4())
            api_model = ApiModel(
                item.get("name"),
                ["DummyTag"],  
                request_obj_by_postmanConverter,
                response_obj_by_postmanConverter,
                "",  
                isAuthenticationApi=False,
                isLogin=False,
                isToken=False,
                uuid=api_uuid
            )
            api_models.append(api_model)
        result = {"filename":"DummyTag.json", "api_models":api_models}
        return result