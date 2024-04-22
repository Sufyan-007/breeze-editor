import json
import os
from common.utils.app_consts import CONFIG_PATH
from ..utils.jsonencoder import EnhancedJSONEncoder

class IntermediateModificationHelper:
    @staticmethod
    def process_api_data(data, filename):
        modified_api = data.get("modified_api")  
        tag = modified_api.get("tags")[0] 
        project_name = 'creator'
        folder_path = f"{CONFIG_PATH}/{project_name}/generated_intermediate_json"
        
        file_path = os.path.join(folder_path, filename)
        if os.path.exists(file_path):
            with open(file_path, "r") as file:
                existing_data = json.load(file)
            uuids = {api['id'] for api in existing_data.values()}  
            if modified_api['id'] not in uuids:  
                print(f"UUID {modified_api['id']} does not exist in {filename}.")
                return (f"UUID {modified_api['id']} does not exist in {filename}.")
            
        if tag != existing_data[modified_api["id"]].get('tags')[0]:
            # Move the modified API to a new file
            new_file_path = os.path.join(folder_path, f"{tag}Service.json")
            if os.path.exists(new_file_path):
                with open(new_file_path, "r") as file:
                    existing_data = json.load(file)
            else:
                existing_data = {}
                
            # Check if the operation ID already exists in the new file
            if modified_api['id'] in existing_data:  
                print(f"API with UUID {modified_api['id']} already exists in {new_file_path}")
                return (f"API with UUID {modified_api['id']} already exists in {new_file_path}")
                
            existing_data[modified_api['id']] = modified_api  
            with open(new_file_path, "w") as file:
                json.dump(existing_data, file, cls=EnhancedJSONEncoder)
            print(f"API {modified_api['id']} moved to {new_file_path}")

            # Remove the modified API from the current file
            file_path = os.path.join(folder_path, filename)
            if os.path.exists(file_path):
                with open(file_path, "r") as file:
                    existing_data = json.load(file)
                if modified_api['id'] in existing_data:  
                    del existing_data[modified_api['id']]  
                with open(file_path, "w") as file:
                    json.dump(existing_data, file, cls=EnhancedJSONEncoder)
                print(f"API {modified_api['id']} removed from {filename}")
            return (f"API {modified_api['id']} moved to {new_file_path} and API {modified_api['id']} removed from {filename}")

        existing_data = {}

        # Load existing data if the file exists
        file_path = os.path.join(folder_path, filename)
        if os.path.exists(file_path):
            with open(file_path, "r") as file:
                existing_data = json.load(file)

        # Remove the existing API with the same operation ID, if any
        if modified_api['id'] in existing_data:  
            del existing_data[modified_api['id']]  

        # Add the modified API to the existing data
        existing_data[modified_api['id']] = modified_api 

        # Write the updated data back to the file
        with open(file_path, "w") as file:
            json.dump(existing_data, file, cls=EnhancedJSONEncoder)

        return (f"Modified API {modified_api['id']} written to {file_path}")

        
        
        
        
        
        
        
        
        
        
        
        