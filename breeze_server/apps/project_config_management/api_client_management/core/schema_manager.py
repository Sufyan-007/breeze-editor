import json,os
from ..utils.append_dict_file import append_to_dict_file
from ....common.utils.uuid_as_key import generate_uuid_as_key
from ..utils.set_unresolved_key import set_unresolved_keys
from ....common.constants.consts import CONFIG_PATH
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
    
    
def resolve_schemas_helper(schema_file_path, schemaId, new_schema_name, details, property_details, existing_schema_id):
    try:
        prop_name = property_details.get("name")
        types_index = int(property_details.get("index"))

        with open(schema_file_path, "r+") as file:
            schema_data = json.load(file)
            
        if new_schema_name:
            if any(schema.get("name") == new_schema_name for schema in schema_data.values()):
                return {"error": f"Schema name '{new_schema_name}' already exists."}, 409

        if schemaId in schema_data:
            schema_id_to_use = existing_schema_id if existing_schema_id else generate_uuid_as_key()
            
            schema_data[schemaId]["properties"][prop_name]["types"][types_index] = {"$ref": schema_id_to_use}
            del schema_data[schemaId]["properties"][prop_name]["isUnresolved"]
            del schema_data[schemaId]["isUnresolved"]
            
            if not existing_schema_id:
                details["name"] = new_schema_name
                schema_data[schema_id_to_use] = details
                set_unresolved_keys(schema_data)
            
            
            append_to_dict_file(schema_file_path, schema_data)
            return {"message": "Schema resolved successfully."}, 200
        else:
            return {"error": f"Schema '{schemaId}' not found."}, 404
    except Exception as e:
        return {"error": str(e)}, 500
    

def get_all_schemas_helper(project_id):
    folder_path = f"{CONFIG_PATH}/{project_id}/models/index.json"
    try:
        with open(folder_path, 'r') as file:
            try:
                index_data = json.load(file)
            except json.JSONDecodeError:
                return {"error": "The index file contains invalid JSON."}, 500
        all_schemas = []
        for module_id in index_data.keys():
            module_file_path = f"{CONFIG_PATH}/{project_id}/models/{module_id}.json"
            if os.path.exists(module_file_path):
                try:
                    with open(module_file_path, 'r') as module_file:
                        module_data = json.load(module_file)
                        all_schemas.extend(module_data.values())  
                except json.JSONDecodeError:
                    return {"error": f"Module file '{module_id}.json' contains invalid JSON."}, 500
                except Exception as e:
                    return {"error": f"Error reading file '{module_id}.json': {str(e)}"}, 500
            else:
                return {"error": f"Module file '{module_id}.json' not found."}, 404

        return {"schemas": all_schemas}, 200
    except Exception as e:
        return {"error": f"An unexpected error occurred: {str(e)}"}, 500

def get_schema_by_id_helper( project_id, schema_id):
    folder_path = f"{CONFIG_PATH}/{project_id}/models/index.json"
    try:
        with open(folder_path, 'r') as file:
            try:
                index_data = json.load(file)
            except json.JSONDecodeError:
                return {"error": "The index file contains invalid JSON."}, 500

        for module_id in index_data.keys():
            module_file_path = f"{CONFIG_PATH}/{project_id}/models/{module_id}.json"
            if os.path.exists(module_file_path):
                try:
                    with open(module_file_path, 'r') as module_file:
                        module_data = json.load(module_file)
                        if schema_id in module_data:
                            resolved_schema = resolve_refs(module_data[schema_id], module_data)
                            return {"schema": resolved_schema}, 200
                except json.JSONDecodeError:
                    return {"error": f"Module file '{module_id}.json' contains invalid JSON."}, 500
                except Exception as e:
                    return {"error": f"Error reading file '{module_id}.json': {str(e)}"}, 500
            else:
                continue

        return {"error": f"Schema with ID '{schema_id}' not found."}, 404
    except Exception as e:
        return {"error": f"An unexpected error occurred: {str(e)}"}, 500

        

def resolve_refs(schema, all_schemas):
    if not schema:
        return schema

    if "types" in schema:
        resolved_types = []
        for type_entry in schema["types"]:
            if "$ref" in type_entry:
                ref_id = type_entry["$ref"]
                if ref_id in all_schemas:
                    resolved_schema = resolve_refs(all_schemas[ref_id], all_schemas)
                    resolved_type = resolved_schema.get("properties", {})  
                    resolved_types.append({"type": "OBJECT", "properties": resolved_type})
                else:
                    raise ValueError(f"Reference ID '{ref_id}' not found in all_schemas.")
            else:
                resolved_types.append(resolve_refs(type_entry, all_schemas))  
        schema["types"] = resolved_types

    if "properties" in schema:
        for key, value in schema["properties"].items():
            schema["properties"][key] = resolve_refs(value, all_schemas)

    if "templateInputs" in schema:
        schema["templateInputs"] = [resolve_refs(input_entry, all_schemas) for input_entry in schema["templateInputs"]]

    return schema

