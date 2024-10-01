from ..utils.utils import *
from apps.common.utils.tree_management import is_target_in_hierarchy,get_all_path_of_node,move_node
from apps.common.constants.enums.tree_type import TreeType


def get_previous_object_state(route_obj_id, project_id="", routing_config = {}):
    routing_config = get_routing_config(project_id, routing_config)
    prev_obj = routing_config.get(route_obj_id)
    if not prev_obj:
        raise Exception('invalid object id..')
    return prev_obj
      

def check_for_mandatory_route_props(route_obj):
    if route_obj.get('path'):
        route_obj['path'] = route_obj.get('path').strip()
        route_obj['path'] = "/" + route_obj['path'].strip('/')
    else:
        raise ValueError("path is missing")
    if route_obj.get('componentId'):
        route_obj.pop('redirectTo') if route_obj.get('redirectTo') else ''
        route_obj['componentId'] = route_obj.get('componentId').strip()
    elif route_obj.get('redirectTo'):
        route_obj.pop('componentId') if route_obj.get('componentId') else ''
    else:
        raise ValueError("component or redirectTo is missing")


def validate_route_path(route_obj,target_id, project_id="",skip_ids=[]):
    full_route_paths = get_all_path_of_node(project_id,TreeType["ROUTES"],target_id,'path',skip_ids =skip_ids) 
    for full_route_path in full_route_paths:
        if route_obj.get("path") in full_route_path.get("path"):
            raise Exception('route already exists..')
    return True
        

def update_route_in_config(request, project_id="", _routing_config = {}):
    try:
        route_obj = request
        route_id = route_obj.get('id')
        
        _routing_config = get_routing_config(project_id, _routing_config)
            
        # get updated_object's previous state
        prev_obj = get_previous_object_state(route_id, project_id, _routing_config)
        if prev_obj.get('path') == '/' and route_obj != '/':
            raise Exception('default path can\'t be edited..')
        if route_obj.get('parentId', "") != "" and prev_obj == '/':
            raise Exception('default route can\'t have parent routes..')
           
        
        ## if parent node is in the hierarchy of the child node then it is invalid
        if(is_target_in_hierarchy(source_id=route_id,target_id=route_obj.get("parent_id"),data=_routing_config)):
            raise Exception("Parent id cant be in child's lineage") 
        
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