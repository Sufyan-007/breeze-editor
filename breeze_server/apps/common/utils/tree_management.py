
import os,copy
from .uuid_as_key import generate_uuid_as_key
from ..constants.consts import CONFIG_PATH,CONFIG_FILES_PATH
from ..utils.file_helpers.json_handler import read_project_config_file
from ..utils.file_helpers.config_handler import read_config_file

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


#this function will create a new node or add node to target_id node
def add_node( project_name, category, target_id, data):
    config_dir = os.path.join(CONFIG_PATH, project_name)
    if category == "ROUTING_CONFIG":
        config_data_obj = read_config_file(project_name, "routing_config", "routing_config")
        if config_data_obj.get('err'):
            raise Exception(config_data_obj['message'], ": not able to read routing_config..")
        config_data = config_data_obj.get('data')
    else:
        config_data = read_project_config_file(config_dir, CONFIG_FILES_PATH[category])
    if "id" not in data:
        data['id'] = generate_uuid_as_key()
    
    
    # if parent node is none then create new root node
    if(target_id is None or target_id not in config_data):
        data['parentId'] = None
        config_data[data['id']] = data
        return config_data,data['id']
    else:
        data['parentId'] = target_id
        config_data[data['id']] = data
        if not config_data[target_id].get('children'):
            config_data[target_id]['children'] = []
        if not data['id'] in config_data[target_id]['children']:
            config_data[target_id]['children'].append(data['id'])
    
        return config_data, data['id']

def is_target_in_hierarchy(source_id, target_id, data):
    """
    Check if the target node is present in the hierarchy of the source node.

    :param source_id: The ID of the source node (the root of the hierarchy).
    :param target_id: The ID of the target node to check for.
    :param data: The JSON structure (a dictionary) that holds the node information.
    :return: True if the target node is found in the source node's hierarchy, False otherwise.
    """
    # Check if the source node exists
    if source_id not in data:
        return False
    
    # Get the source node
    source_node = data[source_id]
    
    # If the source node itself is the target node, return True
    if source_id == target_id:
        return True
    
    # Check if target_id is in the direct children of the source node
    if 'children' in source_node and target_id in source_node['children']:
        return True
    
    # Recursively check in the children of the source node
    if 'children' in source_node:
        for child_id in source_node['children']:
            if is_target_in_hierarchy(child_id, target_id, data):
                return True
    
    # If the target node is not found in any descendants, return False
    return False


def get_node(project_name,category,target_id,depth=1):
    ## open given category config
    config_dir = os.path.join(CONFIG_PATH, project_name)
    if category.value == "ROUTING_CONFIG":
        config_data_obj = read_config_file(project_name, "routing_config", "routing_config")
        if config_data_obj.get('err'):
            raise Exception(config_data_obj['message'], ": not able to read routing_config..")
        config_data = config_data_obj.get('data')
    else:
        config_data = read_project_config_file(config_dir, CONFIG_FILES_PATH[category.value])
    nodes = []
    ## if target is none then this will give all the root nodes
    if(target_id in [None, ""]):
        root_nodes = get_root_nodes(config_data)
        nodes = [] + root_nodes
        if depth > 1:
            for node in root_nodes:
                nodes += get_children_up_to_depth(node.get("id"), config_data, depth, current_depth=0)
    else:
        node = config_data.get(target_id,None)
        if(node != None):
            if depth == 0:
                return node
            #return all its children node
            nodes = get_children_up_to_depth(node.get("id"), config_data, depth, current_depth=0)
            
        else:
            raise Exception('Id not found')
    return {
        'node':target_id,
        'children':nodes
    }
        
#recursively get all path and stored it into path list
def get_path(node_id,data,route,prop_name,skip_ids=[]):
    paths = []
    if("children" not in data[node_id] or len(data[node_id]['children']) == 0):
        return [{
            "id":node_id,
            "path":route + data[node_id][prop_name]
        }]
        
    if("children" in data[node_id]):
        paths.append({
            "id":node_id,
            "path":route + data[node_id][prop_name]
        })
        route = route + data[node_id][prop_name]
        for child_id in data[node_id]['children']:
            if child_id not in skip_ids:
                paths += get_path(child_id, data, route, prop_name, skip_ids=skip_ids)
    return paths

