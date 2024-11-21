from apps.common.utils.tree_management import is_target_in_hierarchy, get_all_path_of_node, move_node, get_nodes_upper_lineage
from apps.common.constants.enums.tree_type import TreeType
from apps.common.constants.enums.ResourceCategory import ResourceCategory
from apps.common.constants.consts import CONFIG_PATH
from apps.common.utils.file_helpers.json_handler import read_json_file
from ..utils.utils import get_routing_config, is_valid_url_path

def get_previous_object_state(route_obj_id, project_id="", routing_config = {}):
    routing_config = get_routing_config(project_id, routing_config)
    prev_obj = routing_config.get(route_obj_id)
    if not prev_obj:
        raise Exception('invalid route id..')
    return prev_obj
      

def check_for_mandatory_route_props(route_obj, project_id):
    if route_obj.get('path'):
        route_obj['path'] = route_obj.get('path').strip()
        route_obj['path'] = "/" + route_obj['path'].strip('/')
    else:
        raise ValueError("path is missing")
    if route_obj.get('path') == '/' and route_obj.get('id') == None:
        raise Exception('default path is already added..')
    if not is_valid_url_path(route_obj.get('path')):
        raise Exception('invalid path provided..')
        
    if route_obj.get('componentId'):
        route_obj.pop('redirectTo') if route_obj.get('redirectTo') else ''
        route_obj['componentId'] = route_obj.get('componentId').strip()
        
        app_config_dir = f"{CONFIG_PATH}/{project_id}"
        comp_index_file = read_json_file(f"{app_config_dir}/{ResourceCategory.COMPONENTS.value}/index")
        if not route_obj['componentId'] in comp_index_file.keys():
            raise ValueError("invalid componentId provided..")
        
    elif route_obj.get('redirectTo'):
        route_obj.pop('componentId') if route_obj.get('componentId') else ''
    else:
        raise ValueError("component or redirectTo is missing")

def validate_route_path(route_obj,target_id, project_id="",skip_ids=[]):
    if target_id:
        routing_config = get_routing_config(project_id)
        parent_obj = routing_config.get(target_id)
        if parent_obj.get('path') == '/':
            target_id = ''
    full_route_paths = get_all_path_of_node(project_id,TreeType["ROUTES"],target_id,'path',skip_ids =skip_ids) 
    route_full_path = '/' + route_obj.get("path").strip('/')
    if 'parentId' in route_obj and route_obj.get('parentId') not in  [None, ""] and target_id:
        route_full_path = get_nodes_upper_lineage(route_obj['parentId'], project_id, TreeType["ROUTES"])+route_full_path
    for full_route_path in full_route_paths:
        if  route_full_path== full_route_path.get("path"):
            raise Exception('route already exists..')
    return True
        

def update_route_in_config(request, project_id="", _routing_config = {}):
    try:
        route_obj = request
        route_id = route_obj.get('id')
        
        _routing_config = get_routing_config(project_id, _routing_config)
            
        # get updated_object's previous state
        prev_obj = get_previous_object_state(route_id, project_id, _routing_config)
        if prev_obj.get('path') == '/' and route_obj.get('path') != '/':
            raise Exception('default route\'s path can\'t be edited..')
        if route_obj.get('parentId', "") and prev_obj.get('path') == '/':
            raise Exception('default route can\'t have parent routes..')
           
        
        ## if parent node is in the hierarchy of the child node then it is invalid
        if(is_target_in_hierarchy(source_id=route_id,target_id=route_obj.get("parentId"),data=_routing_config)):
            raise Exception("Parent cant be in child's lineage") 
        
        if validate_route_path(route_obj,route_obj.get("parentId"), project_id, skip_ids=[route_obj.get("id")]) is True:
            new_parent_id = route_obj.get("parentId", "")
            old_parent_id = prev_obj.get('parentId', "")
            if new_parent_id != old_parent_id:
                modified_route_config = move_node(route_obj, new_parent_id, _routing_config)
                if modified_route_config.get('err'):
                    raise Exception('invalid route id..')
                return {'config': modified_route_config.get("data")}
            else:
                _routing_config[route_obj.get("id")] = route_obj
                return {'config': _routing_config}
                
                
    except Exception as e:
        print("Error: ", e)
        import traceback 
        print(traceback.format_exc())
        raise e
   
def delete_all_child(route_id, project_id="", routing_config = {}):
    routing_config = get_routing_config(project_id, routing_config)
    for child_id in routing_config[route_id].get('children', []):
        delete_all_child(child_id, routing_config = routing_config)
    del routing_config[route_id]


def delete_route(route_id, project_id="", _routing_config = {}):
    _routing_config = get_routing_config(project_id, _routing_config)
    # remove its id from children of its parent
    # remove all the objects that are its child and their childs as well 
    try:
        if _routing_config.get(route_id):
            route_obj = _routing_config[route_id]
            if route_obj.get('path') == '/':
                raise Exception('can\'t delete default route..')
            if _routing_config.get(route_obj.get('parentId', ""), None):
                _routing_config.get(route_obj.get('parentId')).get('children').remove(route_id)
            delete_all_child(route_id, project_id, _routing_config)
            return {'config': _routing_config}
        else:
            raise Exception('invalid route id..')
    except Exception as e:
        print("Error: ", e)
        raise e