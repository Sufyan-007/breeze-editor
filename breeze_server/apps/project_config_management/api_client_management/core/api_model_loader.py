from ..utils.api_models import AuthApiModel,Auth,AuthContent,ApiModel,TokenStore,Channel
from ..utils.api_models import Request,Response,KeyValue,Url,Body,Parameter,WebsocketModel
from ..utils.api_models import MethodsEnum,StatusEnum,ParamsInEnum,ContentEnum,ModeEnum,AuthTypeEnum,AuthApiTypeEnum,SchemaRelationEnum,TokenStoreTypeEnum

class ApiModelLoader:

    @staticmethod
    def load_request(request_data):
        final_errors = {"root_errors":[]}
        root_errors_set = set()
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
                auth_obj = auth.as_dict()
                auth_obj_errors = auth_obj.get("errors")
                if auth_obj_errors and len(auth_obj_errors.get("root_errors")) > 0 :
                    root_errors_set.add("auth")
                auths_model.append(auth)
        else:
            auths_model = []

        # handle headers
        headers = []
        header_data = request_data.get("headers", [])
        if header_data:
            headers = api_model_loader.load_headers(header_data=header_data)
            for header in headers:
                header_obj = header.as_dict()
                header_obj_errors = header_obj.get("errors")
                if header_obj_errors and len(header_obj_errors.values())>0:
                    root_errors_set.add("headers")
        # call to url data creation and parameters creation
        url_data = request_data.get("url", "")
        url = []
        if url_data:
            url = api_model_loader.load_url(url_data)
            url_obj = url.as_dict()
            url_obj_errors = url_obj.get("errors")
            if url_obj_errors is not None and  len(url_obj_errors.get("root_errors", [])) >0:
                root_errors_set.add("url")
            
        parameters = []
        parameters = request_data.get("parameters", [])
        if parameters:
            parameters = api_model_loader.load_parameters(parameters=parameters)
            for param in parameters:
                param_obj = param.as_dict()
                param_obj_errors = param_obj.get("errors")
                if param_obj_errors and len(param_obj_errors.values())>0:
                    root_errors_set.add("parameters")
           
        # call to body creation
        body = []
        if request_data.get("body"):
            body_data = request_data.get("body")
            body = api_model_loader.load_body(body_data=body_data)
            for b in body:
                b_obj = b.as_dict()
                b_obj_errors = b_obj.get("errors")
                if b_obj_errors and len(b_obj_errors.values())>0:
                    root_errors_set.add("body")
                    
        root_errors_list = list(root_errors_set)
        final_errors["root_errors"] = root_errors_list
        request_obj = Request(method=method, auth=auths_model, headers=headers, parameters=parameters, url=url, body=body, errors=final_errors)
        
            
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
                    token_store=r_data.get("token_store",None),
                    errors={}
                )
                response.append(new_response)     
        return response

    @staticmethod
    def load_auth(auth_data):
        auth_type = auth_data.get("type")
        auth_scheme = auth_data.get("scheme", None)
        login_api = auth_data.get("login_api", None)
        token_id = auth_data.get("token_id", None)
        content_data = auth_data.get("content", auth_data.get("contents", []))
        auth_type_enum = ""
        if auth_type and auth_type in AuthTypeEnum._member_map_:  
            auth_type_enum = AuthTypeEnum[auth_type]
        elif auth_scheme and auth_scheme in AuthTypeEnum._member_map_:  
            auth_type_enum = AuthTypeEnum[auth_scheme]
        else:
            auth_type_enum = AuthTypeEnum.NOAUTH
        auth_content = []
        for content in content_data:
            new_auth_content = AuthContent(
                    key=content.get("key"),
                    value=content.get("value"),
                    type=content.get("type"),
                    errors={}
                )
            auth_content.append(new_auth_content)
            
        auth = Auth(type=auth_type_enum, content=auth_content,
                    login_api=login_api, token_id=token_id,errors={})
        
        return auth

    @staticmethod
    def load_channel(data):
        return Channel(operation_id=data.get("operation_id"),
                description=data.get("description"),
                schema_relation=SchemaRelationEnum[data.get("schema_relation")],
                messages=data.get("messages"),
                schema=data.get("schema"))
    
        
    @staticmethod
    def load_parameters(parameters):
        params = []
        for param in parameters:
            new_parameters = Parameter(
                    param_in=ParamsInEnum[param.get("param_in").upper()],
                    name=param.get("name"),
                    type=param.get("type"),
                    required=param.get("required"),
                    param_type=param.get("param_type", "USER_INPUT"),
                    value=param.get("value"),
                    storage_key=param.get("storage_key"),
                    description=param.get("description"),
                    errors= {}
                )
            params.append(new_parameters)
            
        return params

    @staticmethod
    def load_url(url_data):
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
                    mode=ModeEnum[body.get("mode").upper()],
                    raw_content=body.get("raw", body.get("raw_content")),
                    schema=body.get("schema", {}), 
                    required=body.get("required"),
                    schema_name=body.get("schema_name"),
                    file=body.get("file"),
                    errors={}
                )
            arr_body.append(new_body)
            
        return arr_body

    @staticmethod
    def load_headers(header_data):
        headers = []
        for item in header_data:
            new_headers = KeyValue(key=item.get("key"), 
                value=item.get("value"),type=item.get("type"),errors={},storage_key=item.get("storage_key"),data_type=item.get("data_type"))
            headers.append(new_headers)
        return headers

    @staticmethod
    def load_api_model(model_json):
        final_errors = {"root_errors": []}
        api_model_loader = ApiModelLoader()
        request_data = model_json.get("request", {})
        response_data = model_json.get("response", [])
        request_obj = api_model_loader.load_request(request_data=request_data)
        response_obj = api_model_loader.load_response(response_data=response_data)
        request_obj_dict = request_obj.as_dict()
        if len(request_obj_dict.get("errors").get("root_errors"))>0:
            final_errors["root_errors"].append("request")
            
        api_model = ApiModel(
            type="FUNCTION",
            isAsync=True,
            parameters=model_json.get("parameters",[]),
            id=model_json.get("id"),
            operation_id=model_json.get("operation_id"),
            tags=model_json.get("tags"),  
            request=request_obj,
            response=response_obj,
            summary=model_json.get("summary"), 
            is_authentication_api=model_json.get("is_authentication_api"),
            is_open_api=model_json.get("is_open_api", False),
            errors=final_errors
        )
        
        return api_model

    @staticmethod
    def load_auth_api_model(model_json):
        api_model_loader = ApiModelLoader()
        request_obj = api_model_loader.load_request(request_data= model_json.get("request"))
        response_obj = api_model_loader.load_response(response_data= model_json.get("response"))
        api_model = AuthApiModel(
            id=model_json.get("id"),
            operation_id=model_json.get("operation_id"),
            tags=model_json.get("tags"),  
            request = request_obj,
            response = response_obj,
            summary=model_json.get("summary"),  
            auth_api_type=AuthApiTypeEnum[model_json.get("auth_api_type", "NONE").upper()] ,
            authentication_type= AuthTypeEnum[model_json.get("authentication_type").upper()],
            token_store=api_model_loader.load_token_store(model_json.get("token_store",{})),
            is_authentication_api= model_json.get("is_authentication_api", False),
            interceptor_id=model_json.get("interceptor_id", ''),
            errors={}
        )
        return api_model
    
    @staticmethod
    def load_ws_model(model_json):
        url_data = model_json.get("url", "")
        url = []
        if url_data:
            url = ApiModelLoader.load_url(url_data=url_data)

        publish_obj = ApiModelLoader.load_channel(data=model_json.get("publish"))
        subscribe_obj = ApiModelLoader.load_channel(data=model_json.get("subscribe"))
        api_model = WebsocketModel(
            id=model_json.get("id"),
            url=url,
            tags=model_json.get("tags"),  
            publish=publish_obj,
            subscribe=subscribe_obj
        )
        return api_model

    