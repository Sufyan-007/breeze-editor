import yaml,json,os,traceback,copy
from ....common.constants.consts import CONFIG_PATH,CONFIG_FILES_PATH,CLIENT_API
from apps.common.utils.file_helpers.json_handler import read_json_file
from ....common.utils.uuid_as_key import generate_uuid_as_key
from ..utils.json_encoder import EnhancedJSONEncoder
from ..utils.content_type_and_mode import get_content_type_and_mode
from ..utils.set_response_status import set_response_status
from ..utils.append_dict_file import append_to_dict_file
from .api_model_loader import ApiModelLoader
from ..utils.api_models import MethodsEnum,AuthApiTypeEnum,AuthTypeEnum
from ....directory_management.core.directory_management_service import DirectoryManager
def prepare_api_models(json_data, project_name):
        app_config_dir = f"{CONFIG_PATH}/{project_name}"
        app_config_path = f"{app_config_dir}/{CONFIG_FILES_PATH['APP_CONFIG']}"
        app_config = read_json_file(app_config_path)
        app_config['APP_SOURCE_DIR'] = f"{app_config['path']}/{app_config['name']}/{app_config['components_src_dir']}"

        swagger_metadata_file_path = f"{app_config_dir}/{CLIENT_API}/swagger_metadata.json" 
        api_model_loader = ApiModelLoader()
        tag_models = {}
        security_schemes_models = []
        try:
            if not json_data:
                return 

            openapi_data = yaml.safe_load(json_data)
            meta_data = openapi_data.get("info",{})
            meta_data["auth_apis"] = {}
            # if not os.path.exists(swagger_metadata_file_path):
            #     with open(swagger_metadata_file_path, "w") as file:
            #         json.dump({"custom": {"title": "custom"}}, file)
            with open(swagger_metadata_file_path, "r") as file:
                swagger_metadata_file_content = json.load(file)
            swagger_metadata_id = generate_uuid_as_key()
            
            directory_manager = DirectoryManager(project_name=project_name)
            newNode = directory_manager.add_node_to_config(
                parent_id= "SERVICES",
                tag= "SERVICES",
                name=meta_data.get("title", ""),
                node_type="DIRECTORY",
                file_id= swagger_metadata_id,
                entity_id=swagger_metadata_id,
                isProtected=False
            )
                
            swagger_metadata_file_content[swagger_metadata_id] = meta_data
            append_to_dict_file(swagger_metadata_file_path, swagger_metadata_file_content)
            # write_json_file(swagger_metadata_file_path, swagger_metadata_file_content)
            
            #write in the swagger_schema index file 
            swagger_schema_path = f"{CONFIG_PATH}/{project_name}/swagger_schema/index.json";
            with open(swagger_schema_path, 'r') as file:
                schema_data = json.load(file)
            schema_data[swagger_metadata_id] = meta_data.get("title")
            append_to_dict_file(swagger_schema_path, schema_data)
            
            
            avalilable_schemas = openapi_data.get("components").get("schemas", {})
            structured_schema_data = {}
            for key, val in avalilable_schemas.items():
                id = generate_uuid_as_key()
                val["name"]= key
                structured_schema_data[id] = val
                
            # custom_schemas_file_path = f"{CONFIG_PATH}/{project_name}/swagger_schema/custom_schemas.json"
            # if not os.path.exists(custom_schemas_file_path):
            #     with open(custom_schemas_file_path, "w+") as file:
            #         json.dump({}, file)
            schema_file_path = f"{CONFIG_PATH}/{project_name}/swagger_schema/{swagger_metadata_id}.json"
            
            if not os.path.exists(schema_file_path):
                with open(schema_file_path, "w+") as file:
                    json.dump({}, file)
            with open(schema_file_path, "w+") as file:
                json.dump(structured_schema_data,file, cls=EnhancedJSONEncoder)
                
            security_schemes = openapi_data.get("components",{}).get("securitySchemes",{})
                
            security_schemes_models = handle_security_schema(security_schemes,openapi_data) 
            
            tags_map = classified_tags_and_method(openapi_data) 
            converted_json_tags_mapping = convert_to_json_data_model(tags_map,openapi_data, swagger_metadata_id,security_schemes_models)
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
            
            
def create_request_json(path, path_data, operation, meta_data,module_id,security_schemes_models=[]):
        method = operation.strip().upper()
        
        auth_data = _create_auth_arr_json(path_data, meta_data=meta_data,security_schemes_models=security_schemes_models)
        url_data = _create_url_json(path,meta_data)
        parameters = _create_parameters_json(path_data.get("parameters"))
        arr_body_data = _create_body_arr_json(path_data.get("requestBody", {}), meta_data= meta_data, module_id=module_id)
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
                auth_type = scheme_details.get("type","")
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
                    "type":param.get("schema").get("type").strip().upper(),
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
    
