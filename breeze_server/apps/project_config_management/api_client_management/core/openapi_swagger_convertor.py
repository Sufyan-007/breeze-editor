import yaml,json,os,traceback,copy,hashlib
from ....common.constants.consts import CONFIG_PATH,CLIENT_API
from apps.common.utils.file_helpers.json_handler import read_json_file
from ....common.utils.uuid_as_key import generate_uuid_as_key
from ..utils.json_encoder import EnhancedJSONEncoder
from ..utils.content_type_and_mode import get_content_type_and_mode
from ..utils.set_response_status import set_response_status
from ..utils.append_dict_file import append_to_dict_file
from .api_model_loader import ApiModelLoader
from ..utils.api_models import MethodsEnum,AuthApiTypeEnum,AuthTypeEnum
from ..utils.schema_conversion import convert_type_to_config, generate_ids,object_converter
from ....common.utils.replace_variable import replace_variable
from ..utils.set_unresolved_key import set_unresolved_keys
def prepare_api_models(json_data, project_name,isJson):
        app_config_dir = f"{CONFIG_PATH}/{project_name}"
        try:
            if isJson:
                openapi_data = json.loads(json_data)
            else:
                openapi_data = yaml.safe_load(json_data)
        except:
            raise SyntaxError("File not valid json or yml")
        swagger_metadata_file_path = f"{app_config_dir}/{CLIENT_API}/swagger_metadata.json" 
        api_model_loader = ApiModelLoader()
        tag_models = {}
        security_schemes_models = []
        try:
            if not json_data:
                return 

            ##security schemes to store in the swagger metadata
            security_schemes = openapi_data.get("components",{}).get("securitySchemes",{})
            servers_info = openapi_data.get("servers")
            meta_data = openapi_data.get("info",{})
            meta_data["auth_apis"] = {}
            meta_data["security_schemes"] = security_schemes
            meta_data["servers_info"] = servers_info
            meta_data["interceptors"] = []
            with open(swagger_metadata_file_path, "r") as file:
                swagger_metadata_file_content = json.load(file)
            swagger_metadata_id = generate_uuid_as_key()
            
            for x in swagger_metadata_file_content.values():
                if (not meta_data.get('title')) or x.get("title") == meta_data.get("title"):
                    meta_data["title"] = meta_data.get("title")+"_1"
            swagger_metadata_file_content[swagger_metadata_id] = meta_data
            append_to_dict_file(swagger_metadata_file_path, swagger_metadata_file_content)
            
            swagger_schema_path = f"{CONFIG_PATH}/{project_name}/models/index.json";
            with open(swagger_schema_path, 'r') as file:
                schema_data = json.load(file)
            schema_data[swagger_metadata_id] = meta_data.get("title")
            append_to_dict_file(swagger_schema_path, schema_data)
            
            ########### schema extraction #############
            comps =  openapi_data.get("components")
            if comps:
                avalilable_schemas = comps.get("schemas", {})
            else:
                avalilable_schemas = {}
            structured_schema_data = {}
            for key, val in avalilable_schemas.items():
                if val.get("type") and val["type"]=="object":
                    structured_schema_data[key] = object_converter(val)
                    structured_schema_data[key]["schemaType"] = "modals"
                    
                else:
                    structured_schema_data[key] = convert_type_to_config(val)
                    structured_schema_data[key]["schemaType"] = "combined_schema"
                    
                
            schema_with_ids =  generate_ids(structured_schema_data)
            
            for key, val in schema_with_ids.items():
                replace_variable(schema_with_ids, f"#/components/schemas/{val['name']}",key)
            schema_file_path = f"{CONFIG_PATH}/{project_name}/models/{swagger_metadata_id}.json"
            
            set_unresolved_keys(schema_with_ids)
            
            with open(schema_file_path, "w") as file:
                json.dump(schema_with_ids,file, cls=EnhancedJSONEncoder)
            
            ###### auth related details ########
                
            security_schemes_models = handle_security_schema(security_schemes,openapi_data) 
            
            tags_map = classified_tags_and_method(openapi_data, schema_file_path) 
            converted_json_tags_mapping = convert_to_json_data_model(tags_map,openapi_data, swagger_metadata_id,schema_file_path,security_schemes_models)
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
                "title": meta_data.get("title", ''),
                "security_schemes": security_schemes
            }

        except Exception as e:
            print(traceback.format_exc())
            
            
