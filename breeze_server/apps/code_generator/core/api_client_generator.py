import copy,json
from ...common.constants.consts import CONFIG_PATH,CONFIG_FILES_PATH,CLIENT_API
from ...common.utils.file_helpers.json_handler import read_json_file,read_project_config_file
from ...project_config_management.api_client_management.core.api_model_loader import ApiModelLoader
from ...project_config_management.api_client_management.utils.api_models import TokenStoreTypeEnum,AuthApiTypeEnum,ContentEnum,ModeEnum,AuthTypeEnum,ParamsInEnum,StatusEnum
from ...project_config_management.api_client_management.utils.append_dict_file import append_to_dict_file
from ...common.utils.file_helpers.config_handler import get_breeze_config_file
from ...common.utils.file_helpers.json_handler import write_json_file
from ...directory_management.core.directory_management_service import DirectoryManager
from ...project_config_management.api_client_management.consts import WEBSOCKET_HOOK,RESPONSE_INTERCEPTOR,RESPONSE_STATUS_CONDITION,REQUEST_INTERCEPTOR,REFRESH_TOKEN_API,AUTH_INTERCEPTOR,MODULE_INTERCEPTOR_CODE
from ...common.utils.variable_name_convertor import convert_to_valid_variable_name
from ...project_management.core.environment_management import get_env_config
from ...common.utils.uuid_as_key import generate_uuid_as_key
from ...project_config_management.api_client_management.utils.create_token_store import create_token_store
def __init__( app_name):
    app_config_dir = f"{CONFIG_PATH}/{app_name}"
    app_config = read_project_config_file(
        app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
    app_config['APP_CONFIG_PATH'] = f"{CONFIG_PATH}/{app_name}"
    app_config['APP_SOURCE_DIR'] = f"{app_config['path']}/{app_config['name']}/{app_config['componentsSrcDir']}"
    return app_config_dir,app_config

def generate_react_service( app_name, filename, service_type, module_id,security_schemes, module_name=''):
    _, app_config = __init__(app_name)
    map_services = {}
    if service_type == "WS":
        service_path = f"{CONFIG_PATH}/{app_name}/{CLIENT_API}/{module_id}/{filename}.json"
        service_config = read_json_file(service_path)
        for key,config in service_config.items():
            model = ApiModelLoader.load_ws_model(config)
            create_websocket_hook_file(model.tags,app_config)
            
    elif service_type == "AUTH":
        auth_service_path = f"{CONFIG_PATH}/{app_name}/{CLIENT_API}/swagger_metadata"
        auth_service_content = read_json_file(auth_service_path)
        interceptor_file_id = auth_service_content.get(module_id).get("interceptor_file_id")
        auth_apis = auth_service_content.get(module_id).get("auth_apis",{})
        interceptors_code = MODULE_INTERCEPTOR_CODE
        auth_interceptor_code = ''
        interceptors = []
        for key,config in auth_apis.items():
            model = ApiModelLoader.load_auth_api_model(config)
            auth_interceptor_code,interceptor_id = generate_interceptors_code(auth_service_content.get(module_id).get("interceptors",[]), model, security_schemes,auth_service_path,module_id)
            if interceptor_id != '':
                model.interceptor_id = interceptor_id
            react_functions,used_interceptor = generate_service_function(model, False, app_name,service_type, service_path= auth_service_path,module_id=module_id,security_scheme= {})
            if used_interceptor != '':
                interceptors.append(used_interceptor)
            map_services = _manage_service_tags(model.tags, react_functions, map_services)
        interceptors_code = interceptors_code.replace('{AUTH_INTERCEPTORS_CODE}',auth_interceptor_code)
        interceptors_code = interceptors_code.replace('{AUTH_ERROR_INTERCEPTORS_CODE}', '')
        directory_manager = DirectoryManager(project_name=app_name)
        directory_manager.save_file(interceptor_file_id,interceptors_code)
        create_service_files(map_services,app_name,fileId=filename,module_id=module_id, module_name=module_name,used_interceptors=interceptors)
    else:
        service_path = f"{CONFIG_PATH}/{app_name}/{CLIENT_API}/{module_id}/{filename}"
        service_config = read_json_file(service_path)
        interceptors = []
        for key,config in service_config.items():
            model = ApiModelLoader.load_api_model(config)
            react_functions,used_interceptor = generate_service_function(model, False, app_name,service_type, service_path= service_path,module_id=module_id,security_scheme=security_schemes)
            if used_interceptor != '':
                interceptors.append(used_interceptor)
            map_services = _manage_service_tags(model.tags, react_functions, map_services)
        
        create_service_files(map_services,app_name,fileId=filename, module_id=module_id, module_name=module_name,used_interceptors=interceptors)
        
def create_websocket_hook_file( filename, app_config):
    # preprare new service file for each tag
    folder_name = "hooks"
    filename = filename.title()
    filename = filename+"Service.js"
    content = WEBSOCKET_HOOK
    path = f"{app_config['APP_SOURCE_DIR']}/{folder_name}/{filename}"
    write_json_file(path, content, "w+")
    print("services generated.............")
    
    
def generate_service_function( model, anonymous, app_name,service_type, service_path,module_id,security_scheme):
    func_name = model.operation_id
    interceptor_code = ""
    response_interceptor_code = RESPONSE_INTERCEPTOR
    used_interceptor = ""
    if service_type != "AUTH" and model.request.auth and len(model.request.auth) > 0 and model.request.auth[0].type != AuthTypeEnum.NOAUTH:
        ## currently only support for single auth
        ## need to handle all array of auth
        auth = model.request.auth[0]
        key_name = ''
        auth_dict = auth.as_dict()
        if auth_dict.get("type") == 'APIKEY':
            for k,v in security_scheme.items():
                if v.get("type") == 'apiKey':
                    key_name = v.get("name")
        interceptor_code, used_interceptor = generate_api_interceptor(auth, app_name,module_id, key_name=key_name)

        # if auth and auth.token_api != "" and auth.token_api is not None:
        #     r_interceptor_code = self.set_response_interceptor(auth, app_name)
        #     response_interceptor_code = response_interceptor_code.replace('{REFRESH_TOKEN_CONDITION}',r_interceptor_code)
        # else:
        #     response_interceptor_code = response_interceptor_code.replace('{REFRESH_TOKEN_CONDITION}',"")
    react_code = ""
    response_interceptor_code = response_interceptor_code.replace('{REFRESH_TOKEN_CONDITION}',"")
    if anonymous is True:
        react_code = """
            {AXIOS_OBJECT_DECLARATION}
            {INTERCEPTOR_CODE}
            {RESPONSE_INTERCEPTOR_CODE}
            return api({URL})
            
        """ 

    else:
        react_code = """
            export const {FUNC_NAME} = async ({FUNC_ARGS}) => {
                const localInstance = duplicateInstance(moduleInstance);
                {AXIOS_OBJECT_DECLARATION}
                {INTERCEPTOR_CODE}
                {RESPONSE_INTERCEPTOR_CODE}
                let resp = await localInstance.request(api)
                {RESPONSE_CODE}
                return resp.data
            };
            """ 

    axis_object_declation = """
        const api = {
            {METHOD},
            url : {URL},
            {HEADERS},
            {BODY}
        };
    """
    # set request url
    url_obj = set_request_url(model,app_name)
    function_args = url_obj.get("function_args",[])
    
    #write the parameters to the config file
    path_params = url_obj.get("path_params")
    query_params = url_obj.get("query_params")
    
    
    ## set api method
    axis_object_declation = axis_object_declation.replace('{METHOD}',"method : '"+model.request.method.value+"'")
    axis_object_declation = axis_object_declation.replace('{URL}',url_obj.get("axios_url"))
    
    # set request headers
    combined_headers = set_request_headers(model,app_name)
    param_headers = combined_headers["param_headers"] if combined_headers else []
    if combined_headers.get("header_argument"):
        function_args.append(combined_headers.get("header_argument"))
    
    
    headers = combined_headers["body_headers"] if combined_headers else {}
    # set request body if given
    body_items = set_request_body(model,app_name,module_id)
    #needs to be changed when body will be a dictionary instead of list
    body_params = {"type": "OBJECT", "name": "BodyDetails", "properties": {}}
    if body_items:
        if body_items.get("RAW"):
            body_params = body_items["RAW"]["body_params"] 
        elif body_items.get("BINARY"):
            body_params = body_items["BINARY"]["body_params"] 
        if body_params:
            body_params["name"] = "BodyDetails";
    #writing all the required parameters into the config
    ######################################################################################################
    model_parameters = []
    model_parameters.append({"type": "OBJECT", "name": "PathParameters", "properties": path_params})
    model_parameters.append({"type": "OBJECT", "name": "QueryParameters", "properties": query_params})
    model_parameters.append(body_params)
    model_parameters.append({"type": "OBJECT", "name": "HeaderDetails", "properties": param_headers})
    new_model = model.as_dict()
    new_model["parameters"] = model_parameters
    new_model["operation_id"] = convert_to_valid_variable_name(func_name)
    model_to_write = {new_model["id"]: new_model}
    # model_to_write["operation_id"] = func_name
    if service_type == "AUTH":
        service_path_with_ext = service_path + '.json'
        with open(service_path_with_ext, "r")as file:
            swagger_content = json.load(file)
            swagger_content[module_id]["auth_apis"][new_model["id"]] = new_model
            append_to_dict_file(service_path_with_ext, swagger_content)
    else:
        service_path += '.json' #will not be needed when using common functions
        append_to_dict_file(service_path, model_to_write)
    #######################################################################################################
    
    react_service_functions = []
    common_data = {
        "headers" : copy.deepcopy(headers),
        "axis_object_declation" : copy.deepcopy(axis_object_declation),
        "react_code" : react_code,
        "function_args" : function_args
    }
    if len(new_model["request"]["body"]) > 0:
        for mode,body in body_items.items():
            variable_declaration = body.get("variable_declaration","")
            react_code = copy.deepcopy(common_data.get("react_code"))
            if len(variable_declaration) > 0:
                ## declare any formdata or file variable befor passing it to axios
                axis_object_declation = copy.deepcopy(common_data.get("axis_object_declation"))
                axis_object_declation = variable_declaration + axis_object_declation

            request_body = body.get("raw_data",None)
            extra_headers = body.get("headers",[])
            extra_params = body.get("params",[])
            
            ## merge headers
            headers = copy.deepcopy(common_data.get("headers"))
            for head in extra_headers:
                headers[head.get("key")] = head.get("value")
            
            function_args = copy.deepcopy(common_data.get("function_args"))
            # print("function_args",function_args)
            if extra_params:
                ## merge params
                function_args = function_args + extra_params
            print("function_args", function_args)
            if request_body is not None:
                axis_object_declation = axis_object_declation.replace('{BODY}',"data : %s"%(request_body))
            else:
                axis_object_declation = axis_object_declation.replace('{BODY}','')


            if bool(headers) is True:
                variable_headers = []
                for key,value in headers.items():
                    if type(value) is str:
                        variable_headers.append(f"'{key}': '{str(value)}'")
                    elif value["type"] in ["LOCAL_STORAGE", "SESSION_STORAGE", "USER_INPUT"]:
                        variable_headers.append(f"{key}: {value['value']}")
                    else:
                        variable_headers.append(f"'{key}': '{value['value']}'") 
                headers_items = ', '.join(variable_headers)
                headers =  ' headers : {%s}'%(headers_items)
                
                axis_object_declation = axis_object_declation.replace('{HEADERS}',headers)
            else:
                axis_object_declation = axis_object_declation.replace('{HEADERS},',"")

            ## set function args comma seperated
            function_args = ",".join(function_args)
            
            ## set response conditions if provided
            r_status_conditions = []
            for res in model.response:
                if res.status != StatusEnum.S_200 and res.status != StatusEnum.S_201:
                    r_status = RESPONSE_STATUS_CONDITION%(res.status.value,res.description)
                    r_status_conditions.append(r_status)
            if len(r_status_conditions)> 0:
                # response_interceptor_code = response_interceptor_code.replace("{RESPONSE_STATUS_CONDITION}","\n".join(r_status_conditions))
                response_interceptor_code = response_interceptor_code.replace("{RESPONSE_STATUS_CONDITION}", "")
            else:
                response_interceptor_code = response_interceptor_code.replace("{RESPONSE_STATUS_CONDITION}","")

            react_code = react_code.replace('{URL}',url_obj.get("axios_url"))
            react_code = react_code.replace('{FUNC_ARGS}',function_args)
            react_code = react_code.replace('{AXIOS_OBJECT_DECLARATION}', axis_object_declation)
            react_code = react_code.replace('{INTERCEPTOR_CODE}', interceptor_code)
            # react_code = react_code.replace(
            #     '{RESPONSE_INTERCEPTOR_CODE}', response_interceptor_code)
            react_code = react_code.replace(
                '{RESPONSE_INTERCEPTOR_CODE}', '')
            
            ## handle api response code
            if service_type == "AUTH":
                auth_api_type = model.auth_api_type
                code = ""
                if auth_api_type == AuthApiTypeEnum.LOGIN or auth_api_type == AuthApiTypeEnum.REFRESH:
                    model_obj = model.as_dict()
                    for res in model_obj.get("response", []):
                        if res.get("status") == "S_200":
                            token_store_info = res.get("token_store")
                            if token_store_info:
                                for key,value in token_store_info.items():
                                    store_in = value.get("store_in")
                                    storage_key = value.get("storage_key")
                                    if store_in == TokenStoreTypeEnum.LOCAL_STORAGE:
                                        code += "localStorage.setItem('%s',`${resp.data.%s}`);"%(storage_key, key)
                                    elif store_in == TokenStoreTypeEnum.SESSION:
                                        code += "sessionStorage.setItem('%s',`${resp.data.%s}`);"%(storage_key, key)

                                
                react_code = react_code.replace('{RESPONSE_CODE}',code)
            else:
                react_code = react_code.replace('{RESPONSE_CODE}',"")

            # react_code = react_code.replace('{FUNC_NAME}',func_name+"_"+mode.lower())
            react_code = react_code.replace('{FUNC_NAME}',convert_to_valid_variable_name(func_name))
            react_service_functions.append(react_code)
    
    else:
        react_code = copy.deepcopy(common_data.get("react_code"))
        
        ## merge headers
        headers = copy.deepcopy(common_data.get("headers"))
        
        function_args = copy.deepcopy(common_data.get("function_args"))
        # print("function_args",function_args)
        
        print("function_args", function_args)
        axis_object_declation = axis_object_declation.replace('{BODY}','')
        if bool(headers) is True:
            variable_headers = []
            for key,value in headers.items():
                if type(value) is str:
                    variable_headers.append(f"'{key}': '{str(value)}'")
                elif value["type"] in ["LOCAL_STORAGE", "SESSION_STORAGE", "USER_INPUT"]:
                    variable_headers.append(f"{key}: {value['value']}")
                else:
                    variable_headers.append(f"'{key}': '{value['value']}'") 
            headers_items = ', '.join(variable_headers)
            headers =  ' headers : {%s}'%(headers_items)
            
            axis_object_declation = axis_object_declation.replace('{HEADERS}',headers)
        else:
            axis_object_declation = axis_object_declation.replace('{HEADERS},',"")

        ## set function args comma seperated
        function_args = ",".join(function_args)
        
        ## set response conditions if provided
        r_status_conditions = []
        for res in model.response:
            if res.status != StatusEnum.S_200 and res.status != StatusEnum.S_201:
                r_status = RESPONSE_STATUS_CONDITION%(res.status.value,res.description)
                r_status_conditions.append(r_status)
        if len(r_status_conditions)> 0:
            # response_interceptor_code = response_interceptor_code.replace("{RESPONSE_STATUS_CONDITION}","\n".join(r_status_conditions))
            response_interceptor_code = response_interceptor_code.replace("{RESPONSE_STATUS_CONDITION}","")
        else:
            response_interceptor_code = response_interceptor_code.replace("{RESPONSE_STATUS_CONDITION}","")

        react_code = react_code.replace('{URL}',url_obj.get("axios_url"))
        react_code = react_code.replace('{FUNC_ARGS}',function_args)
        react_code = react_code.replace('{AXIOS_OBJECT_DECLARATION}', axis_object_declation)
        react_code = react_code.replace('{INTERCEPTOR_CODE}', interceptor_code)
        # react_code = react_code.replace(
        #     '{RESPONSE_INTERCEPTOR_CODE}', response_interceptor_code)
        react_code = react_code.replace(
            '{RESPONSE_INTERCEPTOR_CODE}', '')
        ## handle api response code
        if service_type == "AUTH":
            auth_api_type = model.auth_api_type
            code = ""
            if auth_api_type == AuthApiTypeEnum.LOGIN or auth_api_type == AuthApiTypeEnum.REFRESH:
                model_obj = model.as_dict()
                for res in model_obj.get("response", []):
                    if res.get("status") == "S_200":
                        token_store_info = res.get("token_store")
                        if token_store_info:
                            for key,value in token_store_info.items():
                                store_in = value.get("store_in")
                                storage_key = value.get("storage_key")
                                if store_in == TokenStoreTypeEnum.LOCAL_STORAGE:
                                    code += "localStorage.setItem('%s',`${resp.data.%s}`);"%(storage_key, key)
                                elif store_in == TokenStoreTypeEnum.SESSION:
                                    code += "sessionStorage.setItem('%s',`${resp.data.%s}`);"%(storage_key, key)

                            
            react_code = react_code.replace('{RESPONSE_CODE}',code)
        else:
            react_code = react_code.replace('{RESPONSE_CODE}',"")

        # react_code = react_code.replace('{FUNC_NAME}',func_name+"_"+mode.lower())
        react_code = react_code.replace('{FUNC_NAME}',convert_to_valid_variable_name(func_name))
        react_service_functions.append(react_code)
    return react_service_functions,used_interceptor
        
def _manage_service_tags( tags, react_functions, map_services):
    # prepare dict obj for each tag
    # each react functions will be bind to a tag/service class
    if tags is None or len(tags) == 0:
        if "default" in map_services:
            map_services["default"]+=react_functions
        else:
            map_services["default"] = react_functions
        return map_services
    else:
        if tags in map_services:
            map_services[tags] += react_functions
        else:
            map_services[tags] = react_functions
    return map_services

def create_service_files( map_services,project_name,fileId,module_id, module_name, used_interceptors):
    content = "import axios from 'axios'\n"
    content += "import { duplicateInstance } from '../interceptors';"
    content += "import { moduleInstance } from './interceptors';"
    imported_interceptors = set() 
    if len(used_interceptors) > 0:
        interceptors_to_import = []
        
        for interceptor in used_interceptors:
            if interceptor not in imported_interceptors:
                interceptors_to_import.append(interceptor)
                imported_interceptors.add(interceptor)  
        
        if interceptors_to_import:
            interceptors_str = ', '.join(interceptors_to_import)
            content += f"import {{ {interceptors_str} }} from './interceptors';\n"

    directory_manager = DirectoryManager(project_name=project_name)
    for tag, func_arr in map_services.items():
        try:
            directory_manager.add_node_to_config(
                parent_id= module_id,
                tag= "SERVICES",
                name= tag,
                node_type="FILE",
                file_id= fileId ,
                entity_id=fileId,
                isProtected=False,
                ext="SX"
            )
        except Exception as e:
            if type(e) is not KeyError:
                raise e
        
        for func in func_arr:
            content += "\n"
            content += func
        directory_manager.save_file(file_id=fileId,content=content)
    print("services generated.............")







def retrive_token_code(auth_api_id,auth_token_id,app_name, module_id ):
    service_path = f"{CONFIG_PATH}/{app_name}/{CLIENT_API}/swagger_metadata"
    swagger_metadata = read_json_file(service_path)
    service_config = swagger_metadata.get(module_id).get("auth_apis")
    auth_config = service_config.get(auth_api_id,None)
    code = ""
    if auth_config is not None and auth_token_id:
        auth_config = ApiModelLoader.load_auth_api_model(auth_config)
        auth_config_obj = auth_config.as_dict()
        token_store_info = {}
        for resp in auth_config_obj.get("response"):
            if resp.get("status") == 'S_200':
                token_store_info = resp.get("token_store")
                token_config = token_store_info[auth_token_id]
                
                if token_config["store_in"] == TokenStoreTypeEnum.LOCAL_STORAGE:
                    code = "localStorage.getItem('%s')"%(token_config["storage_key"])
                elif token_config["store_in"] == TokenStoreTypeEnum.SESSION:
                    code = "sessionStorage.getItem('%s')"%(token_config["storage_key"])

                elif token_config["store_in"] == TokenStoreTypeEnum.COOKIES:
                    code = "localStorage.getItem('%s')"%(token_config["storage_key"])
        # token_store_info = auth_config.token_store
        # store_in = token_store_info.store_in
        # access_token_key = token_store_info.access_token_key
        # refresh_token_key = token_store_info.refresh_token_key
        
        return code
    else:
        return ""
        

def generate_api_interceptor( auth, app_name,module_id, key_name = ''):
    swagger_file_path = f"{CONFIG_PATH}/{app_name}/{CLIENT_API}/swagger_metadata.json"
    with open(swagger_file_path) as f:
        swagger_metadata = json.load(f)
    service_config = swagger_metadata.get(module_id).get("auth_apis")
    auth_config = service_config.get(auth.login_api,None)
    function_name = ""
    interceptor_code = REQUEST_INTERCEPTOR
    
    if auth_config is not None:
        function_name = "authInterceptor_" + auth_config.get("operation_id")
        function_name = convert_to_valid_variable_name(function_name)
    interceptor_code = interceptor_code.replace('{USED_INTERCEPTORS}', function_name)
    
    type = auth.type
    auth_code = ""
    key_name = key_name
    token = retrive_token_code(auth.login_api, auth.token_id, app_name,module_id)
    if token == '':
        token = "''"
    interceptor_code = interceptor_code.replace("{FETCH_TOKEN}",token)
    if type == AuthTypeEnum.BASIC:
        auth_code = "request.headers.Authorization = `Basic ${token}`;"

    elif type == AuthTypeEnum.OAUTH2:
        auth_in_header = True
        header_prefix = ""
        for content in auth.content:
            if content.key == "addTokenTo":
                if content.value == "queryParams":
                    auth_in_header = False
            elif content.key == "headerPrefix":
                header_prefix = content.value

            if auth_in_header and len(header_prefix) > 0:
                auth_code = "request.headers.Authorization = `%s ${token}`;" % (
                    header_prefix)
            else:
                auth_code = "request.headers.Authorization = token;"

    elif type == AuthTypeEnum.BEARER:
        auth_code = "request.headers.Authorization = `Bearer ${token}`;"
    elif type == AuthTypeEnum.APIKEY:
        auth_code = f"request.headers.{key_name} = token;"
    else:
        raise NotImplementedError("Unknown type ",type)

    interceptor_code = interceptor_code.replace('{AUTH_CODE}', auth_code)
    return interceptor_code, function_name

## needs to think for refresh token api response
def set_response_interceptor( auth, app_name):
    interceptor_code = REFRESH_TOKEN_API
    auth_api_path = f"{CONFIG_PATH}/{app_name}/{CLIENT_API}/auth"
    auth_api_config = read_json_file(auth_api_path)
    token_api_config = auth_api_config.get(auth.token_api)
    token_api_code = ""
    token_api_model = ApiModelLoader.load_auth_api_model(token_api_config)
    ## needs to think for refresh token api response
    # token_api_code = self.generate_service_function(token_api_model, False, app_name,"AUTH")
    # if len(token_api_code) > 0:
    #     token_api_code = token_api_code[0]
    # else:
    #     token_api_code = ""
    interceptor_code = interceptor_code.replace('{REFRESH_TOKEN_URL}', token_api_model.request.url.baseurl)
    interceptor_code = interceptor_code.replace('{GET_REFRESHED_TOKEN_CODE}', token_api_code)
    return interceptor_code

def set_request_headers( model, app_name):
    headers = {"param_headers": [], "body_headers": {}, "header_argument": ''}
    if model.request.headers:
        headers["header_argument"] = "HeaderDetails"
        for header in model.request.headers:
            if header.type == "USER_INPUT":
                headers["param_headers"].append({"name": header.key, "type": "STRING"})
                headers["body_headers"][header.key] = {"type": header.type, "value":f"HeaderDetails.{header.key}"}
            elif header.type == "STATIC":
                headers["body_headers"][header.key] = {"type": header.type, "value":header.value}
            elif header.type == "LOCAL_STORAGE":
                headers["body_headers"][header.key] = {"type": header.type, "value":f"localStorage.getItem('{header.storage_key}')"}
            elif header.type == "SESSION_STORAGE":
                headers["body_headers"][header.key] = {"type": header.type, "value":f"sessionStorage.getItem('{header.storage_key}')"}
        return headers
    else:
        return {}

## only for schema object .
## for type array is remaining
def generate_request_body_schema(parent_key,schema_name,schema,module_id,app_name):
    schema_file_path = f"{CONFIG_PATH}/{app_name}/models/{module_id}.json"
    with open(schema_file_path, 'r') as f:
        all_schemas = json.load(f)
    body = {}
    if "type" in schema:
        if schema.get("type") == "object":
            if parent_key is not None:
                schema_name = parent_key+"."+schema_name
            for key,value in schema.get("properties",{}).items():
                if "type" in value and value.get("type") == "object":
                    s = '`${%s["%s"]}`' % (schema_name, key)
                    body[key] = s.replace("'","")
                else:
                    s = '`${%s["%s"]}`' % (schema_name, key)
                    body[key] = s.replace("'","")
        else:
            body[parent_key] = parent_key
    else:
        pass  
    body_str = ""
    pairs = []
    for key,value in body.items():
        pairs.append("'%s' : %s"%(key,value))
    body_str = ','.join(pairs)
    body_str = "{" + body_str + "}"
    return body_str


def set_request_body(model,app_name,module_id):
    body_params =[]
    
    if model.request.body is None:
        return {
            "code" : "",
            "raw_data" : None,
            "headers" : [],
            "params" : []
        }
    
    raw_data = None
    variable_declaration_arr = {}
    headers = []
    params = []
    for body in model.request.body:
        variable_declaration = ""
        params = []
        headers = []
        raw_data = None
        mode = body.mode
        if mode == ModeEnum.FILE:
            params.append("file")
            variable_declaration = "let fileData = Buffer.from(await file.arrayBuffer())"
            raw_data = "fileData"     
                    

        elif mode == ModeEnum.RAW:
            content_type = body.content_type
            if content_type == ContentEnum.JSON:
                headers.append({"key" : "content-type","value" : ContentEnum.JSON.value})
                if body.schema_name is None:
                    # params.append(model.operation_id)
                    params.append("BodyDetails")
                    # value = model.operation_id
                    value = "BodyDetails"
                    schema = body.schema
                    body_params = schema
                    raw_data = value
                    model_data = {}
                    model_data = generate_request_body_schema(None,value,schema,module_id,app_name)  
                    variable_declaration = "let reqBody = %s"%(model_data)
                    raw_data = "reqBody";

                else:
                
                    # schema_name = body.schema_name
                    schema_name = "BodyDetails"
                    # params.append(schema_name)
                    params.append("BodyDetails")
                    schema = body.schema
                    body_params = schema
                    ## generate request body schema
                    model_data = {}
                    model_data = generate_request_body_schema(None,schema_name,schema,module_id,app_name)  
                    variable_declaration = "let reqBody = %s"%(model_data)
                    raw_data = "reqBody";


            elif content_type == ContentEnum.TEXT:
                headers.append({"key" : "content-type","value" : ContentEnum.TEXT.value})
                params.append("text_body")
                raw_data = "text_body"

        elif mode == ModeEnum.FORMDATA:                
            headers.append({"key" : "content-type","value" : ContentEnum.FORMDATA.value})
            variable_declaration = "let bodyFormData = new FormData();"
            form_data = body.schema
            body_params = form_data
            params.append("BodyDetails")
            #replace nested schema id with its name
            schemas_path = f"{CONFIG_PATH}/{app_name}/models/{module_id}.json"
            with open(schemas_path, 'r') as file:
                schemas = json.load(file)
            
            for key,item in form_data.get("properties",{}).items():
                if key in schemas.keys():
                    variable_declaration = "\n" + variable_declaration +"bodyFormData.append('%s', `${BodyDetails['%s']}`);"%(schemas[key]["name"], schemas[key]["name"])
                    
                elif item.get("type") == "text":
                    variable_declaration = "\n" + variable_declaration +"bodyFormData.append('%s', `${BodyDetails['%s']}`);"%(key, key)
                    
                else:
                    variable_declaration = "\n" + variable_declaration+"bodyFormData.append('%s', `${BodyDetails['%s']}`);"%(key,key)
            raw_data = "bodyFormData"
        
        elif mode == ModeEnum.URLENCODED:
            headers.append({"key" : "content-type","value" : ContentEnum.URLENCODED.value})
            variable_declaration = "let formBody = [];"
            form_data = body.schema
            body_params = form_data
            params.append("BodyDetails")
            for key,item in form_data.get("properties",{}).items():
                variable_declaration = "\n" + variable_declaration+"formBody.push(`${encodeURIComponent('%s')} = ${encodeURIComponent(BodyDetails['%s'])}`);"%(key,key)
            raw_data = "formBody"
            variable_declaration = "\n" + variable_declaration+'formBody = formBody.join("&");'

        variable_declaration_arr[mode.name]= {
                "headers" : headers,
                "variable_declaration" : variable_declaration,
                "raw_data" : raw_data,
                "params" : params,
                "body_params": body_params
        }
    return variable_declaration_arr

def set_request_url(model,app_name):
    app_basic_config = get_breeze_config_file(app_name)
    build_tool = app_basic_config["buildTool"]
    function_args = []
    query_params = []
    path_params = []
    query = ""
    path = ""
    
    url_obj =  model.request.url
    baseurl = url_obj.baseurl
    path = "/".join(url_obj.path)
    url = ""
    
    ## check if user has provided enviornment for baseURL
    url_env = url_obj.url_env
    if url_env is None or url_env == "":
        url = baseurl+path
    else:
        url = url_env+path
        config = get_env_config(project_id=app_name)
        if build_tool == 'Vite':
            # url = "${import.meta.env.%s}" % config.get("envVars").get(url_env) + '/' + path
            url = "${import.meta.env.%s}" % config.get("envVars").get(url_env) + path
        else:
            url = "${process.env.%s}" % config.get("envVars").get(url_env) + path
            # url = "${process.env.%s}" % config.get("envVars").get(url_env) + '/' + path
    new_query_params =[]
    new_path_params = []
    for params in model.request.parameters:
        if params.param_in == ParamsInEnum.QUERY:
            if params.param_type == "USER_INPUT":
                new_query_params.append({"name":params.name, "type":params.type})
                query_params.append("%s=${QueryParameters.%s}" % (params.name, params.name))
                if 'QueryParameters' not in function_args:
                    function_args.append('QueryParameters')
            elif params.param_type == "STATIC":
                query_params.append("%s=%s"%(params.name,params.value))
            elif params.param_type == "LOCAL_STORAGE":
                query_params.append("%s=${localStorage.getItem('%s')}" % (params.name, params.storage_key))

            elif params.param_type == "SESSION_STORAGE":
                query_params.append("%s=${sessionStorage.getItem('%s')}" % (params.name, params.storage_key))
                

            
        elif params.param_in == ParamsInEnum.PATH:
            if params.param_type == "USER_INPUT":
                new_path_params.append({"name":params.name, "type":params.type})
                url=url.replace(f"{{{params.name}}}", f"${{PathParameters.{params.name}}}")
                if 'PathParameters' not in function_args:
                    function_args.append('PathParameters')
            elif params.param_type == "STATIC":
                if not params.value:
                    params.value = ""
                url=url.replace(f"{{{params.name}}}",params.value)
            elif params.param_type == "LOCAL_STORAGE":
                url=url.replace(f"{{{params.name}}}", "${localStorage.getItem('%s')}"%(params.storage_key))
            elif params.param_type == "SESSION_STORAGE":
                url=url.replace(f"{{{params.name}}}", "${sessionStorage.getItem('%s')}"%(params.storage_key))
               
            

    if len(query_params) > 0:
        query = '&'.join(query_params)
        query = "?"+query
        url = url + query
    
    axios_url = "`%s`"%(url)
    return {
        "axios_url" : axios_url,
        "function_args" : function_args,
        "path_params" : new_path_params,
        "query_params" : new_query_params
    }



def generate_websocket_function( model, service_type):
    func_name = model.operation_id
    react_code = ""
    response_interceptor_code = response_interceptor_code.replace('{REFRESH_TOKEN_CONDITION}',"")
    


def generate_token_fetching_code(security_schemes, model):
    key_name = ''
    token_store ={}
    fetch_token = ''
    auth_code = ''
    for k,v in security_schemes.items():
        if v.get("type") == 'apiKey':
            key_name = v.get("name")
    for res in  model.response:
        if res.status == StatusEnum.S_200:
            schema = res.schema
            if schema and "properties" in schema:
                res.token_store = create_token_store(schema["properties"])
            token_store = res.token_store
    if token_store != {} and token_store != None:
        for prop, prop_info in token_store.items():
            if prop_info.get("store_in") == TokenStoreTypeEnum.LOCAL_STORAGE:
                fetch_token = "localStorage.getItem('%s')"%(prop_info["storage_key"])
            elif prop_info.get("store_in") == TokenStoreTypeEnum.SESSION:
                fetch_token = "sessionStorage.getItem('%s')"%(prop_info["storage_key"])
            break
                
        if model.authentication_type == AuthTypeEnum.BEARER:
            auth_code = "request.headers.Authorization = `Bearer ${token}`;"
        elif model.authentication_type == AuthTypeEnum.APIKEY:
            auth_code = f"request.headers.{key_name} = token;"
        elif model.authentication_type == AuthTypeEnum.BASIC:
            auth_code = f"request.headers.Authorization = token;"
    return fetch_token,auth_code
    
def generate_interceptors_code(available_interceptors,model,security_schemes,auth_service_path,module_id):
    if isinstance(model, dict):
        model = ApiModelLoader.load_auth_api_model(model)
    code = AUTH_INTERCEPTOR
    new_interceptor = {}
    auth_code = ''
    new_name = "authInterceptor_" + model.operation_id
    function_name =  convert_to_valid_variable_name(new_name)
    fetch_token = ''
    is_update = False
    final_interceptor_code =''
    if not auth_service_path.endswith(".json"):
            auth_service_path += ".json"
    with open(auth_service_path, 'r') as file:
        swagger_content = json.load(file)
    
    if len(available_interceptors) > 0 :
        for interceptor in available_interceptors:
            if interceptor.get("type") == "REQUEST":
                interceptor_name = interceptor.get("name")
                # if interceptor_name == function_name:
                if model.interceptor_id != '' and model.interceptor_id == interceptor.get("id"):
                    new_code = AUTH_INTERCEPTOR
                    fetch_token,auth_code = generate_token_fetching_code(security_schemes, model)
                    if fetch_token != '' and auth_code != '':
                        new_code = new_code.replace('{FETCH_TOKEN}',fetch_token)
                        new_code = new_code.replace('{AUTH_CODE}',auth_code)
                    else:
                        new_code = new_code.replace('{FETCH_TOKEN}',"''")
                        new_code = new_code.replace('{AUTH_CODE}',"''")
                    new_code = new_code.replace('{INTERCEPTOR_NAME}',function_name)
                    final_interceptor_code += new_code
                    interceptor["interceptorCode"] = new_code
                    swagger_content[module_id]["interceptors"] = available_interceptors
                    append_to_dict_file(auth_service_path, swagger_content)
                    is_update = True
                else:
                    final_interceptor_code += interceptor.get("interceptorCode")
        
    
    if not is_update:
        fetch_token,auth_code = generate_token_fetching_code(security_schemes, model)
        if fetch_token != '' and auth_code != '':
            code = code.replace('{FETCH_TOKEN}',fetch_token)
            code = code.replace('{AUTH_CODE}',auth_code)
        else:
            code = code.replace('{FETCH_TOKEN}',"''")
            code = code.replace('{AUTH_CODE}',"''")
        code = code.replace('{INTERCEPTOR_NAME}',function_name)
        
        #generate the object
        new_interceptor["id"] = generate_uuid_as_key()
        new_interceptor["name"] = function_name
        new_interceptor["interceptorCode"] = code
        new_interceptor["type"] = "REQUEST"
        new_interceptor["errorCode"] = ''
        final_interceptor_code += code
        
            
        current_module_interceptors = swagger_content[module_id]["interceptors"]
        current_module_interceptors.append(new_interceptor)
        swagger_content[module_id]["interceptors"] = current_module_interceptors
        swagger_content[module_id]["auth_apis"][model.id]["interceptor_id"] = new_interceptor["id"]
        append_to_dict_file(auth_service_path, swagger_content)
    
    if new_interceptor != {}:
        return final_interceptor_code, new_interceptor["id"]
    else:
        return final_interceptor_code, ''