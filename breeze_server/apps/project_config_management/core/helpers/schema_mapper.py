AVAILABLE_SCEHMAS = {
    'Pet' :{
        "required": ["name", "photoUrls"],
        "type": "OBJECT",
        "properties": {
            "id": { "type": "NUMBER", "format": "int64", "example": 10 },
            "name": { "type": "STRING", "example": "doggie" },
            "category": { 
                "$schema": "Category"
            },
            "available": {
                "type": "BOOLEAN",
            },

        },
        "name": "Pet"
    },
    "Category":{
        "type":"OBJECT",
        'properties':{
            "name":{
                "type":"STRING",
                "example":"Dog"
            }
        }
    }

}

DEFAULT_VALUES ={
    "STRING":"",
    "NUMBER":0,
    "BOOLEAN":False,
    "CALLBACK":"",
    

}

def get_schema(schema_id):
    return AVAILABLE_SCEHMAS[schema_id]

def get_schema_mapping(type_definition,projectId , withExamples=True):
    sample_obj = {}
    
    schema = type_definition.get("$schema",type_definition.get("$ref"))
    
    if schema:
        type_definition= get_schema(schema)
        
    
    
    type = type_definition["type"]
    type = type.upper()
    if type == "OBJECT":
        sample_obj = {
            "type":"OBJECT",
            "properties":{}
        }
        for x in type_definition["properties"]:
            sample_obj["properties"][x] = get_schema_mapping(type_definition["properties"][x],projectId)
    
    else:
        sample_obj['type'] = type
        if withExamples:
            sample_obj['value'] = type_definition.get("example",DEFAULT_VALUES[type])
        else:
            sample_obj['value'] = DEFAULT_VALUES[type]

    
    return sample_obj