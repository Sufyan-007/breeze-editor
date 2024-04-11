import yaml, uuid
import yaml, uuid

from ..helper_models.base_models.api_model import ApiModel
from ..helper_models.base_models.auth_api_model import AuthApiModel
from ..helper_models.base_models.request import Request
from ..helper_models.base_models.response import Response 

from ..helper_models.base_models.url import Url
from ..helper_models.base_models.body import Body
from ..helper_models.base_models.auth import Auth

from ..helper_models.base_models.url import Url
import os
from ..helper_models.encoder import EnhancedJSONEncoder
from .helpers.uuid_as_key import generate_uuid_as_key
from .openapi_swagger_converter import OpenapiConverter
from common.utils.app_consts import CONFIG_PATH
import json
class OpenApiHelper:
    
    @staticmethod
    def generate_model_for_security_schema(schema_name,schema_data):
        id=generate_uuid_as_key()
        auth = Auth(None,[],None,None)
        url = Url(None,None,None,None,[],None)
        body = Body(None,None,None,None,None,None,None,None)
        request_obj = Request(None,auth,[],[],url,body)
        response_obj = Response(None,None,None,None,None)
    
        auth_api_models = []
        if schema_name == "basicAuth":
            
            api_model = AuthApiModel(
                operation_id=schema_name,
                tags=["authorization"],
                request=request_obj,
                response=response_obj,
                summary="summary",
                auth_api_type= "",
                id=id,
                authentication_type= "BASIC",
                is_authorization_url=False,
                flow= {},
                token_store = {}
    
            )
            auth_api_models.append(api_model)

        elif schema_name == "bearerAuth":
            api_model_login = AuthApiModel(
                operation_id=schema_name+"_login",
                tags=["authorization"],
                request=request_obj,
                response=response_obj,
                summary="summary",
                auth_api_type= "LOGIN",
                id=id,
                authentication_type= "BEARER",
                is_authorization_url = False,
                flow= {},
                token_store = {}
            )
            auth_api_models.append(api_model_login)

            api_model_refresh = AuthApiModel(
                operation_id=schema_name+"_refresh",
                tags=["authorization"],
                request=request_obj,
                response=response_obj,
                summary="summary",
                auth_api_type= "REFRESH",
                authentication_type= "BEARER",
                is_authorization_url = False,
                id=id,
                flow= {},
                token_store = {}
            )
            auth_api_models.append(api_model_refresh)

        else:
            type = schema_data.get("type")
            if type == "oauth2":
                flows = schema_data.get("flows",{})
                for flow_type,obj in flows.items():
                    if flow_type == "implicit" or flow_type == "authorizationCode":
                        if "authorizationUrl" in obj and obj.get("authorizationUrl") is not None:
                            authorizationUrl = obj.get("authorizationUrl") 
                            url = Url(
                                baseurl= authorizationUrl, 
                                host= '',
                                protocol= '', 
                                port= "",
                                path= "",
                                url_env=""
                            )
                            request_obj.url = url
                            api_model = AuthApiModel(
                                operation_id =schema_name+"_implicit",
                                tags=["authorization"],
                                request=request_obj,
                                response=response_obj,
                                summary="summary",
                                auth_api_type= "LOGIN",
                                authentication_type= "OAUTH2",
                                is_authorization_url = True,
                                flow = obj,
                                id=id,
                                token_store = {}
                            )
                            auth_api_models.append(api_model)
                    
                    elif flow_type == "password" or flow_type == "clientCredentials":
                        if "tokenUrl" in obj and obj.get("tokenUrl") is not None:
                            tokenUrl = obj.get("tokenUrl") 
                            url = Url(
                                baseurl= tokenUrl, 
                                host= '',
                                protocol= '', 
                                port= "",
                                path= "",
                                url_env=""
                            )
                            request_obj.url = url
                            api_model = AuthApiModel(
                                operation_id=schema_name+"_password",
                                tags=["authorization"],
                                request=request_obj,
                                response=response_obj,
                                summary="summary",
                                auth_api_type= "LOGIN",
                                authentication_type= "OAUTH2",
                                flow = obj,
                                id=id,
                                token_store = {}
                            )
                            auth_api_models.append(api_model)
                        if "refreshUrl" in obj and obj.get("refreshUrl") is not None:
                            refreshUrl = obj.get("refreshUrl") 
                            url = Url(
                                baseurl= refreshUrl, 
                                host= '',
                                protocol= '', 
                                port= "",
                                path= "",
                                url_env=""
                            )
                            request_obj.url = url
                            api_model = AuthApiModel(
                                operation_id=schema_name+"_password",
                                tags=["authorization"],
                                request=request_obj,
                                response=response_obj,
                                summary="summary",
                                auth_api_type= "REFRESH",
                                authentication_type= "OAUTH2",
                                flows = [],
                                id=id,
                                token_store = {}
                            )
                            auth_api_models.append(api_model)
                    
                    
        return auth_api_models        

    @staticmethod
    def load_auth_model(json_data,is_new=False):
        id=json_data.get("id", "") 
        if is_new:
            id=generate_uuid_as_key()
        
        auth = Auth(**json_data.get("request").get("auth",{}))
        url = Url(**json_data.get("request").get("url",{}))
        body = Body(**json_data.get("request").get("body",{}))
        request_obj = Request(json_data.get("request").get("method"),
                              auth,
                              json_data.get("request").get("headers"),
                              json_data.get("request").get("parameters"),
                              url,
                              body
                              ),
        response_objs = []
        for response_data in json_data.get("response", []):
            response_objs.append(Response(**response_data))
        operation_id = json_data.get("operation_id","")
        tags =  json_data.get("tags",[])
        summary =  json_data.get("summary","")
        auth_api_type  =  json_data.get("auth_api_type","")
        authentication_type =  json_data.get("authentication_type","")
        is_authorization_url =  json_data.get("is_authorization_url",False)
        flow =  json_data.get("flow",{})
        token_store =  json_data.get("token_store",{})
        return AuthApiModel(id=id,operation_id=operation_id,tags=tags,auth_api_type=auth_api_type,
                            authentication_type=authentication_type,
                            is_authorization_url=is_authorization_url,flow=flow,
                            request=request_obj,response=response_objs,summary=summary,
                            token_store=token_store)
    
        
            
    @staticmethod
    def append_auth_json(auth_models):
        ##first load existing file data into json
        # Read JSON file
        project_name = "creator"
        folder_path = f"{CONFIG_PATH}/{project_name}/generated_intermediate_json"
        filename = "auth.json"
        full_file_path = os.path.join(folder_path, filename)
        json_data = {}
        with open(full_file_path) as fp:
            json_data = json.load(fp)
            ## append to existing json data 
            for model in auth_models:
                key = model.operation_id # was model.id
                json_data[key] = model
            
            ## write all data back to file
            with open(full_file_path, "w") as file:
                json.dump(json_data,file, cls=EnhancedJSONEncoder)
            

    @staticmethod
    def open_api_helper(json_data):
        try:
            if not json_data:
                raise ValueError("Empty JSON data")

            openapi_data = yaml.safe_load(json_data) if json_data.endswith('.yml') else yaml.safe_load(json_data)

            result = {}
            paths = openapi_data.get('paths', {})
            ## load seperate api model for the security schema if present
            security_schemes = openapi_data.get("components").get("securitySchemes",{})
            auth_apis = []
            for schema_name , schema in security_schemes.items():
                auth_api_models = OpenApiHelper.generate_model_for_security_schema(schema_name,schema)
                if len(auth_api_models) > 0:
                    auth_apis = auth_apis + auth_api_models
            ## append this auth api configuration to the auth json file
            OpenApiHelper.append_auth_json(auth_apis)
                
            tags_map = {}
            for path, path_data in paths.items():
                for operation, operation_data in path_data.items():
                    tags = operation_data.get("tags", [])
                    if isinstance(tags,list):
                        for tag in tags:
                            if tag not in tags_map:
                                tags_map[tag] = []
                            tags_map[tag].append((path, operation, operation_data))
                    
                    elif isinstance(tags,str):
                        if tags not in tags_map:
                            tags_map[tags] = []
                        tags_map[tags].append((path, operation, operation_data))

            for tag, tag_operations in tags_map.items():
                api_models = []
                for path, operation, operation_data in tag_operations:
                    openApiConverter = OpenapiConverter()
                    request_obj = openApiConverter.create_request(
                        path=path,
                        path_data=operation_data,
                        operation=operation,
                        security_schemes=openapi_data.get("components").get("securitySchemes"),
                        servers=openapi_data.get("servers"),
                        schemas=openapi_data.get("components").get("schemas"))
                    response_obj = openApiConverter.create_response(
                        path_data=operation_data,
                        operation=operation)
                    id = generate_uuid_as_key()
                    api_model = ApiModel(
                        id = id,
                        operation_id=operation_data.get("operationId"),
                        tags =operation_data.get("tags"),
                        request=request_obj,
                        response=response_obj,
                        summary=operation_data.get("summary"),
                        isAuthenticationApi=False,
                        isLogin=False,
                        isToken=False,
                    )
                    api_models.append(api_model)

                filename = f"{tag}Service.json"
                result[filename] = api_models

            return result

        except Exception as e:
            return {"error": str(e)}

