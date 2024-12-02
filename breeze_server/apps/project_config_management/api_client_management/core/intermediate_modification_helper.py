import json, os, traceback
from ..utils.append_dict_file import append_to_dict_file
from ....common.utils.uuid_as_key import generate_uuid_as_key
from .api_model_loader import ApiModelLoader
from ....common.constants.consts import CONFIG_PATH, CLIENT_API
from ..consts.module_interceptor_template import MODULE_INTERCEPTOR_CODE
from ..utils.create_token_store import create_token_store
from ....directory_management.core.directory_management_service import DirectoryManager
from ....code_generator.core.api_client_generator import generate_react_service

def process_api_data(operation, modified_api, filename, project_name, moduleId):
    api_client_index_path = (
        f"{CONFIG_PATH}/{project_name}/{CLIENT_API}/{moduleId}/index.json"
    )
    swagger_metadata_path = f"{CONFIG_PATH}/{project_name}/{CLIENT_API}/swagger_metadata.json"
    with open(swagger_metadata_path, "r") as file:
        swagger_metadata = json.load(file)
    security_schemes = swagger_metadata[moduleId].get("security_schemes", {})
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
            is_duplicate = check_for_duplicate_names(modified_api.get("operation_id"),modified_api.get("id"), existing_data=existing_data)
            if is_duplicate:
                return {'error': 'Duplicate Function name'}, 409
            
            if modified_api["id"] in existing_data:
                if tag != existing_data[modified_api["id"]].get("tags"):
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
                        generate_react_service(project_name,filename,"ORDINARY",moduleId,security_schemes, module_name='')
                        return {'message': 'added successfully'}, 200
                    

                else:
                    append_to_dict_file(file_path, resultant_model)
                    generate_react_service(project_name,filename,"ORDINARY",moduleId,security_schemes, module_name='')
                    return {'message': 'added successfully'}, 200
            else:
                append_to_dict_file(file_path, resultant_model)
                generate_react_service(project_name,filename,"ORDINARY",moduleId,security_schemes, module_name='')
                return {'message': 'added successfully'}, 200
        else:
            append_to_dict_file(file_path, resultant_model)
            generate_react_service(project_name,filename,"ORDINARY",moduleId,security_schemes, module_name='')
            return {'message': 'added successfully'}, 200
    except Exception as e:
        print(traceback.format_exc())
        print("error: ",  str(e))
        raise Exception(str(e))


def check_for_duplicate_names(new_name,func_id, existing_data):
    for key, value in existing_data.items():
        if value.get("operation_id")== new_name and value.get("id") != func_id:
            return True
    return False

def add_auth_function(auth_model, appName, moduleId,operation):
    project_name = appName
    folder_path = f"{CONFIG_PATH}/{project_name}/api_client_intermediate_json/swagger_metadata.json"
    json_data = {}
    if operation == "ADD":
        auth_model["id"] = generate_uuid_as_key()
    auth_model["tags"] = "authApis"
    if not auth_model.get("auth_api_type"):
        auth_model["auth_api_type"] = "LOGIN"
    with open(folder_path) as fp:
        json_data = json.load(fp)
        auth_api_data = json_data[moduleId].get("auth_apis", {})
        auth_api_data[auth_model.get("id")] = auth_model
        json_data[moduleId]["auth_apis"] = auth_api_data
        append_to_dict_file(folder_path, json_data)
    #generate the file
    generate_react_service(appName, moduleId+'_auth', "AUTH", moduleId, security_schemes= json_data[moduleId]["security_schemes"], module_name='')
    
    # #generate the interceptors
    # module_interceptor_code = MODULE_INTERCEPTOR_CODE
    # interceptor_file_id = json_data[moduleId]["interceptor_file_id"]
    # auth_interceptor_code,interceptor_id = generate_interceptors_code(json_data[moduleId]["interceptors"], auth_model, json_data[moduleId]["security_schemes"],folder_path,moduleId)    
    # module_interceptor_code = module_interceptor_code.replace('{AUTH_INTERCEPTORS_CODE}',auth_interceptor_code)
    # module_interceptor_code = module_interceptor_code.replace('{AUTH_ERROR_INTERCEPTORS_CODE}', '')
    # directory_manager = DirectoryManager(project_name=project_name)
    # directory_manager.save_file(interceptor_file_id,module_interceptor_code)

    return {'message': 'added successfully'},200




def transfer_data_to_auth(filename, id_value, file_path, target_file_path, module_id, project_id, is_imported=False, replaced_function_id=None):
    auth_api_template = {
        "id": "",
        "operation_id": "",
        "tags": "authApis",
        "auth_api_type": "LOGIN",
        "authentication_type": "BASIC",
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
        "interceptor_id": '',
    }

    if not filename or not id_value:
        return {"error": "Invalid data provided."}, 400

    with open(target_file_path, "r") as file:
        swagger_content = json.load(file)

    current_auth_apis = swagger_content.get(module_id, {}).get("auth_apis", {})
    security_schemes = swagger_content.get(module_id, {}).get("security_schemes", {})
    
    with open(file_path, "r+") as file:
        file_data = json.load(file)
        api_info = file_data.get(id_value)

    if not api_info:
        return {"error": "API ID not found."}, 404

    if is_imported and replaced_function_id:
        # Handle function replacement logic
        replaced_function = current_auth_apis.get(replaced_function_id, {})
        replaced_function["request"] = api_info["request"]
        replaced_function["response"] = api_info["response"]
        
        # Process token store for response
        if api_info.get("response"):
            for idx, res in enumerate(api_info["response"]):
                if "S_200" in res.get("status", ""):
                    schema = res.get("schema", {})
                    if schema and "properties" in schema:
                        replaced_function["response"][idx]["token_store"] = create_token_store(schema["properties"])
        
        current_auth_apis[replaced_function_id] = replaced_function
        swagger_content[module_id]["auth_apis"] = current_auth_apis
        append_to_dict_file(target_file_path, swagger_content)
    
    else:
        # Default to first scheme
        for scheme_info in security_schemes.values():
            auth_api_template["authentication_type"] = scheme_info["scheme"]
            break
        
        auth_api_template["response"] = api_info["response"]

        # Process token store for response
        if api_info.get("response"):
            for idx, res in enumerate(api_info["response"]):
                if "S_200" in res.get("status", ""):
                    schema = res.get("schema", {})
                    if schema and "properties" in schema:
                        auth_api_template["response"][idx]["token_store"] = create_token_store(schema["properties"])
            
        auth_api_template["id"] = api_info["id"]
        auth_api_template["operation_id"] = api_info["operation_id"]
        auth_api_template["request"] = api_info["request"]
        auth_api_template["summary"] = api_info["summary"]

        model = ApiModelLoader.load_auth_api_model(auth_api_template)
        model_json = model.as_dict()

        current_auth_apis[model_json["id"]] = model_json
        swagger_content[module_id]["auth_apis"] = current_auth_apis
        append_to_dict_file(target_file_path, swagger_content)
    
    # Remove the transferred API info from the source file
    del file_data[id_value]
    append_to_dict_file(file_path, file_data, False)

    # Generate the React service
    generate_react_service(project_id, f"{module_id}_auth", "AUTH", module_id, security_schemes={}, module_name='')
    generate_react_service(project_id,filename,"ORDINARY",module_id,security_schemes, module_name='')
    return {"message": "Data transferred successfully."}, 200

