import json,os
from ..utils.append_dict_file import append_to_dict_file
from ....common.utils.uuid_as_key import generate_uuid_as_key


def add_module_helper(swagger_metadata_path, swagger_schema_path, module_name, module_description):
    try:
        swagger_metadata_json_path = f"{swagger_metadata_path}/swagger_metadata.json"
        module_id = generate_uuid_as_key()
        with open(swagger_metadata_json_path) as file:
            swagger_metadata = json.load(file)
        swagger_schema_index_path = f"{swagger_schema_path}/index.json"
        with open(swagger_schema_index_path) as mod_file:
            schema_data = json.load(mod_file)

        for _, value in swagger_metadata.items():
            if value["title"] == module_name:
                return {"message": "Module name should be unique."}
        swagger_metadata[module_id] = {
            "title": module_name,
            "description": module_description,
            "auth_apis": {}
        }
        append_to_dict_file(swagger_metadata_json_path, swagger_metadata)

        schema_file_path = os.path.join(swagger_schema_path,module_id) + ".json"
        with open(schema_file_path, 'w') as schema_file:
            json.dump({}, schema_file)
        for title in schema_data.values():
            if title == module_name:
                return {"message": "Module name should be unique."}
        schema_data[module_id] = module_name
        append_to_dict_file(swagger_schema_index_path, schema_data)

        module_dir_path = os.path.join(swagger_metadata_path, module_id)
        os.makedirs(module_dir_path, exist_ok=True) 
        index_file_path = os.path.join(module_dir_path, "index.json")
        
        with open(index_file_path, 'w') as index_file:
            index_file.write('{}') 

        return {"message": "Module added successfully."}
    
    except Exception as e:
        return {"error": str(e)}


def edit_module_title_helper(swagger_file_path,schema_index_file, module_id, new_title):
    if not os.path.exists(swagger_file_path):
        return {"error": "Module not found"},404
    with open(swagger_file_path, "r") as file:
        swagger_metadata = json.load(file)
    if module_id not in swagger_metadata:
        return {"error": "Module not found"},404
    for id, value in swagger_metadata.items():
        if value["title"] == new_title:
            return {"error": "Module name should be unique"},409
    module_data = swagger_metadata[module_id]
    module_data["title"] = new_title
    swagger_metadata[module_id] = module_data
    append_to_dict_file(swagger_file_path, swagger_metadata)
    
    with open(schema_index_file, "r") as file:
        schema_data = json.load(file)
    schema_data[module_id] = new_title
    append_to_dict_file(schema_index_file, schema_data)
    return {"message": "Module name edited Successfully"},200