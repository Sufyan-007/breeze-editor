import os 

def create_node_in_react_app(project_path, lineage, name , node_type):
    target_path = os.path.join(project_path, *lineage, name)
    print(target_path,"target path")
    
    if node_type.upper() == "DIRECTORY":
        os.makedirs(target_path, exist_ok=True)
    else:
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        with open(target_path, 'w') as new_file:
            new_file.write("// New file created by AddNode\n")