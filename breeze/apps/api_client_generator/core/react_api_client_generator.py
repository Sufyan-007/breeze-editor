from ..helper_models.base_models.api_model import ApiModel
from ..helper_models.base_models.request import Request
from ..helper_models.base_models.response import Response
from ..helper_models.base_models.key_value import KeyValue
from ..helper_models.base_models.url import Url
from ..helper_models.base_models.body import Body
from ..helper_models.base_models.parameter import Parameter
from ..helper_models.base_models.auth import Auth, AuthContent
from ..helper_models.base_models.formdata import Formdata
from ..helper_models.enums.token_store_type import TokenStoreTypeEnum
from ..helper_models.enums.auth_api_type import AuthApiTypeEnum
from ..helper_models.enums.content import ContentEnum
from ..helper_models.enums.mode import ModeEnum
from ..helper_models.enums.params_in import ParamsInEnum

from ..helper_models.enums.auth_type import AuthTypeEnum
from ..helper_models.enums.token_store_type import TokenStoreTypeEnum
from .helpers.api_model_loader import ApiModelLoader
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
from common.utils.config_reader import read_config_file, read_file_json, write_file
import json
from ..helper_models.encoder import EnhancedJSONEncoder


RESPONSE_INTERCEPTOR = """
    // Add a response interceptor
    api.interceptors.response.use((response) => { 
        // block to handle success case
        return response
    }, function (error) { 
        // block to handle error case
        const originalRequest = error.config;
        if (error.response.status === 401 && originalRequest.url === '{REFRESH_TOKEN_URL}') { 
            // Added this condition to avoid infinite loop 
            // Redirect to any unauthorised route to avoid infinite loop...
            return Promise.reject(error);
        }
 
        if (error.response.status === 401 && !originalRequest._retry) { 
            // Code inside this block will refresh the auth token
            originalRequest._retry = true;
            {GET_REFRESHED_TOKEN_CODE}
        }
    return Promise.reject(error);
});

"""

REQUEST_INTERCEPTOR = """
    // Add a request interceptor
    api.interceptors.request.use(
    (config) => {
        const token = {FETCH_TOKEN};
        if (token) {
            {AUTH_CODE}
        }
        return config;
    },
    (error) => Promise.reject(error)
    );

    
"""