def create_request_json(path, path_data, operation, meta_data,module_id,security_schemes_models=[],schema_file_path=None):
        method = operation.strip().upper()
        
        auth_data = _create_auth_arr_json(path_data, meta_data=meta_data,security_schemes_models=security_schemes_models)
        url_data = _create_url_json(path,meta_data)
        parameters = _create_parameters_json(path_data.get("parameters"))
        arr_body_data = _create_body_arr_json(path_data.get("requestBody", {}), meta_data= meta_data, module_id=module_id,schema_file_path = schema_file_path)
        request_obj = {
            "method":MethodsEnum[method].name, 
            "auth":auth_data, 
            "headers":[], 
            "parameters":parameters, 
            "url":url_data, 
            "body":arr_body_data
        }
        
        return request_obj
    
def _get_login_refresh_auth_id_from_models(auth_type,security_schemes_models):
        login_api = None
        token_api = None
        for model in security_schemes_models:
            if model.authentication_type == AuthTypeEnum[auth_type]:
                if model.auth_api_type == AuthApiTypeEnum.LOGIN:
                    login_api = model.id  
                if model.auth_api_type ==  AuthApiTypeEnum.REFRESH:
                    token_api = model.id
        
        return login_api,token_api
    

def _create_auth_arr_json( path_data, meta_data,security_schemes_models= []):
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
                if scheme_details.get("scheme"):
                    auth_type = scheme_details.get("scheme") 
                elif scheme_details.get("type"):
                    auth_type = scheme_details.get("type")
                auth_type = auth_type.strip().upper()
                if security_name.lower() == "bearerauth":
                    auth_type = "BEARER" 
                elif security_name.lower() == "basicauth":
                    auth_type = "BASIC"
                login_api,token_api = _get_login_refresh_auth_id_from_models(auth_type,security_schemes_models)
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
                    if scheme_details.get("scheme"):
                        auth_type = scheme_details.get("scheme") 
                    elif scheme_details.get("type"):
                        auth_type = scheme_details.get("type")
                    auth_type = auth_type.strip().upper()
                    # if security_item.lower() == "bearerauth":
                    #     auth_type = "BEARER" 
                    # elif security_item.lower() == "basicauth":
                    #     auth_type = "BASIC"
                
                    
                else:
                    for security_name, _ in security_item.items():
                        scheme_details = security_schemes.get(security_name, {})
                        if scheme_details.get("scheme"):
                            auth_type = scheme_details.get("scheme") 
                        elif scheme_details.get("type"):
                            auth_type = scheme_details.get("type")
                        auth_type = auth_type.strip().upper()
                        # if security_name.lower() == "bearerauth":
                        #     auth_type = "BEARER" 
                        # elif security_name.lower() == "basicauth":
                        #     auth_type = "BASIC"
                
                login_api,token_api = _get_login_refresh_auth_id_from_models(auth_type,security_schemes_models)
                arr_auth.append({
                    "type" : auth_type,
                    "content": [],
                    "login_api" : login_api,
                    "token_api" : token_api
                })
            
            
        return arr_auth
    
    
def _create_parameters_json( parameter_data):
        parameters = []
        if parameter_data and len(parameter_data) > 0:
            for param in parameter_data:
                parameters.append({
                    "param_in": param.get("in","").strip(),
                    "name":param.get("name"),
                    "type":param.get("schema",param).get("type").strip().upper(),
                    "required":param.get("required"),
                    "description":param.get("description")
                })
                
        return parameters
    
    
def _create_url_json(path, meta_data):
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
    
