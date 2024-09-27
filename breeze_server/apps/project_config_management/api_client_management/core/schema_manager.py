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
            return {"message": f"Schema deleted successfully."}
        else:
            return {"error": f"Schema '{schemaId}' not found."}
    except Exception as e:
        return {"error": str(e)}
    

def add_or_edit_schema_helper( schema_details, schema_name, file_path, schema_id=None):
    try: 
        if not schema_name:
            return {"error": "Schema Name is required "}
        try:
            with open(file_path, "r") as file:
                schema_data = json.load(file)
        except FileNotFoundError:
            schema_data = {}
        
        if schema_id:
            if schema_id not in schema_data:
                return {"error": f"Schema '{schema_details.get('name')}' not found for editing"}
            for _, value in schema_data.items():
                if value.get("name") == schema_name:
                    return {"error": f"Schema '{schema_details.get('name')}' already exists"}
            schema_data[schema_id] = schema_details
        else:
            for _, value in schema_data.items():
                if value.get("name") == schema_name:
                    return {"error": f"Schema '{schema_details.get('name')}' already exists"}
            id = generate_uuid_as_key()
            schema_data[id] = schema_details
        append_to_dict_file(file_path, schema_data)
        if schema_id:
            return {"message": "Schema Edited Successfully"}
        else:
            return {"message": "Schema Added Successfully"}
    
    except Exception as e:
        return {"error": str(e)}