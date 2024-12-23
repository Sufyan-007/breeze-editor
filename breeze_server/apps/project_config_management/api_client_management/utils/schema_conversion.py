from ....common.utils.uuid_as_key import generate_uuid_as_key

def object_converter(obj):
    
    properties = obj.get("properties", None)
    if properties:
        required = obj.get("required", [])
        
        new_properties = {}
        for property, value in properties.items():
            new_properties[property] = convert_type_to_config(value)

        
        new_schema = {
            'type': 'OBJECT',
            'properties': new_properties,
            'required': required
        }
        
        if "additionalProperties" in obj and obj["additionalProperties"]:
            if type(obj["additionalProperties"]) ==dict and obj["additionalProperties"]!={} :
                new_schema["additionalProperties"] = convert_type_to_config(obj["additionalProperties"])
            else:
                new_schema["additionalProperties"] = {
                    "type":"ANY"
                }
    else:
        new_schema = {
            'type': 'OBJECT',
        }
        if "additionalProperties" in obj and type(obj["additionalProperties"]) ==dict and obj["additionalProperties"]!={} : 
            new_schema["additionalProperties"] = convert_type_to_config(obj["additionalProperties"])
        else:
            new_schema["additionalProperties"] = {
                "type":"ANY"
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
            "type": "ARRAY",
            "templateInputs": [convert_type_to_config(input_type["items"])]
        }
        
    elif input_type["type"] == "object":
        typeObj = object_converter(input_type)
    
    elif input_type["type"] in ("string", "boolean", "integer", "number"):
        input_type["type"] = input_type["type"].upper()
        typeObj = input_type

    if with_wrap:
        typeObj = {
            "selection" : with_wrap,
            "types": typeObj if type(typeObj) is list else [typeObj]
        }
    
    return typeObj



def process_schema_item(schema_item, key=None):
    """
    Processes a single schema item, generating IDs and modifying the schema as needed.
    """
    id = generate_uuid_as_key()
    schema_item["id"] = id
    if key:
        schema_item["name"] = key

    # Handle types
    types = schema_item.get("types", None)
    if types:
        for type in types:
            if type.get("type") in ["OBJECT", "ARRAY"]:
                type["id"] = id
        schema_item["types"] = types

    # Handle properties
    if schema_item.get("properties", None):
        for prop_key, prop_value in schema_item["properties"].items():
            prop_types = prop_value.get("types", None)
            if prop_types:
                for prop_type in prop_types:
                    if prop_type.get("type") in ["OBJECT", "ARRAY"]:
                        prop_type["id"] = id
                prop_value["types"] = prop_types

    return id, schema_item



def generate_ids(schema_content, isList=False):
    converted_data = {}

    if isList:
        for schema in schema_content:
            id, processed_schema = process_schema_item(schema)
            converted_data[id] = processed_schema
    else:
        for key, val in schema_content.items():
            id, processed_schema = process_schema_item(val, key=key)
            converted_data[id] = processed_schema

    return converted_data





