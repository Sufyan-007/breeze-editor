from ..helper_models.enums.methods import MethodsEnum
from ..helper_models.enums.auth_type import AuthTypeEnum
from ..helper_models.enums.status import StatusEnum
from ..helper_models.enums.content import ContentEnum
from ..helper_models.enums.mode import ModeEnum

class IntermediateValidationHelper:
    @staticmethod
    def validate_intermediate_structure(data):
        expected_keys = ["modified_api"]
        expected_keys_modified_api = ["operation_id", "tags", "request", "response", "summary", "is_authentication_api",  "id"]
        expected_keys_request = ["method", "auth", "headers", "parameters", "url", "body"]
        expected_keys_auth_content = ["key", "value", "type"]
        expected_keys_key_value = ["key", "value"]
        expected_keys_parameter = ["param_in", "name", "type", "required", "description"]
        expected_keys_url = ["baseurl", "host", "protocol", "port", "path"]
        expected_keys_body = ["mode", "content_type", "required", "schema_name", "raw_content", "file", "schema", "formdata"]
        expected_keys_response = ["status", "content_type", "schema_name", "raw_content", "file"]
        expected_keys_formdata = ["key", "value", "description", "type","src"]
        
        if not all(key in data for key in expected_keys):
            return False
        
        modified_api = data["modified_api"]
        if not all(key in modified_api for key in expected_keys_modified_api):
            return False
        
        # validate Request 
        request = modified_api["request"]
        if not all(key in request for key in expected_keys_request):
            return False
        
        # Validate method
        if "method" not in request or request["method"] not in [member.value for member in MethodsEnum]:
            return False
        
        # Validate Auth  
        if "auth" in request and request["auth"] is not None:
            auth = request["auth"]
            if not all(key in auth for key in ["type", "content", "login_api", "token_api"]) or auth["type"] not in [member.value for member in AuthTypeEnum]:
                return False
            for content in auth["content"]:
                if not all(key in content for key in expected_keys_auth_content):
                    return False
        
        # Validate headers
        if "headers" in request and request["headers"] is not None:
            headers = request["headers"]
            if not isinstance(headers, list) or not all(isinstance(item, dict) and all(key in item for key in expected_keys_key_value) for item in headers):
                return False
        
        # Validate parameters
        if "parameters" in request:
            parameters = request["parameters"]
            if not isinstance(parameters, list) or not all(isinstance(item, dict) and all(key in item for key in expected_keys_parameter) for item in parameters):
                return False
        
        # Validate url
        if "url" in request and request["url"] is not None:
            url = request["url"]
            if url:
                if not all(key in url for key in expected_keys_url):
                    return False 
        
        # Validate body
        if "body" in request and request["body"]:
            body = request["body"]
            if not all(key in body for key in expected_keys_body):
                return False
            if "mode" not in body or body["mode"] not in [member.value for member in ModeEnum]:
                return False
            if "content_type" in body:
                if body["content_type"] is not None and body["content_type"] not in [member.value for member in ContentEnum]:
                    return False
            if "formdata" in body:
                for formdata_item in body["formdata"]:
                    if not all(key in formdata_item for key in expected_keys_formdata):
                        return False
            
        # Validate Response 
        response = modified_api["response"]
        if not isinstance(response, list) or not all(isinstance(item, dict) and all(key in item for key in expected_keys_response) for item in response):
            return False
        
        # Additional validation for response body
        if response:
           for item in response:
                if "status" not in item:
                    return False
                try:
                    status_code = int(item["status"])
                    if status_code not in [member.value for member in StatusEnum]:
                        return False
                    if "content_type" not in item or item["content_type"] not in [member.value for member in ContentEnum]:
                        return False
                except ValueError:
                    return False

        return True