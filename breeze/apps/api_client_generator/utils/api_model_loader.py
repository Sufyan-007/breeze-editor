from ..api_models import AuthApiModel,Auth,AuthContent,ApiModel,TokenStore
from ..api_models import Request,Response,KeyValue,Url,Body,Parameter
from ..api_models import MethodsEnum,StatusEnum,ParamsInEnum,ContentEnum,ModeEnum,AuthTypeEnum,AuthApiTypeEnum,TokenStoreTypeEnum


class ApiModelLoader:

    @staticmethod
    def load_request(request_data):
        # Build Request Object
        method_name = request_data.get("method")
        method = MethodsEnum[method_name]
        auths_model = []
        auth_data_arr = request_data.get("auth",[])

        # call to auth data creation
        if auth_data_arr and len(auth_data_arr)>0:
            for auth_d in auth_data_arr:
                auth = ApiModelLoader.load_auth(auth_data=auth_d)
                auths_model.append(auth)
        else:
            auths_model = []

        # handle headers
        headers = []
        header_data = request_data.get("headers", [])
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

        request_obj = Request(method, auths_model, headers, parameters, url, body)
        return request_obj

    @staticmethod
    def load_response(response_data):
        response=[]
        for r_data in response_data:
            response.append(Response(
                status= StatusEnum[r_data.get("status")],
                content_type=ContentEnum[r_data.get("content_type")],
                schema_name = r_data.get("schema_name",None),
                schema = r_data.get("schema",{}),
                raw_content=r_data.get("raw_content",None),
                file=r_data.get("file",None),
                description = r_data.get("description",None),
            ))
        return response

    @staticmethod
    def load_auth(auth_data):
        auth_type = auth_data.get("type")
        login_api = auth_data.get("login_api", None)
        token_api = auth_data.get("token_api", None)
        content_data = auth_data.get("content", [])

        auth_content = []
        for content in content_data:
            auth_content.append(
                AuthContent(
                    key=content.get("key"),
                    value=content.get("value"),
                    type=content.get("type"),
                )
            )
        auth = Auth(type=AuthTypeEnum[auth_type], content=auth_content,
                    login_api=login_api, token_api=token_api)
        return auth

    @staticmethod
    def load_parameters(parameters):
        params = []
        for param in parameters:
            params.append(
                Parameter(
                    param_in=ParamsInEnum[param.get("param_in").upper()],
                    name=param.get("name"),
                    type=param.get("type"),
                    required=param.get("required"),
                    description=param.get("description"),
                )
            )
        return params

    @staticmethod
    def load_url(url_data):
        url = Url(
            servers=url_data.get("servers",[]),
            baseurl=url_data.get("baseurl"),
            host=url_data.get("host",[]),
            protocol=url_data.get("protocol", ""),
            port=url_data.get("port", 0),
            path=url_data.get("path"),
            url_env=url_data.get("url_env")
        )
        return url

    @staticmethod
    def load_token_store(token_store):
        if token_store :
            token_store = TokenStore(
                store_in=TokenStoreTypeEnum[token_store.get("store_in")],
                access_token_key=token_store.get("access_token_key"),
                refresh_token_key=token_store.get("refresh_token_key")
            )
            return token_store
        return None

    @staticmethod
    def load_body(body_data):
        arr_body = []
        if len(body_data) <= 0:
            return []
        
        for body in body_data:
            arr_body.append(
                Body(
                    content_type=ContentEnum[body.get("content_type")],
                    mode=ModeEnum[body.get("mode")],
                    raw_content=body.get("raw"),
                    schema=body.get("schema", {}),
                    required=body.get("required"),
                    schema_name=body.get("schema_name"),
                    file=body.get("file"),
                    anonymous=body.get("anonymous")
                )
            )
        return arr_body

    @staticmethod
    def load_headers(header_data):
        headers = []
        for item in header_data:
            headers.append(KeyValue(key=item.get(
                "key"), value=item.get("value")))
        return headers

    @staticmethod
    def load_api_model(model_json):
        request_data = model_json.get("request", {})
        response_data = model_json.get("response", [])
        request_obj = ApiModelLoader.load_request(request_data=request_data)
        response_obj = ApiModelLoader.load_response(response_data=response_data)
        api_model = ApiModel(
            id=model_json.get("id"),
            operation_id=model_json.get("operation_id"),
            tags=model_json.get("tags"),  # Tags remaining
            request=request_obj,
            response=response_obj,
            summary=model_json.get("summary"),  # Summary later,
            is_authentication_api=model_json.get("is_authentication_api")
        )
        return api_model

    @staticmethod
    def load_auth_api_model(model_json):
        request_data = model_json.get("request", {})
        response_data = model_json.get("response", {})
        request_obj = ApiModelLoader.load_request(request_data=request_data)
        response_obj = ApiModelLoader.load_response(response_data=response_data)
        api_model = AuthApiModel(
            id=model_json.get("id"),
            operation_id=model_json.get("operation_id"),
            tags=model_json.get("tags"),  # Tags remaining
            request=request_obj,
            response=response_obj,
            summary=model_json.get("summary"),  # Summary later,
            auth_api_type=AuthApiTypeEnum[model_json.get("auth_api_type")] ,
            authentication_type= AuthTypeEnum[model_json.get("authentication_type")],
            is_authorization_url=model_json.get("is_authorization_url"),
            flow=model_json.get("flow"),
            token_store=ApiModelLoader.load_token_store(model_json.get("token_store",{}))
        )
        return api_model