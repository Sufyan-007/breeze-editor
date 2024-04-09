import yaml

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

from .openapi_swagger_converter import OpenapiConverter
from common.utils.app_consts import CONFIG_PATH
import json
class OpenApiHelper:
    
    @staticmethod
    def generate_model_for_security_schema(schema_name,schema_data):
        openApiConverter = OpenapiConverter()
        auth = Auth(None,[],None,None)
        url = Url(None,None,None,None,[],None)
        body = Body(None,None,None,None,None,None,None,None)
        request_obj = Request(None,auth,[],[],url,body)
        response_obj = Response(None,None,None,None,None)
    
        auth_api_models = []
        if schema_name == "basicAuth":
            
            api_model = AuthApiModel(
                schema_name,
                ["authorization"],
                request_obj,
                response_obj,
                "summary",
                auth_api_type= "",
                authentication_type= "BASIC",
                is_authorization_url=False,
                flow= {},
                token_store = {}
    
            )
            auth_api_models.append(api_model)

        elif schema_name == "bearerAuth":
            api_model_login = AuthApiModel(
                schema_name+"_login",
                ["authorization"],
                request_obj,
                response_obj,
                "summary",
                auth_api_type= "LOGIN",
                authentication_type= "BEARER",
                is_authorization_url = False,
                flow= {},
                token_store = {}
            )
            auth_api_models.append(api_model_login)

            api_model_refresh = AuthApiModel(
                schema_name+"_refresh",
                ["authorization"],
                request_obj,
                response_obj,
                "summary",
                auth_api_type= "REFRESH",
                authentication_type= "BEARER",
                is_authorization_url = False,
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
                                schema_name+"_implicit",
                                ["authorization"],
                                request_obj,
                                response_obj,
                                "summary",
                                auth_api_type= "LOGIN",
                                authentication_type= "OAUTH2",
                                is_authorization_url = True,
                                flow = obj,
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
                                schema_name+"_password",
                                ["authorization"],
                                request_obj,
                                response_obj,
                                "summary",
                                auth_api_type= "LOGIN",
                                authentication_type= "OAUTH2",
                                flow = obj,
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
                                schema_name+"_password",
                                ["authorization"],
                                request_obj,
                                response_obj,
                                "summary",
                                auth_api_type= "REFRESH",
                                authentication_type= "OAUTH2",
                                flows = [],
                                token_store = {}
                            )
                            auth_api_models.append(api_model)
                    
                    
        return auth_api_models        
        
            
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
                json_data[model.operation_id] = model
            
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
                    for tag in tags:
                        if tag not in tags_map:
                            tags_map[tag] = []
                        tags_map[tag].append((path, operation, operation_data))

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
                    api_model = ApiModel(
                        operation_data.get("operationId"),
                        operation_data.get("tags"),
                        request_obj,
                        response_obj,
                        operation_data.get("summary"),
                        is_authentication_api=False
                    )
                    api_models.append(api_model)

                filename = f"{tag}Service.json"
                result[filename] = api_models

            return result

        except Exception as e:
            return {"error": str(e)}

