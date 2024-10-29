import json
from ..utils.append_dict_file import append_to_dict_file
from ....common.utils.uuid_as_key import generate_uuid_as_key
def delete_schema_helper(schema_file_path,schemaId):
    try:
        with open(schema_file_path, "r+") as file:
            schema_data = json.load(file)
        if schemaId in schema_data:
            del schema_data[schemaId]
            append_to_dict_file(schema_file_path, schema_data,False)
            return {"message": f"Schema deleted successfully."},200
        else:
            return {"error": f"Schema '{schemaId}' not found."},404
    except Exception as e:
        return {"error": str(e)},500
    

def add_or_edit_schema_helper( schema_details, schema_name, file_path, edited_name=None, schema_id=None):
    try: 
        if not schema_name:
            return {"error": "Schema Name is required "},500
        try:
            with open(file_path, "r") as file:
                schema_data = json.load(file)
        except FileNotFoundError:
            schema_data = {}
        
        if schema_id:
            if schema_id not in schema_data:
                return {"error": f"Schema '{schema_details.get('name')}' not found for editing"},404
            for _, value in schema_data.items():
                if value.get("name") == edited_name:
                    return {"error": f"Schema '{schema_details.get('name')}' already exists"},409
            schema_data[schema_id] = schema_details
        else:
            for _, value in schema_data.items():
                if value.get("name") == schema_name:
                    return {"error": f"Schema '{schema_details.get('name')}' already exists"},409
            id = generate_uuid_as_key()
            schema_data[id] = schema_details
        append_to_dict_file(file_path, schema_data)
        if schema_id:
            return {"message": "Schema Edited Successfully"},200
        else:
            return {"message": "Schema Added Successfully"},200
    
    except Exception as e:
        return {"error": str(e)},500
    
    
def resolve_schemas_helper(schema_file_path, schemaId, new_schema_name, details, property_details):
    try:
        prop_name = property_details.get("name")
        types_index = int(property_details.get("index"))
        new_schema_id = generate_uuid_as_key()
        details["name"] = new_schema_name
        with open(schema_file_path, "r+") as file:
            schema_data = json.load(file)
        if schemaId in schema_data:
            schema_data[schemaId]["properties"][prop_name]["types"][types_index] = {"$ref" : new_schema_id}
            schema_data[new_schema_id] = details
            append_to_dict_file(schema_file_path, schema_data)
            return {"message": f"Schema resolved successfully."},200
        else:
            return {"error": f"Schema '{schemaId}' not found."},404
    except Exception as e:
        return {"error": str(e)},500