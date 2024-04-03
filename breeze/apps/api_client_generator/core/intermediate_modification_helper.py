import json
import os
from common.utils.app_consts import CONFIG_PATH
from ..helper_models.encoder import EnhancedJSONEncoder

class IntermediateModificationHelper:
    def process_api_data(data, filename):
        auth_apis = {}
        non_auth_apis = []
        folder_path = f"{CONFIG_PATH}/creator/generated_intermediate_json"

        for api in data.get("intermediate"):
            if api['isAuthenticationApi'] is True:
                    auth_apis[api['operation_id']] = api
        
            else:
                non_auth_apis.append(api)
      

        for api in non_auth_apis:
            if api['request'].get('auth') is not None:
                try:
                    found_login = False
                    found_token = False
                    for auth_id, auth_api in auth_apis.items():
                        if not found_login and auth_api.get('isLogin', False):
                            api['request']['auth']['login_api'] = auth_id
                            found_login = True
                        elif not found_token and auth_api.get('isToken', False):
                            api['request']['auth']['token_api'] = auth_id
                            found_token = True
                        if found_login and found_token:
                            break  
                except Exception as e:
                    print(f"Error processing API {api['operation_id']}: {e}")
                    
            

        with open(os.path.join(folder_path, filename), "w") as file:
            json.dump(non_auth_apis, file, cls=EnhancedJSONEncoder)

        return auth_apis, folder_path


    def update_auth_data(auth_apis, folder_path, auth_filename):
        auth_file_path = os.path.join(folder_path, auth_filename)
        if os.path.exists(auth_file_path):
            with open(auth_file_path, 'r') as auth_file:
                existing_auth_data = json.load(auth_file)
        else:
            existing_auth_data = {}
                
        existing_auth_data.update(auth_apis)
        with open(auth_file_path, "w") as auth_file:
            json.dump(existing_auth_data, auth_file, cls=EnhancedJSONEncoder)
