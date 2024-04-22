from ..api_models.enums.methods import MethodsEnum
from ..api_models.enums.auth_type import AuthTypeEnum
from ..api_models.enums.status import StatusEnum
from ..api_models.enums.content import ContentEnum
from ..api_models.enums.mode import ModeEnum

class IntermediateValidationHelper:
    def __init__(self, errors):
        self.errors = {
            "modified_api": [],
            "request":[],
            "response": []
        }

    def validate_intermediate_structure(self, data):
        self.validate_keys(data)

        modified_api = data.get("modified_api", {})
        self.validate_keys(modified_api, "modified_api")

        request = modified_api.get("request", {})
        self.validate_request(request)

        response = modified_api.get("response", [])
        self.validate_response(response)

        return self.errors

    def validate_keys(self, data, key_name="data"):
        expected_keys_mapping = {
            "data": ["modified_api"],
            "modified_api": ["operation_id", "tags", "request", "response", "summary", "is_authentication_api", "id"],
            "request": ["method", "auth", "headers", "parameters", "url", "body"],
            "request.auth": ["type", "content", "login_api", "token_api"],
            "request.headers.header": ["key", "value"],
            "request.parameters.parameter": ["param_in", "name", "type", "required", "description"],
            "request.url": ["baseurl", "host", "protocol", "port", "path", "url_env"],
            "request.body": ["mode", "content_type", "required", "schema_name", "raw_content", "file", "schema", "formdata"],
            "response": ["status", "content_type", "schema_name", "raw_content", "file"],
            "request.body.formdata": ["key", "value", "description", "type", "src"],
            "request.auth.auth_content": ["key", "value", "type"]
        }

        expected_keys = expected_keys_mapping.get(key_name, [])
        missing_keys =[]
        splitted_key = key_name.split(".")
        if expected_keys is not None:
            for key in expected_keys:   
                if key not in data:
                    missing_keys.append({f"{key_name}.{key}":ErrorsEnum.REQUIRED_KEY})
            if len(missing_keys)>0:
                if 'request' in splitted_key:
                    self.errors["request"].extend(missing_keys)
                elif 'response' in splitted_key:
                    self.errors["response"].extend(missing_keys)
                else:
                    self.errors["modified_api"].extend(missing_keys)

    def validate_request(self, request):
        if not request:
            return

        self.validate_keys(request, "request")

        method = request.get("method")
        if method and method not in [member.value for member in MethodsEnum]:
            self.errors["request"].append({"request.method" : ErrorsEnum.TYPE_MISMATCH})

        auth = request.get("auth")
        if auth:
            self.validate_keys(auth, "request.auth")
            auth_type = auth.get("type") 
            if auth_type and auth_type not in [member.value for member in AuthTypeEnum]:
                self.errors["request"].append({"request.auth_type":ErrorsEnum.TYPE_MISMATCH})
            for content in auth.get("content", []):
                self.validate_keys(content, "request.auth.auth_content")

        headers = request.get("headers", [])
        if not isinstance(headers, list):
            self.errors["request"].append({"request.headers":ErrorsEnum.TYPE_MISMATCH})
        else:
            for header in headers:
                self.validate_keys(header, "request.headers.header")

        parameters = request.get("parameters", [])
        if not isinstance(parameters, list):
             self.errors["request"].append({"request.parameters":ErrorsEnum.TYPE_MISMATCH})
        else:
            for parameter in parameters:
                self.validate_keys(parameter, "request.parameters.parameter")

        url = request.get("url", {})
        self.validate_keys(url, "request.url")

        body = request.get("body", {})
        self.validate_keys(body, "request.body")
        mode = body.get("mode")
        content_type = body.get("content_type")
        if mode and mode not in [member.value for member in ModeEnum]:
            self.errors["request"].append({"request.body.mode":ErrorsEnum.TYPE_MISMATCH})
        if content_type and content_type not in [member.value for member in ContentEnum]:
            self.errors["request"].append( {"request.body.content_type":ErrorsEnum.TYPE_MISMATCH})

        formdata = body.get("formdata", [])
        if not isinstance(formdata, list):
             self.errors["request"].append({"request.body.formdata":ErrorsEnum.TYPE_MISMATCH})
        else:
            if len(formdata)>0:
                for formdata_item in formdata:
                    self.validate_keys(formdata_item, "request.body.formdata")

    def validate_response(self, response):
        if response is not None:
            if not isinstance(response, list):
                 self.errors["response"].append({"response":ErrorsEnum.TYPE_MISMATCH})
            else:
                for item in response:
                    self.validate_keys(item, "response")
                    status = item.get("status")
                    content_type = item.get("content_type")
                    if "status" not in item:
                        self.errors["response"].append({"response.status":ErrorsEnum.REQUIRED_KEY})
                    if status and (int(status) not in [member.value for member in StatusEnum]):
                        self.errors["response"].append( {"response.status":ErrorsEnum.TYPE_MISMATCH})
                    if content_type and content_type not in [member.value for member in ContentEnum]:
                        self.errors["response"].append({"response.content_type":ErrorsEnum.TYPE_MISMATCH})






