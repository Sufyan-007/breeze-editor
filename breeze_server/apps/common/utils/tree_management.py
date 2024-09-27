
import os,json
from .uuid_as_key import generate_uuid_as_key
from ..constants.consts import CONFIG_PATH,CONFIG_FILES_PATH
from ..constants.enums.tree_type import TreeType 
from ..utils.file_helpers.json_handler import read_project_config_file,write_json_file


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
def get_path(node_id,data,path,route):
    if(data[node_id]['type'] == 'FILE' or len(data[node_id]['children']) == 0):
        path.append(
            {
                "id":node_id,
                "path":route +  data[node_id]['name']
            }
        )
        return
    for child_id in data[node_id]['children']:
        get_path(child_id,data,path, route  + data[node_id]['name']+'/')
    

# this method return node_id and its all children path 
def get_all_path_of_node(project_name,node_id):
    app_config_dir = f"{CONFIG_PATH}/{project_name}"
    config_data = read_project_config_file( app_config_dir, CONFIG_FILES_PATH['DIRECTORY_MANAGEMENT'])
    if(node_id in config_data):
        path = []
        get_path(node_id,config_data,path,'')
        return {node_id:path}
    else:
        return "id not found"
    # pprint.pprint({node_id:path})
    
#this function return all root node 
def get_root_nodes(config_data):
    root_nodes = [] 
    for k,v in config_data.items():
        if v['parent_id'] == None:
            root_nodes.append(v)
    return root_nodes

# add_node("test","directory","139c0099_f26b_4959_be78_cb746760ff5c",name="type3",type='DIRECTORY')
# print(get_root("test"))
# pprint.pprint(get_all_path_of_node("test","18aea09e_651e_4cc5_9a15_ad35b0132800"))