class ReactApiClientGenerator:

    app_config_dir = None
    app_config = {}

    def __init__(self, app_name):
        self.app_config_dir = f"{CONFIG_PATH}/{app_name}"
        self.app_config = read_config_file(
            self.app_config_dir, CONFIG_FILES_PATH['APP_CONFIG'])
        self.app_config['APP_CONFIG_PATH'] = f"{CONFIG_PATH}/{app_name}"
        self.app_config['APP_SOURCE_DIR'] = f"{self.app_config['path']}/{self.app_config['name']}/{self.app_config['components_src_dir']}"

    def _manage_service_tags(self, tags, react_function, map_services):
        # prepare dict obj for each tag
        # each react functions will be bind to a tag/service class
        if tags is None or len(tags) == 0:
            if "default" in map_services:
                map_services["default"].append(react_function)
            else:
                map_services["default"] = [react_function]
            return map_services
        for tag in tags:
            if tag in map_services:
                map_services.get(tag).append(react_function)
            else:
                map_services[tag] = [react_function]
        return map_services

    def create_serice_files(self, map_services):
        # preprare new service file for each tag
        folder_name = "service"
        for tag, func_arr in map_services.items():
            tag = tag.title()
            filename = tag+"Service.js"
            content = "\n"
            for func in func_arr:
                content += "\n"
                content += func
            path = f"{self.app_config['APP_SOURCE_DIR']}/{folder_name}/{filename}"

            write_file(path, content)
        print("services generated.............")

    def generate_react_service(self, app_name, filename,service_type):
        service_path = f"{CONFIG_PATH}/{app_name}/generated_intermediate_json/{filename}.json"
        service_config = read_file_json(service_path)
        map_services = {}
        for key,config in service_config.items():
            model = None
            if service_type == "AUTH":
                model = ApiModelLoader.load_auth_api_model(config)
            else:
                model = ApiModelLoader.load_api_model(config)
            react_function = self.generate_service_function(
                model, False, app_name,service_type)
            
            map_services = self._manage_service_tags(
                model.tags, react_function, map_services)
        self.create_serice_files(map_services)

    
    def retrive_token_code(self,auth_api_id,app_name):
        service_path = f"{CONFIG_PATH}/{app_name}/generated_intermediate_json/auth.json"
        service_config = read_file_json(service_path)
        auth_config = service_config.get(auth_api_id,None)
        if auth_config is not None:
            auth_config = ApiModelLoader.load_auth_api_model(auth_config)
            token_store_info = auth_config.token_store
            store_in = token_store_info.store_in
            access_token_key = token_store_info.access_token_key
            refresh_token_key = token_store_info.refresh_token_key
            code = ""
            if store_in == TokenStoreTypeEnum.LOCAL_STORAGE:
                code = "localStorage.getItem('%s');"%(access_token_key)
            elif store_in == TokenStoreTypeEnum.SESSION:
                code = "sessionStorage.getItem('%s');"%(access_token_key)

            elif store_in == TokenStoreTypeEnum.COOKIES:
                code = "localStorage.getItem('%s');"%(access_token_key)
            return code
        else:
            return ""
            

    def generate_api_interceptor(self, auth, app_name):
        type = auth.type
        auth_code = ""
        interceptor_code = REQUEST_INTERCEPTOR
        token = self.retrive_token_code(auth.login_api,app_name)
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

    def set_response_interceptor(self, auth, app_name):
        interceptor_code = RESPONSE_INTERCEPTOR
        auth_api_path = f"{CONFIG_PATH}/{app_name}/generated_intermediate_json/auth.json"
        auth_api_config = read_file_json(auth_api_path)
        token_api_config = auth_api_config.get(auth.token_api)
        token_api_model = ApiModelLoader.load_api_model(token_api_config)
        token_api_code = self.generate_service_function(token_api_model, True, app_name)

        interceptor_code = interceptor_code.replace('{REFRESH_TOKEN_URL}', token_api_model.request.url.baseurl)
        interceptor_code = interceptor_code.replace(
            '{GET_REFRESHED_TOKEN_CODE}', token_api_code)
        return interceptor_code

    def set_request_headers(self, model, app_name):
        headers = {}
        if model.request.headers:
            for header in model.request.headers:
                headers[header.key] = header.value
            
            return headers
        else:
            return {}
    
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
        body = model.request.body
        raw_data = None
        variable_declaration = ""
        headers = []
        params = []
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
                    value = model.operation_id
                    raw_data = value
                else:
                
                    schema_name = body.schema_name
                    params.append(schema_name)
                    schema = body.schema
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
            form_data = body.formdata
            for item in form_data:
                params.append(item.key)
                if item.type == "file":
                    variable_declaration = "\n" + variable_declaration +"bodyFormData.append('%s', `${%s}`);"%(item.key,item.key)
                else:
                    variable_declaration = "\n" + variable_declaration+"bodyFormData.append('%s', `${%s}`);"%(item.key,item.key)
                raw_data = "bodyFormData"
        
        elif mode == ModeEnum.URLENCODED:
            headers.append({"key" : "content-type","value" : ContentEnum.URLENCODED.value})
            variable_declaration = "let formBody = [];"
            form_data = body.formdata
            for item in form_data:
                params.append(item.key)
                variable_declaration = "\n" + variable_declaration+'formBody.push(`${encodeURIComponent("%s")}` + "=" + `${encodeURIComponent(%s)}`);'%(item.key,item.key)
                raw_data = "formBody"
            variable_declaration = "\n" + variable_declaration+'formBody = formBody.join("&");'

        return {
            "code" : variable_declaration,
            "raw_data" : raw_data,
            "headers" : headers,
            "params" : params
        }

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

        for params in model.request.parameters:
            if params.param_in == ParamsInEnum.QUERY:
                query_params.append("%s=${%s}"%(params.name,params.name))
                function_args.append(params.name)
            elif params.param_in == ParamsInEnum.PATH:
                path_params.append("${%s}"%(params.name))
                function_args.append(params.name)

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
            "function_args" : function_args
        }

    def generate_service_function(self, model, anonymous, app_name,service_type):
        func_name = model.operation_id
        interceptor_code = ""
        response_interceptor_code = ""
        if service_type != "AUTH" and  model.request.auth is not None:
            interceptor_code = self.generate_api_interceptor(
                model.request.auth, app_name)

            if model.request.auth.token_api is not None:
                response_interceptor_code = self.set_response_interceptor(
                    model.request.auth, app_name)

        react_code = ""
        if anonymous is True:
            react_code = """
                {AXIOS_OBJECT_DECLARATION}
                {INTERCEPTOR_CODE}
                {RESPONSE_INTERCEPTOR_CODE}
                return api({URL})
                
            """ 

        else:
            react_code = """
                export const %s = async ({FUNC_ARGS}) => {
                    {AXIOS_OBJECT_DECLARATION}
                    {INTERCEPTOR_CODE}
                    {RESPONSE_INTERCEPTOR_CODE}
                    let resp = await api({URL})
                    {RESPONSE_CODE}
                    return resp
                };
                """ % (func_name)

        axis_object_declation = """
            const api = axios.create({
                {METHOD},
                {HEADERS},
                {BODY}
            });
        """
        # set request url
        url_obj = self.set_request_url(model,app_name)
        function_args = url_obj.get("function_args",[])

        
        ## set api method
        axis_object_declation = axis_object_declation.replace('{METHOD}',"method : '"+model.request.method.value+"'")
        
        # set request headers
        headers = self.set_request_headers(model,app_name)
        
        # set request body if given
        body = self.set_request_body(model,app_name)
        variable_declaration = body.get("code","")
        
        if len(variable_declaration) > 0:
            ## declare any formdata or file variable befor passing it to axios
            axis_object_declation = variable_declaration + axis_object_declation

        request_body = body.get("raw_data",None)
        extra_headers = body.get("headers",[])
        extra_params = body.get("params",[])
        
        ## merge headers
        for head in extra_headers:
            headers[head.get("key")] = head.get("value")
        
        ## merge params
        function_args = function_args + extra_params

        if request_body is not None:
            axis_object_declation = axis_object_declation.replace('{BODY}',"data : %s"%(request_body))
        else:
            axis_object_declation = axis_object_declation.replace('{BODY}','')


        if bool(headers) is True:
            headers =  ' headers : %s'%(json.dumps(headers))
            axis_object_declation = axis_object_declation.replace('{HEADERS}',headers)
        else:
            axis_object_declation = axis_object_declation.replace('{HEADERS},',"")

        ## set function args comma seperated
        function_args = ",".join(function_args)
        

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
            if auth_api_type == AuthApiTypeEnum.LOGIN:
                
                token_store_info = model.token_store
                store_in = token_store_info.store_in
                access_token_key = token_store_info.access_token_key
                refresh_token_key = token_store_info.refresh_token_key
                if store_in == TokenStoreTypeEnum.LOCAL_STORAGE:
                    code = "localStorage.setItem('%s','`${resp.data.access_token}`');"%(access_token_key)
                    code = code + '\n' + "localStorage.setItem('%s',`${resp.data.refresh_token}`);"%(refresh_token_key)

                elif store_in == TokenStoreTypeEnum.SESSION:
                    code = "sessionStorage.setItem('%s','`${resp.data}`');"%(access_token_key)
                    code = code + '\n' + "sessionStorage.setItem('%s',`${resp.data.refresh_token}`);"%(refresh_token_key)

            elif auth_api_type == AuthApiTypeEnum.REFRESH:
                pass
                
            react_code = react_code.replace('{RESPONSE_CODE}',code)
        else:
            react_code = react_code.replace('{RESPONSE_CODE}',"")

        return react_code
