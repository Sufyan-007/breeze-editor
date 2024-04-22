import json
from ..utils.jsonencoder import EnhancedJSONEncoder

def append_to_dict_file(filepath,content):
    json_data = {}
    try:
        ## check if file exists then append 
        with open(filepath) as fp:
            json_data = json.load(fp)
            ## append to existing json data 
            for key,obj in content.items():
                json_data[key] = obj
            
            ## write all data back to file
            with open(filepath, "w") as file:
                json.dump(json_data,file, cls=EnhancedJSONEncoder)
    
    ## if not present then create and add
    except FileNotFoundError as e:
        with open(filepath, "w") as file:
            for key,obj in content.items():
                json_data[key] = obj
            
            json.dump(json_data, file, cls=EnhancedJSONEncoder)
    return json_data
                
    