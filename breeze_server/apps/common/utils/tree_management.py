
import os,uuid,pprint,json
from ..constants.consts import CONFIG_PATH,CONFIG_FILES_PATH
# from common.constants.consts import CONFIG_PATH,CONFIG_FILES_PATH
from ..utils.file_helpers.json_handler import read_project_config_file,write_json_file



def generate_id():
    id  = str(uuid.uuid4())
    return id.replace("-", "_")


#recursively get all children
def get_child(target_id,depth,childrens,config_data):
    if(depth == 0):
        return 
    if(config_data[target_id]['type'] != 'FILE' ):
        for child in config_data[target_id]['children']:
            childrens.append(config_data[child])
            get_child(child,depth-1,childrens,config_data)
        
        
def generate_node_structure(data):
    
    data["id"] = generate_id()
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
    
   if(category == 'route'):
       return compare_node_by_name(project_name,config_data,data,target_id)
   else:
       return compare_node_by_name_and_type(project_name,config_data,data,target_id)

#this function will create a new node or add node to target_id node
def add_node(project_name,category,target_id,**data):
    config_dir = os.path.join(CONFIG_PATH, project_name)
    config_data = read_project_config_file(config_dir, CONFIG_FILES_PATH['DIRECTORY_MANAGEMENT'])
    
    if(not target_id in config_data or target_id == None):
        if(is_same_node_name_already_present(project_name,data,target_id,config_data,category)):
            print("node name is already exist")
            return "node name is already exist"
        generate_node_structure(data)
        data['parent_id'] = None
        config_data[data['id']] = data
        print(config_data[data['id']])
    else:
        if(category == 'directory'):
            if(config_data[target_id]['type'] == 'FILE'):
                return "parent is not a directory"
        if(is_same_node_name_already_present(project_name,data,target_id,config_data,category)):
                return "node name is already exist"
        else:
            generate_node_structure(data)
            data['parent_id'] = target_id
            config_data[data['id']] = data
            config_data[target_id]['children'].append(data['id'])
    if(category == 'directory'):
        with open(os.path.join(config_dir, CONFIG_FILES_PATH['DIRECTORY_MANAGEMENT'])+'.json','w') as file:
            json.dump(config_data,file,indent=2)

    return config_data
# For category = 'directory'
# this functions return node and its children at level 1
def get_node(project_name,category,target_id,depth=1):
    config_dir = os.path.join(CONFIG_PATH, project_name)
    config_data = read_project_config_file(config_dir, CONFIG_FILES_PATH['DIRECTORY_MANAGEMENT'])
    
    node = config_data.get(target_id,None)
    if(node != None):
        #return all its chldren node
        childrens = []
        get_child(target_id,depth,childrens,config_data)
        return {
            'node':node,
            'childrens':childrens
        }
    else:
        print("Id not found")
        
        
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
    
#for category = 'route'
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
def get_root(project_name):
    app_config_dir = f"{CONFIG_PATH}/{project_name}"
    config_data = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['DIRECTORY_MANAGEMENT'])
    root_node = [{v['name']:k} for k,v in config_data.items() if v['parent_id'] == None]
    return root_node

# add_node("test","directory","139c0099_f26b_4959_be78_cb746760ff5c",name="type3",type='DIRECTORY')
# print(get_root("test"))
# pprint.pprint(get_all_path_of_node("test","18aea09e_651e_4cc5_9a15_ad35b0132800"))