# this method return node_id and its all children path 
def get_all_path_of_node(project_id,category,node_id,prop_name,skip_ids=[]):
    app_config_dir = f"{CONFIG_PATH}/{project_id}"
    if category.value == "ROUTING_CONFIG":
        config_data_obj = read_config_file(project_id, "routing_config", "routing_config")
        if config_data_obj.get('err'):
            raise Exception(config_data_obj['message'], ": not able to read routing_config..")
        config_data = config_data_obj.get('data')
    else:
        config_data = read_project_config_file(app_config_dir, CONFIG_FILES_PATH[category.value])
    all_paths = []
    ## we need all paths from each and every root node
    if node_id in [None, ""]:
        nodes = get_root_nodes(config_data)
        for node in nodes:
            if(node.get("id") not in skip_ids):
                all_paths += get_path(node.get("id"),config_data,'',prop_name, skip_ids=[])
        
    elif node_id in config_data:
        all_paths += get_path(node_id,config_data,'',prop_name,skip_ids=skip_ids)
    else:
        return "id not found"
    
    return all_paths

    
#this function return all root node 
def get_root_nodes(config_data):
    root_nodes = [] 
    for k,v in config_data.items():
        if v.get('parentId') in [None, ""]:
            root_nodes.append(v)
    return root_nodes

def get_nodes_upper_lineage(node_id, project_name, category, config_data = {}):
    if config_data == {}:
        config_dir = os.path.join(CONFIG_PATH, project_name)
        if category.value == "ROUTING_CONFIG":
            config_data_obj = read_config_file(project_name, "routing_config", "routing_config")
            if config_data_obj.get('err'):
                raise Exception(config_data_obj['message'], ": not able to read routing_config..")
            config_data = config_data_obj.get('data')
        else:
            config_data = read_project_config_file(config_dir, CONFIG_FILES_PATH[category.value])
    node = config_data.get(node_id)
    path = ""
    if node is not None:
        path = node.get('path')
        if node.get('parentId'):
            path = get_nodes_upper_lineage(node.get('parentId'), project_name, category, config_data ) + path
        return path

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

    # Second pass: Update parentId and children fields with new UUIDs
    for old_id, new_id in uuid_mapping.items():
        node = cloned_data[old_id]

        # Update parent_id
        if node.get('parentId') in uuid_mapping:
            node['parentId'] = uuid_mapping[node.get('parentId')]

        # Update children with new UUIDs
        if 'children' in node and isinstance(node['children'], list):
            node['children'] = [uuid_mapping[child_id] for child_id in node['children']]

    # Return the cloned data with updated UUIDs
    return cloned_data



def replace_node(source_id,new_id,data):
    source_data = data[source_id]
    source_data["id"] = new_id
    parent_id = source_data.get('parentId')
    for i in range(len(data[parent_id]["children"])):
        # replace key with new id
        if data[parent_id]["children"][i] == source_id:
            data[parent_id]["children"][i] = new_id

     
    data[new_id] = source_data
    return data


def move_node(source_node, target_id, data):
    """
    Move a source node to become a child of the target node.

    :param source: The source node to move.
    :param target_id: The ID of the target node where the source node will be moved.
    :param data: The JSON structure (a dictionary) representing the nodes.
    :return: None
    """
    # Ensure the source and target nodes exist in the data
    source_id = source_node.get("id")
    if source_id not in data:
        print("Source or target node does not exist.")
        return {
            "err" : True,
            "message" : "Id not found",
            "data": data
        }
    
    old_source_node = data[source_id]
    

    ## make a root
    if target_id in [None, ""]:
        old_parent_id = old_source_node.get("parentId")
        old_parent_node = data[old_parent_id]
        if "children" in old_parent_node:
            old_parent_node.get("children").remove(source_id)

        source_node["parentId"] = None
        data[source_id] = source_node
        
    else:
        old_parent_id = old_source_node.get("parentId")
        if old_parent_id is None:
            pass
        else:
            if old_parent_id in data:
                old_parent_node = data[old_parent_id]
                if 'children' in old_parent_node and source_id in old_parent_node['children']:
                    old_parent_node['children'].remove(source_id)

        target_node = data[target_id]
        if 'children' in target_node:
            target_node['children'].append(source_id)
        else:
            target_node['children'] = [source_id]
        
        source_node['parentId'] = target_id
        data[source_id] = source_node


    return {
            "data" : data,
            "err" : False
        }