def _create_body_arr_json( body_data, meta_data,module_id,schema_file_path):
        with open(schema_file_path, "r") as file:
            all_schemas = json.load(file)
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
                 # Exit loop after the first iteration
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
                    body_schema = _create_schema(schema_name,schemas,None,all_schemas)
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
                                prop_schema = _create_schema(prop_name, schemas,None,all_schemas)
                            else:
                                prop_type = prop_data.get('type', '')
                                prop_schema = {'type': prop_type}
                                if 'example' in prop_data:
                                    prop_schema['example'] = prop_data['example']

                            if prop_data.get('type') == 'array' and 'items' in prop_data:
                                items_ref = prop_data['items'].get('$ref', '')
                                if items_ref:
                                    items_name = items_ref.split('/')[-1]
                                    items_schema = _create_schema(items_name, schemas,None,all_schemas)
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
    
    
def _create_schema( schema_name, components_schemas, seen=None,all_schemas=None):
    #here we need to add
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
                if prop_name in all_schemas:
                    prop_schema = all_schemas.get(prop_name)
                    prop_name = all_schemas.get(prop_name).get("name")
                else:
                    prop_schema = _create_schema(prop_name, components_schemas, seen=seen)
            else:
                prop_type = prop_data.get('type', '')
                prop_schema = {'type': prop_type}
                if 'example' in prop_data:
                    prop_schema['example'] = prop_data['example']

            if prop_data.get('type') == 'array' and 'items' in prop_data:
                items_ref = prop_data['items'].get('$ref', None)
                if items_ref:
                    items_name = items_ref.split('/')[-1]
                    items_schema = _create_schema(items_name, components_schemas, seen=seen)
                    prop_schema['items'] = items_schema
                else:
                    prop_schema['items'] = prop_data['items']

            schema['properties'][prop_name] = prop_schema

        return schema
    
    
def create_response_arr_json( path_data, meta_data,schema_file_path):
    with open(schema_file_path, 'r') as f:
        all_schemas = json.load(f)
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
        if content:
            for key, value in content.items():
                content_type,mode = get_content_type_and_mode(key)    
                schema = value.get("schema",{})
                if "$ref" in schema: 
                    schema_name = schema.get("$ref",None)
                    schema_name = schema_name.split('/')[-1]
                    for id,val in all_schemas.items():
                        if schema_name in val["name"]:
                            schema = val
                            schema_name = id
                            break
                            
                # else:
                #     is_anonymous = True
                #     if schema.get("type") == "object":
                #         schema = {
                #             'type': "object",
                #             'properties': {},
                #             'required': []
                #         }
                #     else:
                #         pass
                                
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
    

def generate_json_for_security_schema(schema_name,schema_data,meta_data):
        servers = meta_data.get("servers")
        if servers is None or len(servers) == 0:
            servers = [{"url": "your_server_url"}]
        auth_obj = {
            "tags" : "authApis",
            "body" : [],
            "request" : {"method" : "POST",
            "url": {
                "servers": servers,
                "baseurl": servers[0].get("url"),
                "host": [],
                "protocol": "HTTP",
                "port": None,
                "path": [],
                "url_env": None,
                "errors": None
                }},
            "response" : [],
            "token_store" : None,
            "authentication_type" : "BASIC",
            "token_store": None,
            "summary":"",
            "is_authentication_api" : False
        }
        security_scheme = None
        auth_api_objects = []
        if schema_data.get("scheme"):
            security_scheme = schema_data.get("scheme").lower()
        elif schema_data.get("type"):
            security_scheme = schema_data.get("type").lower()
            
        if security_scheme == "basic":
            auth_obj["id"] = generate_uuid_as_key()
            auth_obj["operation_id"] = schema_name + "_basic"
            auth_obj["authentication_type"] = "BASIC"
            auth_obj["auth_api_type"] = "LOGIN"

            auth_api_objects.append(auth_obj)

        elif security_scheme == "bearer":
            auth_obj = copy.deepcopy(auth_obj)
            auth_obj["id"] = generate_uuid_as_key()
            auth_obj["operation_id"] =schema_name+"_login"
            auth_obj["authentication_type"] = "BEARER"
            auth_obj["auth_api_type"] = "LOGIN"
            auth_api_objects.append(auth_obj)
            
        elif security_scheme == "apikey":
            auth_obj = copy.deepcopy(auth_obj)
            auth_obj["id"] = generate_uuid_as_key()
            auth_obj["operation_id"] =schema_name+"_login"
            auth_obj["authentication_type"] = "APIKEY"
            auth_obj["auth_api_type"] = "LOGIN"
            auth_api_objects.append(auth_obj) 

        return auth_api_objects
    
    
def handle_security_schema(security_schemas,meta_data):
        api_model_loader = ApiModelLoader()
        auth_api_objects = []
        auth_api_models = []
        for schema_name,schema in security_schemas.items():
            auth_api_objects = auth_api_objects + generate_json_for_security_schema(schema_name,schema,meta_data)
        for obj in auth_api_objects:
            try:
                auth_api_model= api_model_loader.load_auth_api_model(obj)
                auth_api_models.append(auth_api_model)
            except Exception as e:
                print(traceback.format_exc())
        return auth_api_models
    
    
