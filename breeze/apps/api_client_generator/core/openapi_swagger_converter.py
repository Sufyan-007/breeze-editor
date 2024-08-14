import yaml
import traceback
import copy
import os
import json

from ..api_models import MethodsEnum,AuthApiTypeEnum,AuthTypeEnum
from common.utils.app_consts import CONFIG_PATH, CONFIG_FILES_PATH
from common.utils.config_reader import read_config_file
from ..utils.content_type_and_mode import get_content_type_and_mode
from ..utils.set_response_status import set_response_status
from ..utils.jsonencoder import EnhancedJSONEncoder
from ..utils.uuid_as_key import generate_uuid_as_key
from ..utils.api_model_loader import ApiModelLoader
from ..api_models.custom_exception import CustomeException
from common.utils.app_consts import CONFIG_PATH
# from ..api.create_auth_interceptors import create_auth_interceptors
from ..utils.append_dict_file import append_to_dict_file
class OpenapiConverter:
    def __init__(self):
        # self.project_name = project_name
        pass        

    ## headers remaining
    def create_request_json(self,path, path_data, operation, meta_data,module_id,security_schemes_models=[]):
        method = operation.strip().upper()
        
        auth_data = self._create_auth_arr_json(path_data, meta_data=meta_data,security_schemes_models=security_schemes_models)
        url_data = self._create_url_json(path,meta_data)
        parameters = self._create_parameters_json(path_data.get("parameters"))
        arr_body_data = self._create_body_arr_json(path_data.get("requestBody", {}), meta_data= meta_data, module_id=module_id)
        request_obj = {
            "method":MethodsEnum[method].name, 
            "auth":auth_data, 
            "headers":[], 
            "parameters":parameters, 
            "url":url_data, 
            "body":arr_body_data
        }
        
        return request_obj
          
    
    def _get_login_refresh_auth_id_from_models(self,auth_type,security_schemes_models):
        login_api = None
        token_api = None
        for model in security_schemes_models:
            if model.authentication_type == AuthTypeEnum[auth_type]:
                if model.auth_api_type == AuthApiTypeEnum.LOGIN:
                    login_api = model.id  
                if model.auth_api_type ==  AuthApiTypeEnum.REFRESH:
                    token_api = model.id
        
        return login_api,token_api
    
    ## complete
    def _create_auth_arr_json(self, path_data, meta_data,security_schemes_models= []):
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
                login_api,token_api = self._get_login_refresh_auth_id_from_models(auth_type,security_schemes_models)
                arr_auth.append({
                    "type" : auth_type,
                    "content": [],
                    "login_api" : login_api,
                    "token_api" : token_api
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
                
                login_api,token_api = self._get_login_refresh_auth_id_from_models(auth_type,security_schemes_models)
                arr_auth.append({
                    "type" : auth_type,
                    "content": [],
                    "login_api" : login_api,
                    "token_api" : token_api
                })
            
            
        return arr_auth


    ## complete
    def _create_parameters_json(self, parameter_data):
        parameters = []
        if parameter_data and len(parameter_data) > 0:
            for param in parameter_data:
                parameters.append({
                    "param_in": param.get("in","").strip(),
                    "name":param.get("name"),
                    "type":param.get("schema").get("type").strip().upper(),
                    "required":param.get("required"),
                    "description":param.get("description")
                })
                
        return parameters


    ## need to handle env and multiple server url
    def _create_url_json(self,path, meta_data):
        paths = path.split("/")
        url_data = meta_data.get("servers")
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
    def _create_body_arr_json(self, body_data, meta_data,module_id):
        arr_body = []
        file = None
        schema_name = None
        mode = None
        content_type = None
        components = meta_data.get("components",{})
        schemas = components.get("schemas",{})
        required = False
        if body_data:
            required = body_data.get("required", False)
            for i, (content_type_str, content) in enumerate(body_data.get("content", {}).items()):
                if i > 0:
                    break  # Exit loop after the first iteration
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
                # schema_id = self.get_schema_id_by_name(schema_name, module_id)
               
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
    
    
    # def get_schema_id_by_name(self,schema, module_id):
    #     schema_file_path = f"{CONFIG_PATH}/{self.project_name}/swagger_schema/{module_id}.json"
    #     with open(schema_file_path, 'r')as file:
    #         schema_content = json.load(file)
    #     for key,value in schema_content.items():
    #         if value.get("name")== schema:
    #             return key
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


    def generate_json_for_security_schema(self,schema_name,schema_data,meta_data):
        auth_obj = {
            "tags" : "auth",
            # "url" : None,
            "body" : None,
            # "access_token_request" : {"method" : "POST"},
            # "refresh_token_request" : {"method" : "POST"},
            "request" : {"method" : "POST"},
            # "access_token_response" : [],
            # "refresh_token_response" : [],
            "response" : [],
            "token_store" : None,
            "authentication_type" : "BASIC",
            # "is_authorization_url" : False,
            # "flow" : None,
            "token_store": None,
            "summary":"",
            "is_authentication_api" : False

        }

        auth_api_objects = []
        if schema_name.lower() == "basicauth":
            auth_obj["id"] = generate_uuid_as_key()
            auth_obj["operation_id"] = schema_name + "_basic"
            auth_obj["authentication_type"] = "BASIC"
            auth_obj["auth_api_type"] = "LOGIN"

            auth_api_objects.append(auth_obj)

        elif schema_name.lower() == "bearerauth":
            br_auth_login = copy.deepcopy(auth_obj)
            br_auth_login["id"] = generate_uuid_as_key()
            br_auth_login["operation_id"] =schema_name+"_login"
            br_auth_login["authentication_type"] = "BEARER"
            br_auth_login["auth_api_type"] = "LOGIN"
            auth_api_objects.append(br_auth_login)

            # br_auth_refresh = copy.deepcopy(auth_obj)            
            # br_auth_refresh["id"] = generate_uuid_as_key()
            # br_auth_refresh["operation_id"] =schema_name+"_refresh"
            # br_auth_refresh["authentication_type"] = "BEARER"
            # br_auth_refresh["auth_api_type"] = "REFRESH"
            # auth_api_objects.append(br_auth_refresh)
            
            
        elif schema_name.lower() == "api_key":
            br_auth_login = copy.deepcopy(auth_obj)
            br_auth_login["id"] = generate_uuid_as_key()
            br_auth_login["operation_id"] =schema_name+"_login"
            br_auth_login["authentication_type"] = "APIKEY"
            br_auth_login["auth_api_type"] = "LOGIN"
            auth_api_objects.append(br_auth_login)

            # br_auth_refresh = copy.deepcopy(auth_obj)            
            # br_auth_refresh["id"] = generate_uuid_as_key()
            # br_auth_refresh["operation_id"] =schema_name+"_refresh"
            # br_auth_refresh["authentication_type"] = "APIKEY"
            # br_auth_refresh["auth_api_type"] = "REFRESH"
            # auth_api_objects.append(br_auth_refresh)
        # else:
        #     type = schema_data.get("type")
        #     if type == "oauth2":
        #         flows = schema_data.get("flows",{})
        #         for flow_type,obj in flows.items():
        #             if flow_type == "implicit" or flow_type == "authorizationCode":
        #                 if "authorizationUrl" in obj and obj.get("authorizationUrl") is not None:
        #                     o2_auth_login = copy.deepcopy(auth_obj)
        #                     o2_auth_login["id"] = generate_uuid_as_key()
        #                     o2_auth_login["operation_id"] =schema_name+"_implicit"
        #                     o2_auth_login["authentication_type"] = "OAUTH2"
        #                     o2_auth_login["auth_api_type"] = "LOGIN"
        #                     authorizationUrl = obj.get("authorizationUrl") 
        #                     url = {
        #                         "baseurl": authorizationUrl, 
        #                         "host": [],
        #                         "protocol": '', 
        #                         "port": "",
        #                         "path": [],
        #                         "url_env":""
        #                     }
        #                     o2_auth_login["request"]["method"] = "POST"
        #                     o2_auth_login["request"]["url"] = url                            
        #                     auth_api_objects.append(o2_auth_login)

                    
        #             elif flow_type == "password" or flow_type == "clientCredentials":
        #                 if "tokenUrl" in obj and obj.get("tokenUrl") is not None:
        #                     tokenUrl = obj.get("tokenUrl") 
                            
        #                     o2_auth_login_p = copy.deepcopy(auth_obj)
        #                     o2_auth_login_p["id"] = generate_uuid_as_key()
        #                     o2_auth_login_p["operation_id"] =schema_name+"_password"
        #                     o2_auth_login_p["authentication_type"] = "OAUTH2"
        #                     o2_auth_login_p["auth_api_type"] = "LOGIN"
        #                     url = {
        #                         "baseurl": tokenUrl, 
        #                         "host": [],
        #                         "protocol": '', 
        #                         "port": "",
        #                         "path": [],
        #                         "url_env":""
        #                     }
        #                     o2_auth_login_p["request"]["method"] = "POST"
        #                     o2_auth_login_p["request"]["url"] = url                            
        #                     authorizationUrl = obj.get("authorizationUrl") 
        #                     auth_api_objects.append(o2_auth_login_p)

        #                 if "refreshUrl" in obj and obj.get("refreshUrl") is not None:
        #                     refreshUrl = obj.get("refreshUrl") 
        #                     o2_auth_rf = copy.deepcopy(auth_obj)
        #                     o2_auth_rf["id"] = generate_uuid_as_key()
        #                     o2_auth_rf["operation_id"] =schema_name+"_password"
        #                     o2_auth_rf["authentication_type"] = "OAUTH2"
        #                     o2_auth_rf["auth_api_type"] = "LOGIN"
        #                     url = {
        #                         "baseurl": refreshUrl, 
        #                         "host": [],
        #                         "protocol": '', 
        #                         "port": "",
        #                         "path": [],
        #                         "url_env":""
        #                     }
        #                     o2_auth_rf["request"]["method"] = "POST"
        #                     o2_auth_rf["request"]["url"] = url                            
        #                     authorizationUrl = obj.get("authorizationUrl") 
        #                     auth_api_objects.append(o2_auth_rf)

        return auth_api_objects        


    
    def handle_security_schema(self,security_schemas,meta_data):
        api_model_loader = ApiModelLoader()
        auth_api_objects = []
        auth_api_models = []
        for schema_name,schema in security_schemas.items():
            auth_api_objects = auth_api_objects + self.generate_json_for_security_schema(schema_name,schema,meta_data)
        for obj in auth_api_objects:
            try:
                auth_api_model= api_model_loader.load_auth_api_model(obj)
                auth_api_models.append(auth_api_model)
            except Exception as e:
                print(traceback.format_exc())
        return auth_api_models
        
    

    ## complete        
    
    def append_auth_json(self,auth_model, appName,moduleId):
        ##first load existing file data into json
        # Read JSON file
        project_name = appName
        folder_path = f"{CONFIG_PATH}/{project_name}/swagger_metadata.json"
        # filename = "auth.json"
        # full_file_path = os.path.join(folder_path)
        json_data = {}
        with open(folder_path) as fp:
            json_data = json.load(fp)
            auth_api_data = json_data[moduleId].get("auth_apis", {})
            
            ## append to existing json data 
            # for model in auth_api_data:
            #     key = model.get("id")
            #     auth_api_data[key] = model
            
            auth_api_data[auth_model.get("id")] = auth_model
            json_data[moduleId]["auth_apis"] = auth_api_data
            ## write all data back to file
            with open(folder_path, "w") as file:
                json.dump(json_data,file, cls=EnhancedJSONEncoder)
            

    ## complete
    def prepare_api_models(self,json_data, project_name):
        app_config_dir = f"{CONFIG_PATH}/{project_name}"
        app_config = read_config_file(app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        app_config['APP_SOURCE_DIR'] = f"{app_config['path']}/{app_config['name']}/{app_config['components_src_dir']}"

        swagger_metadata_file_path = f"{app_config_dir}/swagger_metadata.json" 
        api_model_loader = ApiModelLoader()
        tag_models = {}
        security_schemes_models = []
        try:
            if not json_data:
                return 

            openapi_data = yaml.safe_load(json_data)
            meta_data = openapi_data.get("info",{})
            meta_data["auth_apis"] = {}
            if not os.path.exists(swagger_metadata_file_path):
                with open(swagger_metadata_file_path, "w") as file:
                    json.dump({"custom_schemas": {"title": "custom_schemas"}}, file)
            with open(swagger_metadata_file_path, "r") as file:
                swagger_metadata_file_content = json.load(file)
            swagger_metadata_id = generate_uuid_as_key()
            swagger_metadata_file_content[swagger_metadata_id] = meta_data
            append_to_dict_file(swagger_metadata_file_path, swagger_metadata_file_content)
            
            avalilable_schemas = openapi_data.get("components").get("schemas", {})
            structured_schema_data = {}
            for key, val in avalilable_schemas.items():
                id = generate_uuid_as_key()
                val["name"]= key
                structured_schema_data[id] = val
                
            custom_schemas_file_path = f"{CONFIG_PATH}/{project_name}/swagger_schema/custom_schemas.json"
            if not os.path.exists(custom_schemas_file_path):
                with open(custom_schemas_file_path, "w+") as file:
                    json.dump({}, file)
            schema_file_path = f"{CONFIG_PATH}/{project_name}/swagger_schema/{swagger_metadata_id}.json"
            
            if not os.path.exists(schema_file_path):
                with open(schema_file_path, "w+") as file:
                    json.dump({}, file)
            with open(schema_file_path, "w+") as file:
                json.dump(structured_schema_data,file, cls=EnhancedJSONEncoder)
                
            security_schemes = openapi_data.get("components",{}).get("securitySchemes",{})
            
            # create auth interceptors 
            
            # create_auth_interceptors( security_schemes= security_schemes, path=app_config['APP_SOURCE_DIR'] )
                
                
            security_schemes_models = self.handle_security_schema(security_schemes,openapi_data) #remaining
            # error_obj["auth_error"] = auth_data["auth_errors"]
            
            tags_map = self.classified_tags_and_method(openapi_data) 
            converted_json_tags_mapping = self.convert_to_json_data_model(tags_map,openapi_data, swagger_metadata_id,security_schemes_models)
            ## now load these json obj to api models
            for tag,arr_obj in converted_json_tags_mapping.items():
                for obj in arr_obj:
                    try:
                        api_model = api_model_loader.load_api_model(obj)
                        if tag in tag_models:
                            tag_models[tag].append(api_model)
                        else:
                            tag_models[tag] = [api_model] 
                    except Exception as e:
                        print(traceback.format_exc())
            
            return  {
                "id": swagger_metadata_id,
                "tag_models" : tag_models,
                "security_schemes_models" : security_schemes_models,
            }

        except Exception as e:
            print(traceback.format_exc())
           


    ##done
    ## it will return tags_mapping with path, operation, operation_data
    def classified_tags_and_method(self,open_api_json_data):
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
    
    def convert_to_json_data_model(self,tags_map,meta_data,module_id,security_schemes_models=[]):
        tag_mappings = {}
        for tag, tag_operations in tags_map.items():
            for path, operation, operation_data in tag_operations:
                try:
                    # from here we need to handle the single generation
                    # if operation_data.get("requestBody").get("content")
                    request_obj = self.create_request_json(
                        path=path,
                        path_data=operation_data,
                        operation=operation,
                        meta_data=meta_data,
                        security_schemes_models = security_schemes_models,
                        module_id=module_id
                    )
                    response_arr = self.create_response_arr_json(
                        path_data=operation_data,
                        meta_data=meta_data
                    )
                    # parameters = self.create_function_parameters_json(request_obj)
                    id = generate_uuid_as_key()
                    api_model_obj = {
                        "type": "FUNCTION",
                        "isAsync": True,
                        "parameters": [],
                        "id" : id,
                        "operation_id":operation_data.get("operationId","function_name"),
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

                except Exception as e:
                    # if tag in tag_mappings:
                    #     tag_mappings[tag].append({
                    #     "error" : True,
                    #     "message" : str(e),
                    #     "id": operation_data.get("operationId","default")
                    # }) 
                    #     # self.errors["path_errors"][f"{path}-{operation}"].append(str(e))
                    # else:
                    #     tag_mappings[tag]= [
                    #         {"error" : True,
                    #         "message" : str(e),
                    #         "id": operation_data.get("operationId","default")
                    # }]
                        # self.errors["path_errors"][f"{path}-{operation}"].append(str(e))
                    print(traceback.format_exc())
        return tag_mappings
    
    # def create_function_parameters_json(self, request_data):
    #     parameters = request_data.get('parameters')
    #     headers = request_data.get('headers')
    #     url = request_data.get('url')
        
        



    
   

                    
                
                