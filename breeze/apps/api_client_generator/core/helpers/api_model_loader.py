from ...helper_models.base_models.api_model import ApiModel
from ...helper_models.base_models.request import Request
from ...helper_models.base_models.response import Response
from ...helper_models.base_models.key_value import KeyValue
from ...helper_models.base_models.url import Url
from ...helper_models.base_models.body import Body
from ...helper_models.base_models.parameter import Parameter
from ...helper_models.base_models.auth import Auth, AuthContent
from ...helper_models.base_models.formdata import Formdata
from ...helper_models.enums.methods import MethodsEnum
from ...helper_models.enums.status import StatusEnum
from ...helper_models.enums.content import ContentEnum
from ...helper_models.enums.mode import ModeEnum
from ...helper_models.enums.auth_type import AuthTypeEnum


class ApiModelLoader:
    
    @staticmethod
    def load_request( request_data):
        # Build Request Object
        method_name = request_data.get("method")
        method = MethodsEnum[method_name.upper()]

        auth_data = request_data.get("auth")

        # call to auth data creation
        if auth_data:
            auth = ApiModelLoader.load_auth(auth_data=auth_data)
        else:
            auth = auth_data

        # handle headers
        headers = []
        header_data = request_data.get("header", [])
        if header_data:
            headers = ApiModelLoader.load_headers(header_data=header_data)

        # call to url data creation and parameters creation
        url_data = request_data.get("url", "")
        url = []
        if url_data:
            url = ApiModelLoader.load_url(url_data=url_data)
        
        parameters = []
        parameters = request_data.get("parameters", [])
        parameters = ApiModelLoader.load_parameters(parameters=parameters)

        # call to body creation
        body = []
        if request_data.get("body"):
            body_data = request_data.get("body")
            body = ApiModelLoader.load_body(body_data=body_data)

        request_obj = Request(method, auth, headers, parameters, url, body)
        return request_obj
    
    @staticmethod
    def load_response(response_data):
        if response_data:
            status = StatusEnum[response_data.get("status").upper()]
            content_type = ContentEnum[response_data.get("content_type").upper()]
            response = Response(
                status,
                content_type,
                response_data.get("schema_name"),
                response_data.get("raw_content"),
                response_data.get("file"),
            )
        else:
            response = []
        return response
    
    @staticmethod
    def load_auth(auth_data):
        auth_type = AuthTypeEnum[auth_data.get("type").upper()]
        login_api = auth_data.get("login_api",None)
        token_api = auth_data.get("token_api",None)
        content_data = auth_data.get("content",[])
        
        auth_content = []
        for content in content_data:
            auth_content.append(
                AuthContent(
                    key=content.get("key"),
                    value=content.get("value"),
                    type=content.get("type"),
                )
            )
        auth = Auth(type=auth_type, content=auth_content,login_api=login_api,token_api=token_api)
        return auth
    
    @staticmethod
    def load_parameters(parameters):
        params = []
        for param in parameters:
            params.append(
                Parameter(
                    param_in=param.get("param_in"),
                    name=param.get("name"),
                    type=param.get("type"),
                    required=param.get("required"),
                    description=param.get("description"),
                )
            )
        return params

    def load_url(url_data):
        url = Url(
            baseurl=url_data.get("baseurl"),
            host=url_data.get("host"),
            protocol=url_data.get("protocol", ""),
            port=url_data.get("port", 0),
            path=url_data.get("path"),
        )
        return url
    
    @staticmethod
    def load_body(body_data):
        formdata_list = []
        formdata_data = body_data.get("formdata", [])

        for item in formdata_data:
            formdata_list.append(
                Formdata(
                    key=item.get("key"),
                    value=item.get("value"),
                    description=item.get("description"),
                    type=item.get("type"),
                    src=item.get("src"),
                )
            )

        content_type = body_data.get("content_type")
        if content_type:
            content_type = ContentEnum(content_type).name
            content_type = ContentEnum[content_type]


        body = Body(
            mode=ModeEnum[body_data.get("mode").upper()],
            raw_content=body_data.get("raw"),
            formdata=formdata_list,
            content_type=content_type,
            schema={},
            required=body_data.get("required"),
            schema_name=body_data.get("schema_name"),
            file=body_data.get("file"),
        )
        return body

    @staticmethod
    def load_headers(header_data):
        headers = []
        for item in header_data:
            headers.append(KeyValue(key=item.get("key"), value=item.get("value")))
        return headers

    @staticmethod
    def load_api_model(model_json):
        request_data = model_json.get("request", {})
        response_data = model_json.get("response", {})
        request_obj = ApiModelLoader.load_request(request_data=request_data)
        response_obj = ApiModelLoader.load_response(response_data=response_data)
        api_model = ApiModel(
            model_json.get("operation_id"),
            model_json.get("tags"),  # Tags remaining
            request_obj,
            response_obj,
            model_json.get("summary")  # Summary later
        )
        return api_model            
