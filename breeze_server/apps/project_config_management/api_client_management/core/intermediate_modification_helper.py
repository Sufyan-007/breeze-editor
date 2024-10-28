import json, os, traceback
from ..utils.append_dict_file import append_to_dict_file
from ....common.utils.uuid_as_key import generate_uuid_as_key
from .api_model_loader import ApiModelLoader
from ....common.constants.consts import CONFIG_PATH, CLIENT_API


def process_api_data(operation, modified_api, filename, project_name, moduleId):
    api_client_index_path = (
        f"{CONFIG_PATH}/{project_name}/{CLIENT_API}/{moduleId}/index.json"
    )
    if operation == "ADD":
        modified_api["id"] = generate_uuid_as_key()

    folder_path = f"{CONFIG_PATH}/{project_name}/{CLIENT_API}/{moduleId}"
    with open(api_client_index_path, "r") as file:
            existing_index_data = json.load(file)
    if not filename:
        filename = generate_uuid_as_key()
        recieved_tag = modified_api.get("tags")
        for key, val in existing_index_data.items():
            if val.get('file') == recieved_tag:
                filename = key
                break
        existing_index_data[filename] = {"file": modified_api["tags"]}
        append_to_dict_file(api_client_index_path, existing_index_data)
        
    

    file_path = os.path.join(folder_path, filename) + ".json"

    try:
        api_model = ApiModelLoader.load_api_model(modified_api)
        api_model_dict = api_model.as_dict()
        resultant_model = {api_model_dict["id"]: api_model_dict}
        tag = modified_api.get("tags", "default")
        if os.path.exists(file_path):
            with open(file_path, "r") as file:
                existing_data = json.load(file)
            if modified_api["id"] in existing_data:
                if tag != existing_data[modified_api["id"]].get("tags", "default"):
                    new_file_id = generate_uuid_as_key()
                    new_file_path = os.path.join(folder_path, f"{new_file_id}.json")
                    for key, val in existing_index_data.items():
                        if val.get('file') == tag:
                            new_file_path = os.path.join(folder_path, f"{key}.json")
                    append_to_dict_file(new_file_path, resultant_model)
                    if modified_api["id"] in existing_data:
                        del existing_data[modified_api["id"]]
                        print(existing_data, "existing data")
                        append_to_dict_file(file_path, existing_data, False)
                else:
                    append_to_dict_file(file_path, resultant_model)
            else:
                append_to_dict_file(file_path, resultant_model)
        else:
            append_to_dict_file(file_path, resultant_model)
    except Exception as e:
        print(traceback.format_exc())
        print("error: ",  str(e))
        raise Exception(str(e))


def add_auth_function(auth_model, appName, moduleId,operation):
    project_name = appName
    folder_path = f"{CONFIG_PATH}/{project_name}/api_client_intermediate_json/swagger_metadata.json"
    json_data = {}
    if operation == "ADD":
        auth_model["id"] = generate_uuid_as_key()
    with open(folder_path) as fp:
        json_data = json.load(fp)
        auth_api_data = json_data[moduleId].get("auth_apis", {})
        auth_api_data[auth_model.get("id")] = auth_model
        json_data[moduleId]["auth_apis"] = auth_api_data
        append_to_dict_file(folder_path, json_data)


def transfer_data_to_auth(filename, id_value, file_path, target_file_path, module_id):
    auth_api_template = {
        "id": "",
        "operation_id": "",
        "tags": "",
        "auth_api_type": "NONE",
        "authentication_type": "NOAUTH",
        "request": {
            "method": "POST",
            "auth": [],
            "headers": [],
            "parameters": [],
            "url": {},
            "body": [],
        },
        "response": [],
        "summary": "",
        "token_store": {},
        "errors": {},
        "is_authentication_api": True,
    }

    if not filename or not id_value:
        return {"error": "Invalid data provided."}

    with open(target_file_path, "r") as file:
        swagger_content = json.load(file)

    current_auth_apis = swagger_content.get(module_id).get("auth_apis", {})

    if not os.path.exists(file_path):
        return {"error": "File not found."}

    with open(file_path, "r+") as file:
        file_data = json.load(file)
        api_info = file_data.get(id_value)

        if not api_info:
            return {"error": "API ID not found."}

        auth_api_template["id"] = api_info["id"]
        auth_api_template["operation_id"] = api_info["operation_id"]
        auth_api_template["request"] = api_info["request"]
        auth_api_template["response"] = api_info["response"]
        auth_api_template["summary"] = api_info["summary"]

        model = ApiModelLoader.load_auth_api_model(auth_api_template)
        model_json = model.as_dict()

        current_auth_apis[model_json["id"]] = model_json
        swagger_content[module_id]["auth_apis"] = current_auth_apis
        append_to_dict_file(target_file_path, swagger_content)
        del file_data[id_value]
        append_to_dict_file(file_path, file_data, False)

        return {"message": "Data transferred successfully."}
