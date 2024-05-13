from ..api_models import AuthApiModel,Auth,AuthContent,ApiModel,TokenStore
from ..api_models import Request,Response,KeyValue,Url,Body,Parameter
from ..api_models import MethodsEnum,StatusEnum,ParamsInEnum,ContentEnum,ModeEnum,AuthTypeEnum,AuthApiTypeEnum,TokenStoreTypeEnum


class ApiModelLoader:

    @staticmethod
    def load_request(request_data):
        api_model_loader = ApiModelLoader()
        # Build Request Object
        method_name = request_data.get("method").upper()
        method = MethodsEnum[method_name]
        auths_model = []
        auth_data_arr = request_data.get("auth",[])

        # call to auth data creation
        if auth_data_arr and len(auth_data_arr)>0:
            for auth_d in auth_data_arr:
                auth = api_model_loader.load_auth(auth_data=auth_d)
                auths_model.append(auth)
        else:
            auths_model = []

        # handle headers
        headers = []
        header_data = request_data.get("headers", [])
        if header_data:
            headers = api_model_loader.load_headers(header_data=header_data)
        # call to url data creation and parameters creation
        url_data = request_data.get("url", "")
        url = []
        if url_data:
            url = api_model_loader.load_url(**url_data)
            
        parameters = []
        parameters = request_data.get("parameters", [])
        if parameters:
            parameters = api_model_loader.load_parameters(parameters=parameters)
           
        # call to body creation
        body = []
        if request_data.get("body"):
            body_data = request_data.get("body")
            body = api_model_loader.load_body(body_data=body_data)
            
        request_obj = Request(method, auths_model, headers, parameters, url, body, errors={})
        
            
        return request_obj

    @staticmethod
    def load_response(response_data):
        response=[]
        if len(response_data)>0:
            for r_data in response_data:
                new_response = Response(
                    status= StatusEnum[r_data.get("status")],
                    content_type=ContentEnum[r_data.get("content_type").upper()],
                    schema_name = r_data.get("schema_name",None),
                    schema = r_data.get("schema",{}),
                    raw_content=r_data.get("raw_content",None),
                    file=r_data.get("file",None),
                    description = r_data.get("description",None),
                    errors={}
                )
                response.append(new_response)     
        return response

    @staticmethod
    def load_auth(auth_data):
        auth_type = auth_data.get("type")
        login_api = auth_data.get("login_api", None)
        token_api = auth_data.get("token_api", None)
        content_data = auth_data.get("content", auth_data.get("contents", []))

        auth_content = []
        for content in content_data:
            new_auth_content = AuthContent(
                    key=content.get("key"),
                    value=content.get("value"),
                    type=content.get("type"),
                    errors={}
                )
            auth_content.append(new_auth_content)
            
        auth = Auth(type=AuthTypeEnum[auth_type], content=auth_content,
                    login_api=login_api, token_api=token_api,errors={})
        
        return auth

    @staticmethod
    def load_parameters(parameters):
        params = []
        for param in parameters:
            new_parameters = Parameter(
                    param_in=ParamsInEnum[param.get("param_in").upper()],
                    name=param.get("name"),
                    type=param.get("type"),
                    required=param.get("required"),
                    description=param.get("description"),
                    errors= {}
                )
            params.append(new_parameters)
            
        return params

    @staticmethod
    def load_url(**url_data):
        url = Url(
            servers = url_data.get("servers"),
            baseurl=url_data.get("baseurl"),
            host=url_data.get("host",[]),
            protocol=url_data.get("protocol", ""),
            port=url_data.get("port", 0),
            path=url_data.get("path"),
            url_env=url_data.get("url_env"),
            errors={}
        )
        return url

    @staticmethod
    def load_token_store(token_store):
        if token_store :
            token_store = TokenStore(
                store_in=TokenStoreTypeEnum[token_store.get("store_in")],
                access_token_key=token_store.get("access_token_key"),
                refresh_token_key=token_store.get("refresh_token_key"),
                errors={}
            )
            return token_store
        return None

    @staticmethod
    def load_body(body_data):
        arr_body = []
        if len(body_data) <= 0:
            return []
        
        for body in body_data:
            new_body = Body(
                    content_type=ContentEnum[body.get("content_type")],
                    mode=ModeEnum[body.get("mode")],
                    raw_content=body.get("raw", body.get("raw_content")),
                    schema=body.get("schema", {}),
                    required=body.get("required"),
                    schema_name=body.get("schema_name"),
                    file=body.get("file"),
                    anonymous=body.get("anonymous"),
                    errors={}
                )
            arr_body.append(new_body)
            
        return arr_body

    @staticmethod
    def load_headers(header_data):
        headers = []
        for item in header_data:
            new_headers = KeyValue(key=item.get(
                "key"), value=item.get("value"),errors={})
            headers.append(new_headers)
        return headers

    @staticmethod
    def load_api_model(model_json):
        api_model_loader = ApiModelLoader()
        request_data = model_json.get("request", {})
        response_data = model_json.get("response", [])
        request_obj = api_model_loader.load_request(request_data=request_data)
        response_obj = api_model_loader.load_response(response_data=response_data)
        api_model = ApiModel(
            id=model_json.get("id"),
            operation_id=model_json.get("operation_id"),
            tags=model_json.get("tags"),  # Tags remaining
            request=request_obj,
            response=response_obj,
            summary=model_json.get("summary"),  # Summary later,
            is_authentication_api=model_json.get("is_authentication_api"),
            errors={}
        )
        
        return api_model

    @staticmethod
    def load_auth_api_model(model_json):
        api_model_loader = ApiModelLoader()
        request_data = model_json.get("request", {})
        response_data = model_json.get("response", {})
        request_obj = api_model_loader.load_request(request_data=request_data)
        response_obj = api_model_loader.load_response(response_data=response_data)
        api_model = AuthApiModel(
            id=model_json.get("id"),
            operation_id=model_json.get("operation_id"),
            tags=model_json.get("tags"),  # Tags remaining
            request=request_obj,
            response=response_obj,
            summary=model_json.get("summary"),  # Summary later,
            auth_api_type=AuthApiTypeEnum[model_json.get("auth_api_type", "NONE").upper()] ,
            authentication_type= AuthTypeEnum[model_json.get("authentication_type").upper()],
            is_authorization_url=model_json.get("is_authorization_url", ""),
            flow=model_json.get("flow", {}),
            flow_type= model_json.get("flow_type", ""),
            token_store=api_model_loader.load_token_store(model_json.get("token_store",{})),
            errors={}
        )
        return api_model