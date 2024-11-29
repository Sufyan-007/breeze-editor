from ....common.utils.uuid_as_key import generate_uuid_as_key

def object_converter(obj):
    
    properties = obj.get("properties", None)
    if properties:
        required = obj.get("required", [])
        
        new_properties = {}
        for property, value in properties.items():
            new_properties[property] = convert_type_to_config(value)

        
        new_schema = {
            'type': 'object',
            'properties': new_properties,
            'required': required
        }
        
        if "additionalProperties" in obj and obj["additionalProperties"]:
            if type(obj["additionalProperties"]) ==dict and obj["additionalProperties"]!={} :
                new_schema["additionalProperties"] = convert_type_to_config(obj["additionalProperties"])
            else:
                new_schema["additionalProperties"] = {
                    "type":"any"
                }
    else:
        new_schema = {
            'type': 'object',
        }
        if "additionalProperties" in obj and type(obj["additionalProperties"]) ==dict and obj["additionalProperties"]!={} : 
            new_schema["additionalProperties"] = convert_type_to_config(obj["additionalProperties"])
        else:
            new_schema["additionalProperties"] = {
                "type":"any"
            }
    return new_schema


def convert_type_to_config(input_type,with_wrap="anyOf"):
    typeObj = {}
    if "$ref" in input_type:
        typeObj = input_type
        
    elif "anyOf" in input_type:
        with_wrap ="anyOf"
        typeObj =  [convert_type_to_config(x,with_wrap = False) for x in input_type["anyOf"]]
        
    elif "allOf" in input_type:
        with_wrap = "allOf"
        
        typeObj = [convert_type_to_config(x,with_wrap = False) for x in input_type["allOf"]]
            
    elif "oneOf" in input_type:
        with_wrap ="oneOf"
        typeObj =  [convert_type_to_config(x,with_wrap = False) for x in input_type["oneOf"]]
        
        
    elif input_type["type"] == "array":
        typeObj= {
            "type": "array",
            "templateInputs": [convert_type_to_config(input_type["items"])]
        }
        
    elif input_type["type"] == "object":
        typeObj = object_converter(input_type)
    
    elif input_type["type"] in ("string", "boolean", "integer", "number"):
        typeObj = input_type

    if with_wrap:
        typeObj = {
            "selection" : with_wrap,
            "types": typeObj if type(typeObj) is list else [typeObj]
        }
    
    return typeObj



def generate_ids(schema_content, isList=False):
    converted_data = {}
    if isList:
        for schema in schema_content:
            id = generate_uuid_as_key()
            converted_data[id]= schema
    else:
        for key,val in schema_content.items():
            id = generate_uuid_as_key()
            val["name"] = key
            converted_data[id]= val
    return converted_data





