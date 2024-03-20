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


class OpenapiConverter:
    def __init__(self):
        pass

    def create_request(self, path_data, operation, security_schemes, servers):
            operation_data = path_data.get(operation, {})
            method = MethodsEnum[operation.upper()]
            auth_data = self._create_auth( operation_data.get("security"), security_schemes=security_schemes)
            url_data = self._create_url(servers)
            parameters = self._create_parameters(operation_data.get("parameters"))
            body_data = self._create_body(operation_data.get("requestBody", {}))
            if body_data:
                header_data = KeyValue(key= body_data.content_type.split('/')[-1], value=body_data.content_type)
            else:
                header_data = KeyValue(key= '',value='')
            request_obj = Request(method=method, auth=auth_data, headers=header_data, parameters=parameters, url=url_data, body=body_data)
            
            return request_obj
            
            
        

    

    def _create_auth(self, auth_data, security_schemes):
        auth= None
        auth_content = []
        auth_type = ''
        login_api = None
        token_api = None
        if auth_data:
            for security_definition in auth_data:
                scheme_name = list(security_definition.keys())[0]
                scheme_details = security_schemes.get(scheme_name, {})
                
                key = scheme_details.get("name")
                value = scheme_details.get("in")
                auth_type = scheme_details.get("type")
                
                auth_content.append(
                    AuthContent(
                        key=key,
                        value=value,
                        type=auth_type
                    )
                )
            
            auth_type_enum = AuthTypeEnum[auth_type.upper()]
            
        
            auth = Auth(type=auth_type_enum, content=auth_content,login_api=login_api,token_api=token_api)
            
        return auth

    def _create_parameters(self, parameter_data):
        parameters = []
        if parameter_data:
            parameters = [
                    Parameter(
                        param_in="query",
                        name=param.get("name"),
                        type=param.get("schema").get("type"),
                        required=param.get("required"),
                        description=param.get("description"),
                    )
                    for param in parameter_data
                ]
        return parameters

    def _create_url(self, url_data):
       url = Url(baseurl= url_data[0].get("url"), host= '',protocol= '', port= url_data[0].get("port"),path= '')
       return url

    def _create_body(self, body_data):
       body = []
       formdata = []
       content_type = ''
       mode = ''
       schema_name = ''
       if body_data:
        for content_type_str, content in body_data.get("content", {}).items():
            schema_name = content.get("schema").get("$ref")
            if schema_name:
                schema_name = schema_name.split('/')[-1]
            if content_type_str == "application/json":
                mode = 'RAW'
                content_type = 'JSON'
            elif content_type_str == "application/xml":
                mode = 'RAW'
                content_type = 'XML'
            elif content_type_str == "text/plain":
                mode = 'RAW'
                content_type = 'TEXT'
            elif content_type_str == "text/html":
                mode = 'RAW'
                content_type = 'HTML'
            elif content_type_str == "application/javascript":
                mode = 'RAW'
                content_type = 'JAVASCRIPT'
            elif content_type_str == "application/x-www-form-urlencoded":
                mode = 'FORMDATA'
                content_type = 'TEXT'
            elif content_type_str == "application/octet-stream":
                mode = 'BINARY'
                content_type = 'TEXT'
           
        body = Body(mode=ModeEnum[mode],
                       content_type=ContentEnum[content_type], 
                       required=body_data.get("required"),
                       schema_name= schema_name, 
                       raw_content= '',
                       file= '',
                       formdata=formdata
                       )
        return body

    
    
    def _create_headers(self, header_data):
        pass
    
    
    
    def create_response(self, path_data, operation):
        operation_data = path_data.get(operation, {})
        operation_responses = operation_data.get("responses", {})
        responses = []
        for status, data in operation_responses.items():
            content_type = None
            schema_name = None
            content = data.get("content", {})
            if content:
                for key, value in content.items():
                    if value.get("schema").get("items"):
                        schema_name = value.get("schema", {}).get("items", {}).get("$ref", "").split('/')[-1]
                    else:
                        schema_name = value.get("schema", {}).get("$ref", "").split('/')[-1]
                    content_type = key.split('/')[-1]  
                    break  
            else:
                content_type = 'JSON'

            responses.append(
                Response(
                    status=status,
                    content_type=ContentEnum[content_type.upper()],
                    schema_name=schema_name,
                    raw_content='',
                    file=''
                )
            )
        return responses

        
    
   

                    
                
                