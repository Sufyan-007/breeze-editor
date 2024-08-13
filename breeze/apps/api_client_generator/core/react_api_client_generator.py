import json
import copy

from ..api_models import TokenStoreTypeEnum,AuthApiTypeEnum,ContentEnum,ModeEnum
from ..api_models import ParamsInEnum,AuthTypeEnum,TokenStoreTypeEnum

from ..utils.api_model_loader import ApiModelLoader

from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
from common.utils.config_reader import read_config_file, read_file_json, write_file
from common.utils.file_helper import create_parent_dir_if_not_exists
from ..utils.append_dict_file import append_to_dict_file


from ..consts import RESPONSE_STATUS_CONDITION,REFRESH_TOKEN_API,RESPONSE_INTERCEPTOR,REQUEST_INTERCEPTOR,WEBSOCKET_HOOK
class ReactApiClientGenerator:

    app_config_dir = None
    app_config = {}

    def __init__(self, app_name):
        self.app_config_dir = f"{CONFIG_PATH}/{app_name}"
        self.app_config = read_config_file(
            self.app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        self.app_config['APP_CONFIG_PATH'] = f"{CONFIG_PATH}/{app_name}"
        self.app_config['APP_SOURCE_DIR'] = f"{self.app_config['path']}/{self.app_config['name']}/{self.app_config['components_src_dir']}"

    def _manage_service_tags(self, tags, react_functions, map_services):
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

    def create_service_files(self, map_services):
        # preprare new service file for each tag
        parent_folder_name = "service"
        folder_name= "module1"
        content = "import axios from 'axios'\n"
        create_parent_dir_if_not_exists(f"{self.app_config['APP_SOURCE_DIR']}/{parent_folder_name}/{folder_name}")
        for tag, func_arr in map_services.items():
            tag = tag.title()
            filename = tag+"Service.js"
            for func in func_arr:
                content += "\n"
                content += func
            path = f"{self.app_config['APP_SOURCE_DIR']}/{parent_folder_name}/{folder_name}/{filename}"

            write_file(path, content)
        print("services generated.............")

    def create_websocket_hook_file(self, filename):
        # preprare new service file for each tag
        folder_name = "hooks"
        filename = filename.title()
        filename = filename+"Service.js"
        content = WEBSOCKET_HOOK
        path = f"{self.app_config['APP_SOURCE_DIR']}/{folder_name}/{filename}"
        write_file(path, content)
        print("services generated.............")


    def generate_react_service(self, app_name, filename, service_type, module_id):
        map_services = {}
        if service_type == "WS":
            service_path = f"{CONFIG_PATH}/{app_name}/api_client_intermediate_json/{module_id}/{filename}.json"
            service_config = read_file_json(service_path)
            for key,config in service_config.items():
                model = ApiModelLoader.load_ws_model(config)
                self.create_websocket_hook_file(model.tags)
                
        elif service_type == "AUTH":
            auth_service_path = f"{CONFIG_PATH}/{app_name}/swagger_metadata.json"
            auth_service_content = read_file_json(auth_service_path)
            auth_apis = auth_service_content.get(module_id).get("auth_apis",{})
            for key,config in auth_apis.items():
                model = ApiModelLoader.load_auth_api_model(config)
                react_functions = self.generate_service_function(model, False, app_name,service_type, service_path= auth_service_path,module_id=module_id)
                
                map_services = self._manage_service_tags(model.tags, react_functions, map_services)
            
            self.create_service_files(map_services)
        else:
            service_path = f"{CONFIG_PATH}/{app_name}/api_client_intermediate_json/{module_id}/{filename}.json"
            service_config = read_file_json(service_path)
            for key,config in service_config.items():
                model = ApiModelLoader.load_api_model(config)
                react_functions = self.generate_service_function(model, False, app_name,service_type, service_path= service_path,module_id=module_id)
                
                map_services = self._manage_service_tags(model.tags, react_functions, map_services)
            
            self.create_service_files(map_services)

    
    def retrive_token_code(self,auth_api_id,auth_token_id,app_name, module_id ):
        service_path = f"{CONFIG_PATH}/{app_name}/swagger_metadata.json"
        swagger_metadata = read_file_json(service_path)
        service_config = swagger_metadata.get(module_id).get("auth_apis")
        auth_config = service_config.get(auth_api_id,None)
        if auth_config is not None:
            auth_config = ApiModelLoader.load_auth_api_model(auth_config)
            auth_config_obj = auth_config.as_dict()
            token_store_info = {}
            for resp in auth_config_obj.get("response"):
                if resp.get("status") == 'S_200':
                    token_store_info = resp.get("token_store")
                    for key,value in token_store_info.items():
                        if key == auth_token_id:
                            store_in = value.get('store_in')
                            storage_key = value.get("storage_key")
                            code = ""
                            if store_in == TokenStoreTypeEnum.LOCAL_STORAGE:
                                code = "localStorage.getItem('%s');"%(storage_key)
                            elif store_in == TokenStoreTypeEnum.SESSION:
                                code = "sessionStorage.getItem('%s');"%(storage_key)

                            elif store_in == TokenStoreTypeEnum.COOKIES:
                                code = "localStorage.getItem('%s');"%(storage_key)
            # token_store_info = auth_config.token_store
            # store_in = token_store_info.store_in
            # access_token_key = token_store_info.access_token_key
            # refresh_token_key = token_store_info.refresh_token_key
            
            return code
        else:
            return ""
            

    def generate_api_interceptor(self, auth, app_name,module_id):
        type = auth.type
        auth_code = ""
        interceptor_code = REQUEST_INTERCEPTOR
        token = self.retrive_token_code(auth.login_api, auth.token_id, app_name,module_id)
        interceptor_code = interceptor_code.replace("{FETCH_TOKEN}",token)
        if type == AuthTypeEnum.BASIC:
            auth_code = "config.headers.Authorization = `Basic ${token}`;"

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
                    auth_code = "config.headers.Authorization = `%s ${token}`;" % (
                        header_prefix)
                else:
                    auth_code = "config.headers.Authorization = `${token}`;"

        elif type == AuthTypeEnum.BEARER:
            auth_code = "config.headers.Authorization = `Bearer ${token}`;"

        interceptor_code = interceptor_code.replace('{AUTH_CODE}', auth_code)
        return interceptor_code

    ## needs to think for refresh token api response
    def set_response_interceptor(self, auth, app_name):
        interceptor_code = REFRESH_TOKEN_API
        auth_api_path = f"{CONFIG_PATH}/{app_name}/api_client_intermediate_json/auth.json" #ToDO
        auth_api_config = read_file_json(auth_api_path)
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

    def set_request_headers(self, model, app_name):
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
    def generate_request_body_schema(self,parent_key,schema_name,schema):
        body = {}
        if "type" in schema:
            if schema.get("type") == "object":
                if parent_key is not None:
                    schema_name = parent_key+"."+schema_name
                for key,value in schema.get("properties",[]).items():
                    if "type" in value and value.get("type") == "object":
                        body[key] = self.generate_request_body_schema(schema_name,key,value)
                    else:
                        s = '`${%s.%s}`'%(schema_name,key)
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

    
    def set_request_body(self,model,app_name):
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
                        params.append(model.operation_id)
                        # value = model.operation_id
                        value = "BodyDetails"
                        schema = body.schema
                        body_params = schema
                        raw_data = value
                        model_data = {}
                        model_data = self.generate_request_body_schema(None,value,schema)  
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
                        model_data = self.generate_request_body_schema(None,schema_name,schema)  
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
                for key,item in form_data.get("properties",{}).items():
                    params.append(key)
                    if item.get("type") == "text":
                        variable_declaration = "\n" + variable_declaration +"bodyFormData.append('%s', `${%s}`);"%(key,key)
                    else:
                        variable_declaration = "\n" + variable_declaration+"bodyFormData.append('%s', `${%s}`);"%(key,key)
                raw_data = "bodyFormData"
            
            elif mode == ModeEnum.URLENCODED:
                headers.append({"key" : "content-type","value" : ContentEnum.URLENCODED.value})
                variable_declaration = "let formBody = [];"
                form_data = body.schema
                body_params = form_data
                for key,item in form_data.get("properties",{}).items():
                    params.append(key)
                    variable_declaration = "\n" + variable_declaration+'formBody.push(`${encodeURIComponent("%s")} = ${encodeURIComponent(%s)}`);'%(key,key)
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

    def set_request_url(self,model,app_name):
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
        new_query_params =[]
        new_path_params = []
        for params in model.request.parameters:
            if params.param_in == ParamsInEnum.QUERY:
                if params.param_type == "USER_INPUT":
                    new_query_params.append({"name":params.name, "type":params.type})
                    query_params.append("%s=${QueryParameters.%s}" % (params.name, params.name))
                elif params.param_type == "STATIC":
                    query_params.append("%s=%s"%(params.name,params.value))
                elif params.param_type == "LOCAL_STORAGE":
                    query_params.append("%s=${localStorage.getItem('%s')}" % (params.name, params.storage_key))

                elif params.param_type == "SESION_STORAGE":
                    query_params.append("%s=${sessionStorage.getItem('%s')}" % (params.name),(params.storage_key))
                # query_params.append("%s=${%s}"%(params.name,params.name))
                # function_args.append(params.name)
                
            elif params.param_in == ParamsInEnum.PATH:
                if params.param_type == "USER_INPUT":
                    new_path_params.append({"name":params.name, "type":params.type})
                    path_params.append("${PathParameters.%s}" %(params.name)) 
                elif params.param_type == "STATIC":
                    path_params.append("%s"%(params.value))
                elif params.param_type == "LOCAL_STORAGE":
                    path_params.append("${localStorage.getItem('%s')}"%(params.storage_key))
                elif params.param_type == "SESSION_STORAGE":
                    path_params.append("${sessionStorage.getItem('%s')}"%(params.storage_key))
                # path_params.append("${%s}"%(params.name))
                # function_args.append(params.name)
        function_args.append('QueryParameters')
        function_args.append('PathParameters')
        
        if len(path_params) > 0:
            path = '/'.join(path_params)
            path = "/"+path
            url = url + path

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

    def generate_service_function(self, model, anonymous, app_name,service_type, service_path,module_id):
        func_name = model.operation_id
        interceptor_code = ""
        response_interceptor_code = RESPONSE_INTERCEPTOR
        if service_type != "AUTH" and model.request.auth and len(model.request.auth) > 0 and model.request.auth[0].type != AuthTypeEnum.NOAUTH:
            ## currently only support for single auth
            ## need to handle all array of auth
            auth = model.request.auth[0]
            interceptor_code = self.generate_api_interceptor(auth, app_name,module_id)

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
                    {AXIOS_OBJECT_DECLARATION}
                    const localInstance = axios.create();
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
        url_obj = self.set_request_url(model,app_name)
        function_args = url_obj.get("function_args",[])
        
        #write the parameters to the config file
        path_params = url_obj.get("path_params")
        query_params = url_obj.get("query_params")
       
       
        ## set api method
        axis_object_declation = axis_object_declation.replace('{METHOD}',"method : '"+model.request.method.value+"'")
        axis_object_declation = axis_object_declation.replace('{URL}',url_obj.get("axios_url"))
        
        # set request headers
        combined_headers = self.set_request_headers(model,app_name)
        param_headers = combined_headers["param_headers"] if combined_headers else []
        if combined_headers.get("header_argument"):
            function_args.append(combined_headers.get("header_argument"))
        
        
        headers = combined_headers["body_headers"] if combined_headers else {}
        # set request body if given
        body_items = self.set_request_body(model,app_name)
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
        model_to_write = {new_model["id"]: new_model}
        if service_type == "AUTH":
            with open(service_path, "r")as file:
                swagger_content = json.load(file)
                swagger_content[module_id]["auth_apis"][new_model["id"]] = new_model
                append_to_dict_file(service_path, swagger_content)
        else:
            append_to_dict_file(service_path, model_to_write)
        #######################################################################################################
        
        react_service_functions = []
        common_data = {
            "headers" : copy.deepcopy(headers),
            "axis_object_declation" : copy.deepcopy(axis_object_declation),
            "react_code" : react_code,
            "function_args" : function_args
        }
        
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
                if res.status != "200" and res.status != "201":
                    r_status = RESPONSE_STATUS_CONDITION%(res.status.value,res.description)
                    r_status_conditions.append(r_status)
            if len(r_status_conditions)> 0:
                response_interceptor_code = response_interceptor_code.replace("{RESPONSE_STATUS_CONDITION}","\n".join(r_status_conditions))
            else:
                response_interceptor_code = response_interceptor_code.replace("{RESPONSE_STATUS_CONDITION}","")

            react_code = react_code.replace('{URL}',url_obj.get("axios_url"))
            react_code = react_code.replace('{FUNC_ARGS}',function_args)
            react_code = react_code.replace('{AXIOS_OBJECT_DECLARATION}', axis_object_declation)
            react_code = react_code.replace('{INTERCEPTOR_CODE}', interceptor_code)
            react_code = react_code.replace(
                '{RESPONSE_INTERCEPTOR_CODE}', response_interceptor_code)
            
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
            react_code = react_code.replace('{FUNC_NAME}',func_name)
            react_service_functions.append(react_code)
        return react_service_functions
    
    def generate_websocket_function(self, model, service_type):
        func_name = model.operation_id
        react_code = ""
        response_interceptor_code = response_interceptor_code.replace('{REFRESH_TOKEN_CONDITION}',"")
        