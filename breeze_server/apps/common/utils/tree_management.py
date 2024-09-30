
import os,copy
from .uuid_as_key import generate_uuid_as_key
from ..constants.consts import CONFIG_PATH,CONFIG_FILES_PATH
from ..constants.enums.tree_type import TreeType 
from ..utils.file_helpers.json_handler import read_project_config_file


def get_children_up_to_depth(node_id, data, depth, current_depth=0):
    """
    Get all the children of a node up to a given depth.

    :param node_id: The ID of the node to start from.
    :param data: The JSON structure (a dictionary) that holds the node information.
    :param depth: The maximum depth to traverse.
    :param current_depth: The current depth of recursion (used internally).
    :return: A list of node details up to the given depth.
    """
    # Base case: if we've reached the maximum depth, stop the recursion
    if current_depth >= depth:
        return []

    # Get the node from the data
    node = data.get(node_id)

    # If node doesn't exist, return an empty list
    if node is None:
        return []

    # Initialize the result list with the current node
    result = []

    # Recursively get the children if we haven't reached the max depth
    if 'children' in node:
        for child_id in node['children']:
            result.append(data.get(child_id))
            result += get_children_up_to_depth(child_id, data, depth, current_depth + 1)

    return result


## passed        
def generate_node_structure(data):    
    data["id"] = generate_uuid_as_key()
    data["children"] = []


#this run when category is route
def compare_node_by_name(project_name,config_data,data,target_id):
    if(target_id == None):
        root_node = get_root(project_name)
        list_of_root_name_id_dict = get_root(project_name)
        for d in list_of_root_name_id_dict:
            for name,id in d.items():
                if config_data[id]['name'] == data['name']:
                    return True
        return False
    
    for child in config_data[target_id]['children']:
        if config_data[child]['name'] == data['name']:
            return True
    return False


#this run when category is directory
def compare_node_by_name_and_type(project_name,config_data,data,target_id):
    if(target_id == None):
        list_of_root_name_id_dict = get_root(project_name)
        for d in list_of_root_name_id_dict:
            for name,id in d.items():
                if config_data[id]['name'] == data['name'] and config_data[id]['type'] == data['type']:
                    return True
        return False
    for child in config_data[target_id]['children']:
        if config_data[child]['name'] == data['name'] and config_data[child]['type'] == data['type']:
            return True
    return False


#this will check is given node's name and type are already present or not
def is_same_node_name_already_present(project_name,data,target_id,config_data,category):
    
   if(category == TreeType.ROUTES.value):
       return compare_node_by_name(project_name,config_data,data,target_id)
   else:
       return compare_node_by_name_and_type(project_name,config_data,data,target_id)


#this function will create a new node or add node to target_id node
def add_node(project_name,category,target_id,**data):
    config_dir = os.path.join(CONFIG_PATH, project_name)
    config_data = read_project_config_file(config_dir, CONFIG_FILES_PATH[category])
    
    ## if parent node is none then create new root node
    if(not target_id in config_data or target_id == None):
        if(is_same_node_name_already_present(project_name,data,target_id,config_data,category)):
            return "node name is already exist"
        generate_node_structure(data)
        data['parent_id'] = None
        config_data[data['id']] = data
    else:
        if(category == TreeType.DIRECTORY):
            if(config_data[target_id]['type'] == 'FILE'):
                return "parent is not a directory"
        if(is_same_node_name_already_present(project_name,data,target_id,config_data,category)):
                return "node name is already exist"
        else:
            generate_node_structure(data)
            data['parent_id'] = target_id
            config_data[data['id']] = data
            config_data[target_id]['children'].append(data['id'])
    
    return config_data