def append_auth_json(auth_model, appName,moduleId):
        project_name = appName
        folder_path = f"{CONFIG_PATH}/{project_name}/{CLIENT_API}/swagger_metadata.json"
        json_data = {}
        with open(folder_path) as fp:
            json_data = json.load(fp)
            auth_api_data = json_data[moduleId].get("auth_apis", {})
            
            auth_api_data[auth_model.get("id")] = auth_model
            json_data[moduleId]["auth_apis"] = auth_api_data
            ## write all data back to file
            with open(folder_path, "w") as file:
                json.dump(json_data,file, cls=EnhancedJSONEncoder)
                
                
def classified_tags_and_method(open_api_json_data, file_path):
        paths = open_api_json_data.get('paths', {})
        tags_map = {
            "default" : []
        }
        all_schemas = []
        seen_schemas = set()
        def process_schema_data(content_data,tags,path,operation):
            extracted_schema = content_data.get("schema")
            schema = {}
            if extracted_schema.get("type") and extracted_schema["type"]== 'object':
                schema = object_converter(extracted_schema)
                schema["schemaType"] = "modals"
                
            elif "$ref" in extracted_schema:
                pass
                # schema_name = extracted_schema.get("$ref",None)
                # schema_name = schema_name.split('/')[-1]
                # for values in combined_schemas.values():
                #     if schema_name in values["name"]:
                #         #later we will replace the ids
                #         pass
            
            else:
                schema = convert_type_to_config(extracted_schema)
                schema["schemaType"] = "combined_schema"
            schema_str = json.dumps(schema, sort_keys=True)
            
            # Check if this schema has already been processed
            if schema_str != '{}' and schema_str not in seen_schemas:
                seen_schemas.add(schema_str)
                schema_name_parts = []
                
                if tags:
                    schema_name_parts.append(tags[0])  
                path_segments = path.strip('/').split('/')                
                last_valid_segment = None
                for segment in reversed(path_segments):
                    if not segment.startswith("{") and "?" not in segment: 
                        last_valid_segment = segment
                        break
                
                if last_valid_segment:
                    schema_name_parts.append(last_valid_segment.replace('-', '_'))  
                else:
                    schema_name_parts.append("unknown") 
                
                schema_name_parts.append(operation.lower())  
                
                schema_name_base = '_'.join(schema_name_parts)
                
                schema["name"] = f"schema_{schema_name_base}".lower()
                
                if any(existing_schema["name"] == schema["name"] for existing_schema in all_schemas):
                    schema["name"] = f"schema_{schema_name_base}_{hashlib.md5(schema_str.encode('utf-8')).hexdigest()[:6]}"
                
                schema["name"] = schema["name"]  
                
                all_schemas.append(schema)
                
        for path, path_data in paths.items():
            for operation in ["get", "post", "put", "patch", "delete", "head", "options", "trace"]:
                operation_data = path_data.get(operation)
                if not operation_data: 
                    continue
                tags = operation_data.get("tags", None)
                request_body = operation_data.get("requestBody")
                response = operation_data.get("responses")
                if request_body:
                    for _, content_data in request_body.get("content").items():
                        process_schema_data(content_data, tags, path, operation)
                            
                if response:
                    for res_data in response.values():
                        if res_data.get("content"):
                            for content_data in res_data.get("content").values():
                                process_schema_data(content_data,tags,path,operation)  
                                              
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
        schema_with_ids = generate_ids(all_schemas, True)
        set_unresolved_keys(schema_with_ids)
        append_to_dict_file(file_path,schema_with_ids)
        
        with open(file_path) as fp:
            combined_schemas = json.load(fp)
            
        for key, val in combined_schemas.items():
            replace_variable(combined_schemas, f"#/components/schemas/{val['name']}",key)
            
        append_to_dict_file(file_path,combined_schemas)
        return tags_map
    

def create_api_model_obj(operation_data, request_obj_new, tag, id, funcName,meta_data,schema_file_path):
    return {
        "type": "FUNCTION",
        "isAsync": True,
        "parameters": [],
        "id": id,
        "operation_id": funcName,
        "tags": tag,
        "request": request_obj_new,
        "response": create_response_arr_json(path_data=operation_data, meta_data=meta_data,schema_file_path=schema_file_path),
        "summary": operation_data.get("summary"),
        "is_authentication_api": False
    }


