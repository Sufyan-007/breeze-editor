import yaml
import traceback
import copy
import os
import json

from ..api_models import MethodsEnum,AuthApiTypeEnum,AuthTypeEnum

from ..utils.content_type_and_mode import get_content_type_and_mode
from ..utils.set_response_status import set_response_status
from ..utils.jsonencoder import EnhancedJSONEncoder
from ..utils.uuid_as_key import generate_uuid_as_key
from ..utils.api_model_loader import ApiModelLoader
from ..api_models.custom_exception import CustomeException
from common.utils.app_consts import CONFIG_PATH


class WebsocketConverter:
    def __init__(self):
        pass

    ## headers remaining
    def _create_channel_json(channel_data,components):
        schema_relation = "ONEOF"
        schema = {}
        channel_obj = {
            "operation_id" : channel_data.get("operationId"),
            "description": channel_data.get("description"),
            "schema_relation" : "ONEOF",
            "messages" : [],
            "schema" : {}
        }
        messages = []
        message = channel_data.get("message",{})
        for key,value in message.items():
            if key.upper() == "ONEOF":
                schema_relation = "ONEOF"  
                for s_ref in value:
                    if "$ref" in s_ref:
                        messages.append(s_ref.get("$ref").split("/")[-1])
        
            else:
                if "$ref" in key:
                    messages.append(key.split)
                    
        ## create json schme for each message type
        for sch_ref in messages:
            schema[sch_ref] = {
                "payload" : {},
                "response" : None
            }
            message_data = components.get("messages",{}).get(sch_ref,None)
            payload = {}
            response = None
            if "$ref" in message_data.get("payload",{}):
                ref = message_data.get("payload",{}).get("$ref","").split("/")[-1]
                payload = WebsocketConverter._create_schema(schema_name=ref,components_schemas=components.get("schemas",{}))
            
            if "$ref" in message_data.get("x-response",{}):
                ref = message_data.get("x-response",{}).get("$ref","").split("/")[-1]
                response = WebsocketConverter._create_schema(schema_name=ref,components_schemas=components.get("schemas",{}))
            schema[sch_ref]["payload"] = payload
            schema[sch_ref]["response"] = response
        
        channel_obj["schema"] = schema
        channel_obj["schema_relation"] = schema_relation
        
        return channel_obj
          
    
    ## need to handle env and multiple server url
    ## only work for public
    @staticmethod
    def _create_url_json(servers):
        public= servers.get("public",{})
        protocol = "wss"
        base_url = ""
        if public is not None:
            base_url = public.get("url")
            protocol = public.get("protocol")
        url = {
            "servers" : [public],
            "baseurl" : base_url, 
            "host": [],
            "protocol": protocol, 
            "port": None,
            "path": "",
            "url_env":None
        }
        return url
    

    ## need to complete
    @staticmethod
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
                prop_schema = WebsocketConverter._create_schema(prop_name, components_schemas, seen=seen)
            else:
                prop_type = prop_data.get('type', '')
                prop_schema = {'type': prop_type}
                if 'example' in prop_data:
                    prop_schema['example'] = prop_data['example']

            if prop_data.get('type') == 'array' and 'items' in prop_data:
                items_ref = prop_data['items'].get('$ref', None)
                if items_ref:
                    items_name = items_ref.split('/')[-1]
                    items_schema = WebsocketConverter._create_schema(items_name, components_schemas, seen=seen)
                    prop_schema['items'] = items_schema
                else:
                    prop_schema['items'] = prop_data['items']

            schema['properties'][prop_name] = prop_schema

        return schema


    ## complete
    @staticmethod
    def prepare_api_models(json_data):
        error_obj = {
            "general_error" : [],
            "auth_error" : []
        } 
        try:
            if not json_data:
                raise ValueError("Empty JSON data")

            openapi_data = yaml.safe_load(json_data)
            channels = openapi_data.get("channels",{}).get("/",{})
            components = openapi_data.get("components",{})
            
            channel_obj,name = WebsocketConverter.convert_to_json_data_model(openapi_data,channels=channels,components=components)         
            api_model = ApiModelLoader.load_ws_model(channel_obj)
            return  {
                "filename" : name,
                "channel_obj" : api_model,
                "error_obj" : error_obj
            }

        except Exception as e:
            print(traceback.format_exc())
            error_obj["general_error"].append(str(e))  
            raise (CustomeException(error_obj)) 


    ## done
    @staticmethod
    def convert_to_json_data_model(metadata,channels,components):
        model_json = {
            
            "id" :generate_uuid_as_key(), 
            "url" : {},
            "publish" : {},
            "subscribe" : {}
    
        }
        url_obj = WebsocketConverter._create_url_json(
            servers=metadata.get("servers",[])            
        )
        title = metadata.get("info",{}).get("title","default_title")
        title = title.replace(" ","_")
        title = title.replace("-","_")
        title = title.strip()
        model_json["tags"] = title
        publish_obj = WebsocketConverter._create_channel_json(
            channel_data=channels.get("publish",{}),
            components=components
        )
        subscribe_obj = WebsocketConverter._create_channel_json(
            channel_data=channels.get("subscribe",{}),
            components=components
        )
        model_json["publish"] = publish_obj
        model_json["subscribe"] = subscribe_obj
        model_json["url"] = url_obj
                    
        return model_json,title



    
   

                    
                
                