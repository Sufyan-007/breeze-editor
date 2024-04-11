import json, uuid
import json, uuid
from .postman_collection_converter import PostmanCollectionConverter
from ..helper_models.base_models.api_model import ApiModel 
from .helpers.uuid_as_key import generate_uuid_as_key

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
            api_uuid = str(uuid.uuid4())
            api_model = ApiModel(
                operation_id=item.get("name"),
                tags=["DummyTag"],  
                request=request_obj_by_postmanConverter,
                response=response_obj_by_postmanConverter,
                summary="",  
                isAuthenticationApi=False,
                isLogin=False,
                isToken=False,
                id = generate_uuid_as_key()
            )
            api_models.append(api_model)
        result = {"filename":"DummyTag.json", "api_models":api_models}
        return result