def get_node(project_name,category,target_id,depth=1):
    ## open given category config
    config_dir = os.path.join(CONFIG_PATH, project_name)
    config_data = read_project_config_file(config_dir, CONFIG_FILES_PATH[category.value])
    nodes = []
    ## if target is none then this will give all the root nodes
    if(target_id == None):
        nodes = get_root_nodes(config_data)
    else:
        node = config_data.get(target_id,None)
        if(node != None):
            #return all its children node
            nodes = get_children_up_to_depth(node.get("id"), config_data, depth, current_depth=0)
            
        else:
            print("Id not found")
    return {
        'node':target_id,
        'children':nodes
    }
        
#recursively get all path and stored it into path list
def get_path(node_id,data,route):
    paths = []
    if("children" not in data[node_id] or len(data[node_id]['children']) == 0):
        return [{
            "id":node_id,
            "path":route + data[node_id]['name']
        }]
        
    if("children" in data[node_id]):
        for child_id in data[node_id]['children']:
            paths += get_path(child_id,data, route + data[node_id]['name']+'/')
    return paths

# this method return node_id and its all children path 
def get_all_path_of_node(project_id,category,node_id):
    app_config_dir = f"{CONFIG_PATH}/{project_id}"
    config_data = read_project_config_file(app_config_dir, CONFIG_FILES_PATH[category.value])
    all_paths = []
    ## we need all paths from each and every root node
    if node_id is None:
        nodes = get_root_nodes(config_data)
        for node in nodes:
            all_paths += get_path(node.get("id"),config_data,'')
        
    elif node_id in config_data:
        all_paths += get_path(node_id,config_data,'')
    else:
        return "id not found"
    
    return all_paths

    
#this function return all root node 
def get_root_nodes(config_data):
    root_nodes = [] 
    for k,v in config_data.items():
        if v['parent_id'] == None:
            root_nodes.append(v)
    return root_nodes



def clone_with_new_uuid(data):
    """
    Clone the entire JSON structure with new UUIDs for each node.

    :param data: The JSON structure (a dictionary) to clone.
    :return: A new JSON structure with all nodes having new UUIDs.
    """
    # Dictionary to map old UUIDs to new UUIDs
    uuid_mapping = {}

    # First pass: Create a new UUID for each node and store in the uuid_mapping
    cloned_data = copy.deepcopy(data)  # Deep copy to avoid modifying the original data
    for old_id in cloned_data:
        new_id = generate_uuid_as_key()  # Generate a new UUID
        uuid_mapping[old_id] = new_id
        cloned_data[old_id]['id'] = new_id  # Update the 'id' with the new UUID

    # Second pass: Update parent_id and children fields with new UUIDs
    for old_id, new_id in uuid_mapping.items():
        node = cloned_data[old_id]

        # Update parent_id
        if node['parent_id'] in uuid_mapping:
            node['parent_id'] = uuid_mapping[node['parent_id']]

        # Update children with new UUIDs
        if 'children' in node and isinstance(node['children'], list):
            node['children'] = [uuid_mapping[child_id] for child_id in node['children']]

    # Return the cloned data with updated UUIDs
    return cloned_data



def move_node(source_id, target_id, data):
    """
    Move a source node to become a child of the target node.

    :param source_id: The ID of the source node to move.
    :param target_id: The ID of the target node where the source node will be moved.
    :param data: The JSON structure (a dictionary) representing the nodes.
    :return: None
    """
    # Ensure the source and target nodes exist in the data
    if source_id not in data or target_id not in data:
        print("Source or target node does not exist.")
        return
    
    source_node = data[source_id]
    target_node = data[target_id]

    # Find the current parent of the source node and remove the source from its children
    current_parent_id = source_node['parent_id']
    if current_parent_id != "null" and current_parent_id in data:
        current_parent = data[current_parent_id]
        if 'children' in current_parent and source_id in current_parent['children']:
            current_parent['children'].remove(source_id)

    # Update the source node's parent_id to the target node's ID
    source_node['parent_id'] = target_id

    # Add the source node to the target node's children list
    if 'children' in target_node:
        target_node['children'].append(source_id)
    else:
        target_node['children'] = [source_id]

    return data