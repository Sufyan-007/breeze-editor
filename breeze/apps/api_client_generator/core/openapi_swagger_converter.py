import yaml
import traceback
import copy
import os
import json

from ..api_models import MethodsEnum

from ..utils.content_type_and_mode import get_content_type_and_mode
from ..utils.set_response_status import set_response_status
from ..utils.jsonencoder import EnhancedJSONEncoder
from ..utils.uuid_as_key import generate_uuid_as_key
from ..utils.api_model_loader import ApiModelLoader

from common.utils.app_consts import CONFIG_PATH
class OpenapiConverter:
    def __init__(self):
        pass

    ## headers remaining
    def create_request_json(self,path, path_data, operation, meta_data):
        method = operation.strip().upper()
        auth_data = self._create_auth_arr_json(path_data, meta_data=meta_data)
        url_data = self._create_url_json(path,meta_data)
        parameters = self._create_parameters_json(path_data.get("parameters"))
        arr_body_data = self._create_body_arr_json(path_data.get("requestBody", {}), meta_data= meta_data)
        print(MethodsEnum[method].name)
        print(MethodsEnum[method].value)
        request_obj = {
            "method":MethodsEnum[method].name, 
            "auth":auth_data, 
            "headers":[], 
            "parameters":parameters, 
            "url":url_data, 
            "body":arr_body_data
        }
        
        return request_obj
          

    ## complete
    def _create_auth_arr_json(self, path_data, meta_data):
        auth_type = "NOAUTH"
        security_schemes = meta_data.get("components",{}).get("securitySchemes",{})
        ## first check if secuirty is provided on the path data
        auth_data = path_data.get("security",None)
        arr_auth = []
        if auth_data is None or not auth_data:
            return None
        
        ## if security scope is given then it will be object
        ## else it would be array of security operations
        
        if  isinstance(auth_data,dict):
            for security_name,scopes in auth_data.items():
                scheme_details = security_schemes.get(security_name, {})
                auth_type = scheme_details.get("type","")
                auth_type = auth_type.strip().upper()
                if security_name.lower() == "bearerauth":
                    auth_type = "BEARER" 
                elif security_name.lower() == "basicauth":
                    auth_type = "BASIC"
                arr_auth.append({
                    "type" : auth_type,
                    "content": [],
                    "login_api" : None,
                    "token_api" : None
                })
        
        elif isinstance(auth_data,list):
            for security_item in auth_data:
                auth_type= "NOAUTH"
                if isinstance(security_item,str):
                    scheme_details = security_schemes.get(security_item, {})
                    auth_type = scheme_details.get("type","")
                    auth_type = auth_type.strip().upper()
                    if security_item.lower() == "bearerauth":
                        auth_type = "BEARER" 
                    elif security_item.lower() == "basicauth":
                        auth_type = "BASIC"
                
                    
                else:
                    for security_name, _ in security_item.items():
                        scheme_details = security_schemes.get(security_name, {})
                        auth_type = scheme_details.get("type","")
                        auth_type = auth_type.strip().upper()
                        if security_name.lower() == "bearerauth":
                            auth_type = "BEARER" 
                        elif security_name.lower() == "basicauth":
                            auth_type = "BASIC"
                
                arr_auth.append({
                    "type" : auth_type,
                    "content": [],
                    "login_api" : None,
                    "token_api" : None
                })
            
            
        return arr_auth


    ## complete
    def _create_parameters_json(self, parameter_data):
        parameters = []
        if parameter_data and len(parameter_data) > 0:
            for param in parameter_data:
                parameters.append({
                    "param_in": param.get("in").strip().upper(),
                    "name":param.get("name"),
                    "type":param.get("schema").get("type").strip().upper(),
                    "required":param.get("required"),
                    "description":param.get("description")
                })
                
        return parameters


    ## need to handle env and multiple server url
    def _create_url_json(self,path, meta_data):
        paths = path.split("/")
        url_data = meta_data.get("servers",[])
        base_url = ""
        if url_data is not None and len(url_data)>0:
            base_url = url_data[0].get("url")
        url = {
            "servers" : url_data,
            "baseurl" : base_url, 
            "host": [],
            "protocol": "HTTP", 
            "port": None,
            "path": paths,
            "url_env":None
        }
        return url
    

    ## creat schme remaining
    def _create_body_arr_json(self, body_data, meta_data):
        arr_body = []
        file = None
        schema_name = None
        mode = None
        content_type = None
        components = meta_data.get("components",{})
        schemas = components.get("schemas",{})
        required = body_data.get("required", False)
        if body_data:
            for content_type_str, content in body_data.get("content", {}).items():
                content_type = content_type_str.strip().upper()
                is_anonymous = False
                schema = content.get("schema",{})
                body_schema = {
                    'type': "object",
                    'properties': {},
                    'required': []
                }
                if "$ref" in schema: 
                    schema_name = schema.get("$ref",None)
                    schema_name = schema_name.split('/')[-1]
                    body_schema = self._create_schema(schema_name,schemas)
                else:
                    is_anonymous = True
                    if schema.get("type") == "object":
                        body_schema = {
                            'type': "object",
                            'properties': {},
                            'required': []
                        }
                        for prop_name, prop_data in schema.get("properties").items():
                            prop_ref = prop_data.get('$ref', None)
                            if prop_ref:
                                prop_name = prop_ref.split('/')[-1]
                                prop_schema = self._create_schema(prop_name, schemas)
                            else:
                                prop_type = prop_data.get('type', '')
                                prop_schema = {'type': prop_type}
                                if 'example' in prop_data:
                                    prop_schema['example'] = prop_data['example']

                            if prop_data.get('type') == 'array' and 'items' in prop_data:
                                items_ref = prop_data['items'].get('$ref', '')
                                if items_ref:
                                    items_name = items_ref.split('/')[-1]
                                    items_schema = self._create_schema(items_name, schemas)
                                    prop_schema['items'] = items_schema
                                else:
                                    prop_schema['items'] = prop_data['items']

                            body_schema['properties'][prop_name] = prop_schema

                    else:
                        pass
                    
                content_type,mode = get_content_type_and_mode(content_type_str)    
                arr_body.append({
                    "mode":mode,
                    "content_type" : content_type,
                    "required":required,
                    "schema_name":schema_name,
                    "raw_content":'',
                    "file":file,
                    "schema":body_schema,
                    "anonymous" : is_anonymous
                })
        return arr_body


    ## complete
    def _create_headers(self, header_data):
        pass
    

    ## need to complete
    def _create_schema(self, schema_name, components_schemas, seen=None):
        if seen is None:
            seen = set()
        if schema_name in seen:
            return {}
        
        seen.add(schema_name)
        schema_data = components_schemas.get(schema_name, {})
        schema_type = schema_data.get('type', '')
        properties = schema_data.get('properties', {})
        required = schema_data.get('required', [])

        schema = {
            'type': schema_type,
            'properties': {},
            'required': required
        }

        for prop_name, prop_data in properties.items():
            prop_ref = prop_data.get('$ref', '')
            if prop_ref:
                prop_name = prop_ref.split('/')[-1]
                prop_schema = self._create_schema(prop_name, components_schemas, seen=seen)
            else:
                prop_type = prop_data.get('type', '')
                prop_schema = {'type': prop_type}
                if 'example' in prop_data:
                    prop_schema['example'] = prop_data['example']

            if prop_data.get('type') == 'array' and 'items' in prop_data:
                items_ref = prop_data['items'].get('$ref', None)
                if items_ref:
                    items_name = items_ref.split('/')[-1]
                    items_schema = self._create_schema(items_name, components_schemas, seen=seen)
                    prop_schema['items'] = items_schema
                else:
                    prop_schema['items'] = prop_data['items']

            schema['properties'][prop_name] = prop_schema

        return schema


    ## creat schme remaining
    def create_response_arr_json(self, path_data, meta_data):
        operation_responses = path_data.get("responses", {})
        responses = []
        if operation_responses is None or len(operation_responses) <= 0:
            return []
        
        for status, data in operation_responses.items():
            content_type = None
            schema_name = None
            schema= {}
            raw_content = ""
            content = data.get("content", None)
            if content and not bool(content):
                for key, value in content.items():
                    content_type,mode = get_content_type_and_mode(key)    
                    schema = content.get("schema",{})
                    if "$ref" in schema: 
                        schema_name = schema.get("$ref",None)
                        schema = {
                                'type': "object",
                                'properties': {},
                                'required': []
                        }
                    else:
                        is_anonymous = True
                        if schema.get("type") == "object":
                            schema = {
                                'type': "object",
                                'properties': {},
                                'required': []
                            }
                        else:
                            pass
                                   
            else:
                content_type = 'TEXT'
                raw_content = data.get("description")

            responses.append(
                {
                    "status":set_response_status(status),
                    "content_type":content_type.strip().upper(),
                    "schema_name":schema_name,
                    "schema":schema,
                    "raw_content":raw_content,
                    "file":'',
                    "description":data.get("description","")
                }
            )
        return responses


    @staticmethod
    def generate_json_for_security_schema(schema_name,schema_data,meta_data):
        auth_obj = {
            "tags" : "auth",
            "auth" : None,
            "url" : None,
            "body" : None,
            "request" : {},
            "response" : [],
            "token_store" : None,
            "authentication_type" : "BASIC",
            "is_authorization_url" : False,
            "flow" : None,
            "token_store": None

        }

        auth_api_objects = []
        if schema_name == "basicAuth":
            auth_obj["id"] = generate_uuid_as_key()
            auth_obj["operation_id"] =schema_name+"_basic",
            auth_obj["authentication_type"] = "BASIC"
            auth_obj["auth_api_type"] = None

            auth_api_objects.append(auth_obj)

        elif schema_name == "bearerAuth":
            br_auth_login = copy.deepcopy(auth_obj)
            br_auth_login["id"] = generate_uuid_as_key()
            br_auth_login["operation_id"] =schema_name+"_login"
            br_auth_login["authentication_type"] = "BEARER"
            br_auth_login["auth_api_type"] = "LOGIN"
            auth_api_objects.append(br_auth_login)

            br_auth_refresh = copy.deepcopy(auth_obj)            
            br_auth_refresh["id"] = generate_uuid_as_key()
            br_auth_refresh["operation_id"] =schema_name+"_efresh"
            br_auth_refresh["authentication_type"] = "BEARER"
            br_auth_refresh["auth_api_type"] = "REFRESH"
            auth_api_objects.append(br_auth_refresh)

        else:
            type = schema_data.get("type")
            if type == "oauth2":
                flows = schema_data.get("flows",{})
                for flow_type,obj in flows.items():
                    if flow_type == "implicit" or flow_type == "authorizationCode":
                        if "authorizationUrl" in obj and obj.get("authorizationUrl") is not None:
                            o2_auth_login = copy.deepcopy(auth_obj)
                            o2_auth_login["id"] = generate_uuid_as_key()
                            o2_auth_login["operation_id"] =schema_name+"_implicit"
                            o2_auth_login["authentication_type"] = "OAUTH2"
                            o2_auth_login["auth_api_type"] = "LOGIN"
                            authorizationUrl = obj.get("authorizationUrl") 
                            url = {
                                "baseurl": authorizationUrl, 
                                "host": [],
                                "protocol": '', 
                                "port": "",
                                "path": [],
                                "url_env":""
                            }
                            o2_auth_login["request"]["method"] = "POST"
                            o2_auth_login["request"]["url"] = url                            
                            auth_api_objects.append(o2_auth_login)

                    
                    elif flow_type == "password" or flow_type == "clientCredentials":
                        if "tokenUrl" in obj and obj.get("tokenUrl") is not None:
                            tokenUrl = obj.get("tokenUrl") 
                            
                            o2_auth_login_p = copy.deepcopy(auth_obj)
                            o2_auth_login_p["id"] = generate_uuid_as_key()
                            o2_auth_login_p["operation_id"] =schema_name+"_password"
                            o2_auth_login_p["authentication_type"] = "OAUTH2"
                            o2_auth_login_p["auth_api_type"] = "LOGIN"
                            url = {
                                "baseurl": tokenUrl, 
                                "host": [],
                                "protocol": '', 
                                "port": "",
                                "path": [],
                                "url_env":""
                            }
                            o2_auth_login_p["request"]["method"] = "POST"
                            o2_auth_login_p["request"]["url"] = url                            
                            authorizationUrl = obj.get("authorizationUrl") 
                            auth_api_objects.append(o2_auth_login_p)

                        if "refreshUrl" in obj and obj.get("refreshUrl") is not None:
                            refreshUrl = obj.get("refreshUrl") 
                            o2_auth_rf = copy.deepcopy(auth_obj)
                            o2_auth_rf["id"] = generate_uuid_as_key()
                            o2_auth_rf["operation_id"] =schema_name+"_password"
                            o2_auth_rf["authentication_type"] = "OAUTH2"
                            o2_auth_rf["auth_api_type"] = "LOGIN"
                            url = {
                                "baseurl": refreshUrl, 
                                "host": [],
                                "protocol": '', 
                                "port": "",
                                "path": [],
                                "url_env":""
                            }
                            o2_auth_rf["request"]["method"] = "POST"
                            o2_auth_rf["request"]["url"] = url                            
                            authorizationUrl = obj.get("authorizationUrl") 
                            auth_api_objects.append(o2_auth_rf)

        return auth_api_objects        


    @staticmethod
    def handle_security_schema(security_schemas,meta_data):
        auth_api_objects = []
        auth_api_models = []
        for schema_name,schema in security_schemas.items():
            auth_api_objects = auth_api_objects + OpenapiConverter.generate_json_for_security_schema(schema_name,schema,meta_data)
        for obj in auth_api_objects:
            auth_api_models.append(ApiModelLoader.load_auth_api_model(obj))
        return auth_api_models
    

    ## complete        
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
                key = model.id # was model.id
                json_data[key] = model
            
            ## write all data back to file
            with open(full_file_path, "w") as file:
                json.dump(json_data,file, cls=EnhancedJSONEncoder)
            

    ## complete
    @staticmethod
    def prepare_api_models(json_data):
        try:
            if not json_data:
                raise ValueError("Empty JSON data")

            openapi_data = yaml.safe_load(json_data)
            tag_models = {}
            security_schemes = openapi_data.get("components",{}).get("securitySchemes",{})
            security_schemes_models = OpenapiConverter.handle_security_schema(security_schemes,openapi_data)
            
            
            tags_map = OpenapiConverter.classified_tags_and_method(openapi_data) 
            converted_json_tags_mapping = OpenapiConverter.convert_to_json_data_model(tags_map,openapi_data)
            
            ## now load these json obj to api models
            for tag,arr_obj in converted_json_tags_mapping.items():
                for obj in arr_obj:
                    api_model = ApiModelLoader.load_api_model(obj)
                    if tag in tag_models:
                        tag_models[tag].append(api_model)
                    else:
                        tag_models[tag] = [api_model] 
            return  {
                "tag_models" : tag_models,
                "security_schemes_models" : security_schemes_models
            }

        except Exception as e:
            print(traceback.format_exc())
            return {"error": str(e)}


    ##done
    ## it will return tags_mapping with path, operation, operation_data
    @staticmethod
    def classified_tags_and_method(open_api_json_data):
        paths = open_api_json_data.get('paths', {})
        tags_map = {
            "default" : []
        }
        for path, path_data in paths.items():
            for operation, operation_data in path_data.items():
                tags = operation_data.get("tags", None)
                if isinstance(tags,list):
                    for tag in tags:
                        if tag not in tags_map:
                            tags_map[tag] = []
                        tags_map[tag].append((path, operation, operation_data))
                
                elif isinstance(tags,str):
                    if tags not in tags_map:
                        tags_map[tags] = []
                    tags_map[tags].append((path, operation, operation_data))
                else:
                    operation_data["tag"] = "default"
                    tags_map["default"].append((path, operation, operation_data))
        return tags_map
    

    ## done
    ## it will return the tags mapping with json object of api model
    @staticmethod
    def convert_to_json_data_model(tags_map,meta_data):
        try:
            tag_mappings = {}
            for tag, tag_operations in tags_map.items():
                for path, operation, operation_data in tag_operations:
                    openApiConverter = OpenapiConverter()
                    request_obj = openApiConverter.create_request_json(
                        path=path,
                        path_data=operation_data,
                        operation=operation,
                        meta_data=meta_data
                    )
                    response_arr = openApiConverter.create_response_arr_json(
                        path_data=operation_data,
                        meta_data=meta_data
                    )
                    id = generate_uuid_as_key()
                    api_model_obj = {
                        "id" : id,
                        "operation_id":operation_data.get("operationId"),
                        "tags" :tag,
                        "request":request_obj,
                        "response":response_arr,
                        "summary":operation_data.get("summary"),
                        "is_authentication_api":False
                    }
                    if tag in tag_mappings:
                        tag_mappings[tag].append(api_model_obj) 
                    else:
                         tag_mappings[tag]= [api_model_obj]

            return tag_mappings

        except Exception as e:
            print(traceback.format_exc())
            return {"error": str(e)}


    
   

                    
                
                