def convert_to_json_data_model(tags_map, meta_data, module_id,schema_file_path, security_schemes_models=[]):
    tag_mappings = {}

    for tag, tag_operations in tags_map.items():
        for path, operation, operation_data in tag_operations:
            try:
                request_obj = create_request_json(
                    path=path,
                    path_data=operation_data,
                    operation=operation,
                    meta_data=meta_data,
                    security_schemes_models=security_schemes_models,
                    module_id=module_id,
                    schema_file_path = schema_file_path
                )

                body_items = request_obj["body"]
                request_obj_new = {
                    "method": request_obj["method"],
                    "auth": request_obj["auth"],
                    "headers": request_obj["headers"],
                    "parameters": request_obj["parameters"],
                    "url": request_obj["url"],
                    "body": []  
                }

                # If there are body items, handle them separately
                if len(body_items)>0:
                    for i, body in enumerate(body_items):
                        request_obj_new["body"] = [body]  
                        id = generate_uuid_as_key()
                        funcName = operation_data.get("operationId", f"function_name{id[:4]}")
                        if len(body_items) > 1:
                            funcName += f"_{body['content_type']}"
                        
                        api_model_obj = create_api_model_obj(operation_data, request_obj_new, tag, id, funcName,meta_data,schema_file_path)

                        tag_mappings.setdefault(tag, []).append(api_model_obj)

                else:
                    # Handle case with no body items
                    id = generate_uuid_as_key()
                    funcName = operation_data.get("operationId", f"function_name{id[:4]}")
                    api_model_obj = create_api_model_obj(operation_data, request_obj_new, tag, id, funcName,meta_data,schema_file_path)

                    tag_mappings.setdefault(tag, []).append(api_model_obj)

            except Exception:
                print(traceback.format_exc())

    return tag_mappings

def wrap_conversion(converted_data, project_name, folder_path):
    security_schemes_models = converted_data.get("security_schemes_models")
    swagger_metadata_key = converted_data.get("id")
    swagger_metadata_config_path = f"{CONFIG_PATH}/{project_name}/{CLIENT_API}/swagger_metadata.json"

    with open(swagger_metadata_config_path, "r") as file:
        swagger_metadata_content = json.load(file)

    auth_model_dict = {}
    for model in security_schemes_models:
        auth_model_dict[model.id] = model.as_dict()

    swagger_metadata_content[swagger_metadata_key]["auth_apis"] = auth_model_dict
    append_to_dict_file(swagger_metadata_config_path, swagger_metadata_content)

    # For other models
    tag_models = converted_data.get("tag_models")
    files_with_apis = []
    api_models_folder_path = os.path.join(folder_path, swagger_metadata_key)
    api_models_index_file_path = os.path.join(folder_path, swagger_metadata_key, "index.json")

    if not os.path.exists(api_models_folder_path):
        os.makedirs(api_models_folder_path)

    if not os.path.exists(api_models_index_file_path):
        with open(api_models_index_file_path, "w") as file:
            json.dump({}, file)

    with open(api_models_index_file_path, "r") as file:
        index_content = json.load(file)

    for tag, api_models in tag_models.items():
        is_error_present = False
        function_with_errors = set()
        model_dict = {}
        unique_id = generate_uuid_as_key()
        filename = f"{unique_id}.json"
        full_file_path = os.path.join(api_models_folder_path, filename)
        
        ########## this also needs to be done after generation #########
        
        # directory_manager = DirectoryManager(project_name=project_name)
        # newNode = directory_manager.add_node_to_config(
        #     parent_id= swagger_metadata_key,
        #     tag= "SERVICES",
        #     name= tag,
        #     node_type="FILE",
        #     file_id= unique_id ,
        #     entity_id=unique_id,
        #     isProtected=False,
        #     ext="SX"
        # )
        for model in api_models:
            model_as_dict = model.as_dict()
            model_dict[model.id] = model_as_dict
            if len(model_as_dict["errors"]["root_errors"]) > 0:
                function_with_errors.add(model.operation_id)
                is_error_present = True

        function_with_errors_list = list(function_with_errors)
        files_with_apis.append({"filename": tag, "apis": model_dict, "errors": function_with_errors_list, "fileId": unique_id})
        append_to_dict_file(full_file_path, model_dict)
        index_content[unique_id] = {"file": tag}

    with open(api_models_index_file_path, "w") as file:
        json.dump(index_content, file)

    return files_with_apis, is_error_present, auth_model_dict

                    

    