import json
import traceback

from ..api_models import ModeEnum
from ..utils.content_type_and_mode import get_content_type_and_mode
from ..utils.body_type_from_postman import get_body_type
from ..utils.set_response_status import set_response_status
from ..utils.uuid_as_key import generate_uuid_as_key
from ..utils.api_model_loader import ApiModelLoader

class PostmanCollectionConverter:
    def __init__(self):
        pass

    def create_request_json(self, request_data,meta_data):
        # Build Request Object
        method = request_data.get("method").strip().upper()
        
        auth_data = request_data.get("auth",{})
        # call to auth data creation
        if auth_data:
            ## postman supports only sigle type of auth in api
            auth_data = [self._create_auth(auth_data=auth_data)]
        else:
            auth_data = []

        # handle headers
        headers = []
        header_data = request_data.get("header", [])
        if header_data:
            headers = self._create_headers(header_data=header_data)

        # call to url data creation and parameters creation
        url_data = request_data.get("url", "")
        url = {}
        parameters = []
        if url_data:
            url = self._create_url_json(url_data=url_data)
            parameters = self._create_parameters_json(url_data=url_data)

        # call to body creation
        arr_body_data = []
        if request_data.get("body"):
            body_data = request_data.get("body")
            arr_body_data = self._create_body(body_data=body_data)

        url_data = self._create_url_json(url)
        parameters = self._create_parameters_json(url)
        request_obj = {
            "method":method, 
            "auth":auth_data, 
            "headers":headers, 
            "parameters":parameters, 
            "url":url_data, 
            "body":arr_body_data
        }
        
        return request_obj

    ## creat schme remaining
    def create_response_arr_json(self, response_data, meta_data):
        responses = []
        if response_data:
        
            for item in response_data:
                status = item.get("status").strip().upper()
                content_type = item.get("content_type").strip().upper()
                schema= {}
                raw_content = ""
                content = item.get("content", None)
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
                    raw_content = item.get("description")

                responses.append(
                    {
                        "status":set_response_status(status),
                        "content_type":content_type.strip().upper(),
                        "schema_name":schema_name,
                        "schema":schema,
                        "raw_content":raw_content,
                        "file":'',
                        "description":item.get("description","")
                    }
                )
        
        return responses

    
    def _create_auth(self, auth_data):
        auth_type = auth_data.get("type","NOAUTH")
        content_data = auth_data.get(auth_type,[])
        auth_type = auth_type.strip().upper()
        login_api = auth_data.get("login_api",None)
        token_api = auth_data.get("token_api",None)
        
        auth_content = []
        for content in content_data:
            auth_content.append(
                {
                    "key":content.get("key"),
                    "value":content.get("value"),
                    "type":content.get("type"),
                }
            )
        
        return {
            "type":auth_type, 
            "content" : auth_content,
            "login_api": login_api,
            "token_api":token_api
        }

    def _create_parameters_json(self, url_data):
        query_parameters = url_data.get("query", [])
        parameters = []
        for param in query_parameters:
         
            parameters.append({
                "param_in":"QUERY",
                "name":param.get("key"),
                "type":"string",
                "required":True,
                "description":"",
            })
        
        return parameters

    def _create_url_json(self, url_data):
        url = {
            "baseurl":url_data.get("raw",url_data.get("baseurl")),
            "host":url_data.get("host"),
            "protocol":url_data.get("protocol", ""),
            "port":url_data.get("port", 0),
            "path":url_data.get("path",[]),
            "url_env":None
        }
        return url

    def _create_body(self, body_data):
        mode=body_data.get("mode").upper()
        schema_name = None
        anonymous = False

        ## create schema remaining

        content_type = body_data.get("content_type")
        mode = body_data.get("mode","").strip().upper()
        content_type= get_body_type(body_data)  
        schema = {
            'type': "object",
            'properties': {},
            'required': []
        }
        key = None 
        if mode == ModeEnum.URLENCODED.name:
            key = "urlencoded"
        elif mode == ModeEnum.FORMDATA.name:
            key = "formdata"
        if key is not None:
            formdata_data = body_data.get(key, [])
            for item in formdata_data:
                schema["properties"][item.get("key")] ={
                    "type": item.get("type","string")    
            }
                
        body = [{
            "mode":mode,
            "raw_content":body_data.get("raw"),
            "schema":schema,
            "content_type":content_type,
            "required":body_data.get("required"),
            "schema_name":schema_name,
            "file":body_data.get("file",{}).get("src"),
            "anonymous" : anonymous
        }]
        return body

    def _create_headers(self, header_data):
        headers = []
        for item in header_data:
            headers.append(
                {
                    "key":item.get("key"), 
                    "value":item.get("value")
                })
        return headers

    ## done
    ## it will return the tags mapping with json object of api model
    @staticmethod
    def convert_to_json_data_model(tag,items,meta_data):
        try:
            postmanConverter = PostmanCollectionConverter()
            api_models = []
            for item in items:
                request_data = item.get("request", {})
                response_data = item.get("response", {})
                request_obj = postmanConverter.create_request_json(request_data=request_data,meta_data=meta_data)
                response_arr = postmanConverter.create_response_arr_json(response_data=response_data,meta_data=meta_data)
                
                api_model_obj = {
                    "id" : generate_uuid_as_key(),
                    "operation_id":item.get("name",""),
                    "tags" :tag,
                    "request":request_obj,
                    "response":response_arr,
                    "summary":item.get("summary"),
                    "is_authentication_api":False
                }    
                api_models.append(api_model_obj)
            return api_models
            
        except Exception as e:
            print(traceback.format_exc())
            return {"error": str(e)}


    @staticmethod
    def prepare_api_models(data):
        
        json_data = json.loads(data)
        info =  json_data.get("info")
        items = json_data.get("item",[])
        tag = info.get("name","default")
        if tag == "":
            tag = "default"
        api_models = []
        

        arr_obj = PostmanCollectionConverter.convert_to_json_data_model(tag,items,info)
        
        ## now load these json obj to api models
        for obj in arr_obj:
            api_model = ApiModelLoader.load_api_model(obj)
            api_models.append(api_model)
             
        return {"filename" : tag, "api_models": api_models}

        