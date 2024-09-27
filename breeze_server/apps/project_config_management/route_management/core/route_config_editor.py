from ..utils.utils import *
from apps.common.constants.consts import CONFIG_PATH, CONFIG_FILES_PATH
from apps.common.utils.file_helpers.json_handler import read_project_config_file 
from apps.common.utils.uuid_as_key import generate_uuid_as_key

def get_all_route_full_paths(project_id):
    try:
        """
        Returns a list(or list of objs with ids) of all full paths
        of all routes in the project.
        """
        return get_all_full_paths(project_id=project_id)
    except Exception as e:
        print("Error while getting all full paths")
        print("Error ", e)
        raise e


def add_route_to_config(request, project_id="", _routing_config = {}):
    try:
        print(request)
        route_obj = request
        route_id = route_obj.get('id')
        
        # if id is present then call update method
        if route_id:
            return update_route_in_config(route_obj, project_id, _routing_config)
        
        # check for mandatory values
        check_for_manadatory_route_props(route_obj)
        
        _routing_config = get_routing_config(project_id, _routing_config)
        
        # validate the route path
        validate_route_object(route_obj, project_id, _routing_config)
        
        # add route_obj to the routing_config and return config
        route_id = generate_uuid_as_key()
        route_obj['id'] = route_id
        _routing_config[route_id] = route_obj 
        return {'config': _routing_config}
    except Exception as e:
        print("Error: ", e)
        raise e
  
def get_previous_object_state(route_obj_id, project_id="", routing_config = {}):
    routing_config = get_routing_config(project_id, routing_config)
    prev_obj = routing_config.get(route_obj_id)
    if not prev_obj:
        raise Exception('invalid object id..')
    return prev_obj
      

def update_route_in_config(request, project_id="", _routing_config = {}):
    try:
        print(request)
        route_obj = request
        route_id = route_obj.get('id')
        
        # if id is not present then call add method
        if not route_id:
            return add_route_to_config(route_obj, project_id, _routing_config)
        
        # check for mandatory values
        check_for_manadatory_route_props(route_obj)
        
        _routing_config = get_routing_config(project_id, _routing_config)
            
        # get updated_object's previous state
        prev_obj = get_previous_object_state(route_id, project_id, _routing_config)
        if prev_obj.get('path') == '/' and route_obj != '/':
            raise Exception('default path can\'t be edited..')
        if route_obj.get('parentId', "") != "" and prev_obj == '/':
            raise Exception('default route can\'t have parent routes..')
           
        # if previous parent is different then remove this obj's id from its child 
        if prev_obj.get('parentId', "") != route_obj.get('parentId', ""):
            _routing_config.get(route_obj.get('parentId')).get('children').remove(route_id)
            
            # if parent present then add this id to parents children's array
            if route_obj.get('parentId'):
                _routing_config.get(route_obj.get('parentId')).get('children', []).append(route_id)
        
        # add new route_obj to the routing_config and return config
        _routing_config[route_id] = route_obj 
        return {'config': _routing_config}
    except Exception as e:
        print("Error: ", e)
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