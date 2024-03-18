from ...helper_models.base_models.api_model import ApiModel
from ...core.postman_collection_converter import PostmanCollectionConverter

def load_json_to_api_model(json_data):

    intermediate = PostmanCollectionConverter()
    request_data = json_data.get("request", {})
    response_data = json_data.get("response", {})
    request_obj_by_intermediate = intermediate.create_request(request_data=request_data)
    response_obj_by_intermediate = intermediate.create_response(response_data=response_data)
    api_model = ApiModel(
        json_data.get("operation_id"),
        json_data.get("tags"),  # Tags remaining
        request_obj_by_intermediate,
        response_obj_by_intermediate,
        json_data.get("summary")  # Summary later
    )
    return api_model            