def _create_body_arr_json( body_data, meta_data,module_id):
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
                    body_schema = _create_schema(schema_name,schemas)
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
                                prop_schema = _create_schema(prop_name, schemas)
                            else:
                                prop_type = prop_data.get('type', '')
                                prop_schema = {'type': prop_type}
                                if 'example' in prop_data:
                                    prop_schema['example'] = prop_data['example']

                            if prop_data.get('type') == 'array' and 'items' in prop_data:
                                items_ref = prop_data['items'].get('$ref', '')
                                if items_ref:
                                    items_name = items_ref.split('/')[-1]
                                    items_schema = _create_schema(items_name, schemas)
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
    
    
def _create_schema( schema_name, components_schemas, seen=None):
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
    
    
def create_response_arr_json( path_data, meta_data):
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
    

def generate_json_for_security_schema(schema_name,schema_data,meta_data):
        auth_obj = {
            "tags" : "auth",
            "body" : None,
            "request" : {"method" : "POST"},
            "response" : [],
            "token_store" : None,
            "authentication_type" : "BASIC",
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
            
        elif schema_name.lower() == "api_key":
            br_auth_login = copy.deepcopy(auth_obj)
            br_auth_login["id"] = generate_uuid_as_key()
            br_auth_login["operation_id"] =schema_name+"_login"
            br_auth_login["authentication_type"] = "APIKEY"
            br_auth_login["auth_api_type"] = "LOGIN"
            auth_api_objects.append(br_auth_login) 

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
    

def create_api_model_obj(operation_data, request_obj_new, tag, id, funcName,meta_data):
    return {
        "type": "FUNCTION",
        "isAsync": True,
        "parameters": [],
        "id": id,
        "operation_id": funcName,
        "tags": tag,
        "request": request_obj_new,
        "response": create_response_arr_json(path_data=operation_data, meta_data=meta_data),
        "summary": operation_data.get("summary"),
        "is_authentication_api": False
    }


def convert_to_json_data_model(tags_map, meta_data, module_id, security_schemes_models=[]):
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
                    module_id=module_id
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
                        funcName += f"_{body['content_type']}"
                        
                        api_model_obj = create_api_model_obj(operation_data, request_obj_new, tag, id, funcName,meta_data)

                        tag_mappings.setdefault(tag, []).append(api_model_obj)

                else:
                    # Handle case with no body items
                    id = generate_uuid_as_key()
                    funcName = operation_data.get("operationId", f"function_name{id[:4]}")
                    api_model_obj = create_api_model_obj(operation_data, request_obj_new, tag, id, funcName,meta_data)

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
        function_with_errors = set()
        model_dict = {}
        unique_id = generate_uuid_as_key()
        filename = f"{unique_id}.json"
        full_file_path = os.path.join(api_models_folder_path, filename)
        directory_manager = DirectoryManager(project_name=project_name)
        newNode = directory_manager.add_node_to_config(
            parent_id= swagger_metadata_key,
            tag= "SERVICES",
            name= tag,
            node_type="FILE",
            file_id= unique_id ,
            entity_id=unique_id,
            isProtected=False,
            ext="SX"
        )
        for model in api_models:
            model_as_dict = model.as_dict()
            model_dict[model.id] = model_as_dict
            if len(model_as_dict["errors"]["root_errors"]) > 0:
                function_with_errors.add(model.operation_id)

        function_with_errors_list = list(function_with_errors)
        files_with_apis.append({"filename": tag, "apis": model_dict, "errors": function_with_errors_list})
        append_to_dict_file(full_file_path, model_dict)
        index_content[unique_id] = {"file": tag}

    with open(api_models_index_file_path, "w") as file:
        json.dump(index_content, file)

    return files_with_apis
