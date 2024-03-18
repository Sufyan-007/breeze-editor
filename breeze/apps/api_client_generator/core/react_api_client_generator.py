from ..helper_models.base_models.api_model import ApiModel
from ..helper_models.base_models.request import Request
from ..helper_models.base_models.response import Response
from ..helper_models.base_models.key_value import KeyValue
from ..helper_models.base_models.url import Url
from ..helper_models.base_models.body import Body
from ..helper_models.base_models.parameter import Parameter
from ..helper_models.base_models.auth import Auth, AuthContent
from ..helper_models.base_models.formdata import Formdata
from ..helper_models.enums.methods import MethodsEnum
from ..helper_models.enums.status import StatusEnum
from ..helper_models.enums.content import ContentEnum
from ..helper_models.enums.mode import ModeEnum
from ..helper_models.enums.auth_type import AuthTypeEnum
from .helpers.api_model_loader import load_json_to_api_model
from common.utils.app_consts import CONFIG_FILES_PATH, CONFIG_PATH
from common.utils.config_reader import read_config_file, read_file_json, write_file

RESPONSE_INTERCEPTOR = """
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
        const token = localStorage.getItem('token');
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

    def generate_react_service(self, app_name, filename):
        service_path = f"{CONFIG_PATH}/{app_name}/generated_intermediate_json/{filename}.json"
        service_config = read_file_json(service_path)
        map_services = {}
        for config in service_config:
            model = load_json_to_api_model(config)
            react_function = self.generate_service_function(model,False,app_name)
            map_services = self._manage_service_tags(
                model.tags, react_function, map_services)
        self.create_serice_files(map_services)

    def generate_api_interceptor(self, auth,app_name):
        type = auth.type
        auth_code = ""
        interceptor_code = REQUEST_INTERCEPTOR

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

    def set_response_interceptor(self, auth,app_name):
        interceptor_code = RESPONSE_INTERCEPTOR
        auth_api_path = f"{CONFIG_PATH}/{app_name}/generated_intermediate_json/auth.json"
        auth_api_config = read_file_json(auth_api_path)
        token_api_config = auth_api_config.get(auth.token_api)
        token_api_model = load_json_to_api_model(token_api_config)
        token_api_code = self.generate_service_function(token_api_model,True,app_name)
        
        interceptor_code = interceptor_code.replace('{REFRESH_TOKEN_URL}', token_api_model.request.url.baseurl)
        interceptor_code = interceptor_code.replace('{GET_REFRESHED_TOKEN_CODE}', token_api_code)
        return interceptor_code

    
    def generate_service_function(self, model,anonymous,app_name):
        func_name = model.operation_id
        interceptor_code = ""
        response_interceptor_code = ""
        if model.request.auth is not None:
            interceptor_code = self.generate_api_interceptor(
                model.request.auth,app_name)
        
            if model.request.auth.token_api is not None:
                response_interceptor_code = self.set_response_interceptor(
                    model.request.auth,app_name)
        
        react_code = ""
        if anonymous is True:
            react_code = """
                const api = axios.create({
                        baseURL: '%s',
                    });
                
                {INTERCEPTOR_CODE}
                {RESPONSE_INTERCEPTOR_CODE}
                return api.%s(%s)
                
            """ % (model.request.url.baseurl, model.request.method.value, '')
        
        else:
            react_code = """
                export const %s = async ({FUNC_ARGS}) => {
                    const api = axios.create({
                        baseURL: '%s',
                    });

                    {INTERCEPTOR_CODE}
                    {RESPONSE_INTERCEPTOR_CODE}
                    let resp = await api.%s(%s)
                    return resp
                };
                """ % (func_name, model.request.url.baseurl, model.request.method.value, '')
        
        react_code = react_code.replace('{INTERCEPTOR_CODE}', interceptor_code)
        react_code = react_code.replace('{RESPONSE_INTERCEPTOR_CODE}', response_interceptor_code)

        return react_code
