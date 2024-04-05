import json
import os,shutil
from common.utils.app_consts import CONFIG_PATH
from ..helper_models.encoder import EnhancedJSONEncoder

class IntermediateModificationHelper:
    @staticmethod
    def process_api_data(data, filename):
        modified_api = data.get("modified_api")
        tag = filename[:-len("Service.json")] 
        project_name = 'creator'
        folder_path = f"{CONFIG_PATH}/{project_name}/generated_intermediate_json"
        
        file_path = os.path.join(folder_path, filename)
        if os.path.exists(file_path):
            with open(file_path, "r") as file:
                existing_data = json.load(file)
            uuids = {api['uuid'] for api in existing_data}
            if modified_api['uuid'] not in uuids:
                print(f"UUID {modified_api['uuid']} does not exist in {filename}.")
                return (f"UUID {modified_api['uuid']} does not exist in {filename}.")
            
        if tag != modified_api.get('tags')[0]:
            # Move the modified API to a new file
            new_file_path = os.path.join(folder_path, f"{modified_api['tags'][0]}Service.json")
            if os.path.exists(new_file_path):
                with open(new_file_path, "r") as file:
                    existing_data = json.load(file)
            else:
                existing_data = []
                
            # Check if the operation ID already exists in the new file
            for api in existing_data:
                if api['uuid'] == modified_api['uuid']:
                    print(f"API with UUID {modified_api['uuid']} already exists in {new_file_path}")
                    return (f"API with UUID {modified_api['uuid']} already exists in {new_file_path}")
                
            existing_data.append(modified_api)
            with open(new_file_path, "w") as file:
                json.dump(existing_data, file, cls=EnhancedJSONEncoder)
            print(f"API {modified_api['uuid']} moved to {new_file_path}")

            # Remove the modified API from the current file
            file_path = os.path.join(folder_path, filename)
            if os.path.exists(file_path):
                with open(file_path, "r") as file:
                    existing_data = json.load(file)
                for index, api in enumerate(existing_data):
                    if api['uuid'] == modified_api['uuid']:
                        del existing_data[index]
                        break
                with open(file_path, "w") as file:
                    json.dump(existing_data, file, cls=EnhancedJSONEncoder)
                print(f"API {modified_api['uuid']} removed from {filename}")
            return (f"API {modified_api['uuid']} moved to {new_file_path} and API {modified_api['uuid']} removed from {filename}")

        existing_data = []

        # Load existing data if the file exists
        file_path = os.path.join(folder_path, filename)
        if os.path.exists(file_path):
            with open(file_path, "r") as file:
                existing_data = json.load(file)

        # Remove the existing API with the same operation ID, if any
        existing_data = [api for api in existing_data if api['uuid'] != modified_api['uuid']]

        # Add the modified API to the existing data
        existing_data.append(modified_api)

        # Write the updated data back to the file
        with open(file_path, "w") as file:
            json.dump(existing_data, file, cls=EnhancedJSONEncoder)

        return (f"Modified API {modified_api['uuid']} written to {file_path}")
        
        
        
        
        
        
        
        
        
        
        
        