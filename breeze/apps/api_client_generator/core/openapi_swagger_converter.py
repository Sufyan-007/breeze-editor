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
from ..helper_models.enums.params_in import ParamsInEnum


class OpenapiConverter:
    def __init__(self):
        pass

    def create_request(self,path, path_data, operation, security_schemes, servers, schemas):
            method = MethodsEnum[operation.upper()]
            auth_data = self._create_auth( path_data.get("security"), security_schemes=security_schemes)
            url_data = self._create_url(path,servers)
            parameters = self._create_parameters(path_data.get("parameters"))
            body_data = self._create_body(path_data.get("requestBody", {}), components_schemas= schemas)
            header_data = []
            if body_data:
                header_data.append(KeyValue(key= body_data.content_type.split('/')[-1] if body_data.content_type else None, value=body_data.content_type))
            else:
                header_data.append(KeyValue(key= '',value=''))
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
                        param_in= ParamsInEnum[parameter_data.get("in").upper()],
                        name=param.get("name"),
                        type=param.get("schema").get("type"),
                        required=param.get("required"),
                        description=param.get("description"),
                    )
                    for param in parameter_data
                ]
        return parameters

    def _create_url(self,path, url_data):
        paths = path.split("/")
        url = Url(
                baseurl= url_data[0].get("url"), 
                host= '',
                protocol= '', 
                port= url_data[0].get("port"),
                path= paths,
                url_env=""
            )
        return url

    

    def _create_body(self, body_data, components_schemas):
        body = []
        formdata = []
        content_type = 'TEXT'
        mode = 'RAW'
        schema_name = ''
        schema = {}
        required = body_data.get("required", False)
        file = ''
        if body_data:
            for content_type_str, content in body_data.get("content", {}).items():
                schema_name = content.get("schema").get("$ref")
                if schema_name is not None:
                    schema_name = schema_name.split('/')[-1]
                    schema = self._create_schema(schema_name, components_schemas)
                    
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
                    mode = 'URLENCODED'
                    content_type = 'URLENCODED'
                    formdata.append(body_data.get("urlencoded"))
                elif content_type_str == 'multipart/form-data':
                    mode = 'FORMDATA'
                    content_type = 'FORMDATA'
                    formdata.append(body_data.get("content").get("multipart/form-data").get("schema").get("properties").get("file"))
                elif content_type_str == "application/octet-stream":
                    mode = 'BINARY'
                    content_type = None
                    file = body_data.get("content").get("application/octet-stream").get("schema")
                    
        body = Body(
            mode=ModeEnum[mode],
            content_type = ContentEnum[content_type] if content_type else None,
            required=required,
            schema_name=schema_name,
            raw_content='',
            file=file,
            schema=schema,
            formdata=formdata
        )

        return body

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
                items_ref = prop_data['items'].get('$ref', '')
                if items_ref:
                    items_name = items_ref.split('/')[-1]
                    items_schema = self._create_schema(items_name, components_schemas, seen=seen)
                    prop_schema['items'] = items_schema
                else:
                    prop_schema['items'] = prop_data['items']

            schema['properties'][prop_name] = prop_schema

        return schema





    
    def _create_headers(self, header_data):
        pass
    
    
    
    def create_response(self, path_data, operation):
        operation_responses = path_data.get("responses", {})
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

        
    
   

                    
                
                