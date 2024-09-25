from ..utils.utils import *
from apps.common.constants.consts import CONFIG_PATH, CONFIG_FILES_PATH
from apps.common.utils.file_helpers.json_handler import read_project_config_file 

def config_editor():
    _routing_config = {}
    _routing_helper_data = {}
    
    def initialize(project_name=""):
        try:
            app_config_dir = f"{CONFIG_PATH}/{project_name}"
            
            # this variable is accessible by all the functions
            nonlocal _routing_config
            _routing_config = read_project_config_file(app_config_dir, CONFIG_FILES_PATH['ROUTING_CONFIG'])
        except Exception as e:
            print(f"Error initializing config editor: {e}")
            raise FileNotFoundError(f"either project name, file or directory was missing")

    def add_edit_route(route):
        print(route)
        route_obj = get_config_obj(route, route.get('selectedRoute'), _routing_config, _routing_helper_data)
        print("=============route_obj======================")
        print(route_obj)
        print("=============route_obj======================")
        if not route_obj['component']:
            return {'case': False, 'res': 'error: please select an element!'}
        if route_obj.get('index') and route_obj.get('childRoutes'):
            return {'case': False, 'res': 'error: index routes can\'t have child routes'}
        
        if route.get('selectedRoute') :
            if route_obj.get('parentPath', 'none') != 'none':
                if not route['selectedRoute'].get('parentPath'):
                    return add_edit_base_route(route_obj)
                else:
                    return edit_child_route(route_obj)
            else:
                if route['selectedRoute'].get('parentPath') in [None, "none"]:
                    return add_edit_base_route(route_obj)
                else:
                    return edit_child_route(route_obj)
        else:
            if route_obj.get('parentPath'):
                return add_child_route(route_obj)
            else:
                return add_edit_base_route(route_obj)

    def add_edit_base_route(route_obj):
        print(route_obj)
        if route_obj.get('path'):
            route_obj['path'] = route_obj.get('path').strip()
            route_obj['path'] = "/" + route_obj['path'].strip('/')     
        if route_obj.get('component'):
            route_obj.pop('redirectTo') if route_obj.get('redirectTo') else ''
        elif route_obj.get('redirectTo'):
            route_obj.pop('component') if route_obj.get('component') else ''
        
        if route_obj.get("prevPath"):
            prev_path = route_obj.pop('prevPath', None)
            route_obj.pop('fullPath', None)
            if route_obj.get('newFullParentPath') not in [None, 'none']:
                parent_obj = _routing_config['routes'][route_obj['newFullParentPath']]
                route_obj['parentPath'] = parent_obj['path']
                route_obj['initialParentPath'] = parent_obj['initialParentPath'] if parent_obj.get('initialParentPath') else parent_obj['path']
                new_full_path = route_obj['newFullParentPath'] + route_obj['path']
                prev_full_path = prev_path if route_obj['path'] != prev_path else route_obj['path']
                
                if _routing_config['routes'].get(new_full_path):
                    return {'case': False, 'res': 'error: route with same path already exists'}
                handle_route_path_change_in_child_for_child(
                    route_obj,
                    prev_full_path,
                    new_full_path,
                    _routing_config
                )
                
                set_parent_initial_parent(route_obj, route_obj['initialParentPath'], _routing_config)
                            
                # add this changed route's full path to the new parent's childRoutes Object
                parent_route = _routing_config['routes'][route_obj['newFullParentPath']]
                if 'childRoutes' not in parent_route:
                    parent_route['childRoutes'] = {}
                parent_route['childRoutes'][new_full_path] = {}
                
                if route_obj['path'] != prev_path:
                    del _routing_config["baseRoutes"][prev_path]
                else:
                    del _routing_config["baseRoutes"][route_obj['path']]
                route_obj.pop('newFullParentPath', None)                    
            
            elif route_obj['path'] != prev_path:
                if _routing_config['routes'].get(route_obj['path']):
                    return {'case': False, 'res': 'error: route with same path already exists'}
                # change parent path and initial parent path of all nested childs
                # replace all the parts of childRoute paths consisting prevPath
                handle_route_path_change_in_child(
                    route_obj,
                    prev_path,
                    route_obj["path"],
                    None,
                    route_obj["path"],
                    _routing_config
                )
                
                print("==========route_obj===================")
                print(route_obj)
                _routing_config["baseRoutes"][route_obj['path']] = {}
                del _routing_config["baseRoutes"][prev_path]
                
            else:
                _routing_config["routes"][route_obj['path']] = route_obj        
        else:
            if _routing_config['routes'].get(route_obj['path']):
                return {'case': False, 'res': 'error: route with same path already exists'}
            _routing_config["routes"][route_obj['path']] = route_obj 
            _routing_config["baseRoutes"][route_obj['path']] = {} 
        
        return {'case': True, 'res': { 'config': _routing_config, 'helper_data' : _routing_helper_data}}

    def add_child_route(child_object):
        if route := _routing_config['routes'].get(child_object['fullParentPath']):
            fullParentPath = child_object.pop('fullParentPath', None)
            if child_object.get('component'):
                child_object.pop('redirectTo') if child_object.get('redirectTo') else ''
            elif child_object['redirectTo']: 
                child_object.pop('component') if child_object.get('component') else ''

            child_object['path'] = child_object['path'] if child_object['path'][0]=='/' else '/'+child_object['path']
            child_object['path'] = child_object['path'][:-1] if child_object['path'][-1]=='/' else child_object['path']
            child_object['parentPath'] = route['path']
            child_object['initialParentPath'] = route['initialParentPath'] if route.get('initialParentPath') else route['path']
            full_child_path = fullParentPath + child_object['path']
            
            if _routing_config['routes'].get(full_child_path):
                return {'case': False, 'res': 'error: route with same path already exists'}
            
            child_routes = _routing_config['routes'][fullParentPath].get('childRoutes')
            if child_routes is None:
                child_routes = {}
                _routing_config['routes'][fullParentPath]['childRoutes'] = child_routes
            child_routes[full_child_path] = {}
            
            _routing_config['routes'][full_child_path] = child_object
            
            return {'case': True, 'res' : { 'config': _routing_config, 'helper_data' : _routing_helper_data}}
        return {'case' : False, 'res' : 'No matching parent route was present'}

    def edit_child_route(child_object):
        if child_object.get("prevPath"):
            child_object['path'] = child_object['path'] if child_object['path'][0]=='/' else '/'+child_object['path']
            child_object['path'] = child_object['path'][:-1] if child_object['path'][-1]=='/' else child_object['path']
            if childs_initial_parent_path := _routing_config['routes'][child_object.get('fullParentPath')].get('initialParentPath'):
                child_object['initialParentPath'] = childs_initial_parent_path
            else:
                child_object['initialParentPath'] = child_object.get('fullParentPath')
            
            if child_object.get('newFullParentPath') == 'none':
                if _routing_config['routes'].get(child_object['path']):
                    return {'case': False, 'res': 'error: route with same path already exists'}
                
                _routing_config['baseRoutes'][child_object['path']] = {}
                prev_parent_obj = _routing_config['routes'][child_object['fullParentPath']]
                del prev_parent_obj['childRoutes'][child_object['fullPath']]
                del child_object['parentPath']
                child_object.pop('initialParentPath', None)
                
                handle_route_path_change_in_child_for_child(
                    child_object,
                    child_object['fullPath'],
                    child_object['path'],
                    _routing_config
                )
                
                set_parent_initial_parent(child_object, child_object['path'], _routing_config)
                child_object.pop('newFullParentPath', None)
                    
            elif child_object.get('newFullParentPath') not in [None, child_object['fullParentPath']]:
                
                prev_parent_obj = _routing_config['routes'][child_object['fullParentPath']]
                new_full_path = child_object['newFullParentPath'] + child_object['path']                
                new_parent_obj = _routing_config['routes'][child_object['newFullParentPath']]                
                if 'childRoutes' not in new_parent_obj:
                    new_parent_obj['childRoutes'] = {}
                new_parent_obj['childRoutes'][new_full_path] = prev_parent_obj['childRoutes'][child_object['fullPath']]
                del prev_parent_obj['childRoutes'][child_object['fullPath']]
                
                child_object['parentPath'] = new_parent_obj['path']
                child_object['initialParentPath'] = new_parent_obj['initialParentPath'] if new_parent_obj.get('initialParentPath') else new_parent_obj['path']
                
                if _routing_config['routes'].get(new_full_path):
                    child_object.pop('newFullParentPath', None)
                    return {'case': False, 'res': 'error: route with same path already exists'}
                handle_route_path_change_in_child_for_child(
                    child_object,
                    child_object['fullPath'],
                    new_full_path,
                    _routing_config
                )
                
                set_parent_initial_parent(child_object, child_object['initialParentPath'], _routing_config)
                child_object.pop('newFullParentPath', None)
                
            elif child_object['path'] != child_object['prevPath']:
                new_full_child_path = child_object['fullParentPath'] + child_object['path']
                old_full_child_path = child_object['fullParentPath'] + child_object['prevPath']
                if _routing_config['routes'].get(new_full_child_path):
                    return {'case': False, 'res': 'error: route with same path already exists'}
        
                # change parent path and initial parent path of all nested childs
                # replace all the parts of childRoute paths consisting prevPath
                handle_route_path_change_in_child_for_child(
                    child_object,
                    old_full_child_path,
                    new_full_child_path,
                    _routing_config
                )
                
                parent_object = _routing_config["routes"][child_object['fullParentPath']]
                parent_object.get('childRoutes')[new_full_child_path] = parent_object.get('childRoutes')[old_full_child_path]
                del parent_object.get('childRoutes')[old_full_child_path]                
                
                if child_object.get('childRoutes'):
                    for path in child_object.get('childRoutes').keys():
                        _routing_config["routes"][path]['parentPath'] = child_object["path"]
            else:
                _routing_config["routes"][child_object['fullPath']] = child_object   
            child_object.pop('prevPath', None)
            child_object.pop('fullPath', None)
            child_object.pop('fullParentPath', None)
            child_object.pop('newFullParentPath', None)
            return {'case': True, 'res' : { 'config': _routing_config, 'helper_data' : _routing_helper_data}}
                
        else:
            return {'case' : False, 'res' : 'Invalid data sent'}

    def delete_route(route):
        if route.get('path') == '/':
            return {'case' : False, 'res' : "root path can't be deleted"}
        if route.get('parentPath'):
            return delete_child_route(route)
        else:
            return delete_base_route(route)

    def delete_base_route(route):
        if route['fullPath'] in _routing_config['baseRoutes'].keys() and _routing_config['routes'][route['fullPath']]:
            delete_all_child(route['fullPath'])
            del _routing_config['baseRoutes'][route['fullPath']]
        return {'case': True, 'res' : { 'config': _routing_config, 'helper_data' : _routing_helper_data}}

    def delete_child_route(route):
        full_parent_path = replace_last_instance(route['fullPath'], route['path'], '')
        del _routing_config['routes'][full_parent_path]['childRoutes'][route['fullPath']]
        delete_all_child(route['fullPath'])
        return {'case': True, 'res' : { 'config': _routing_config, 'helper_data' : _routing_helper_data}}

    def delete_all_child(parent_path):
        if _routing_config['routes'][parent_path].get('childRoutes'):
            for path in _routing_config['routes'][parent_path].get('childRoutes').keys():
                delete_all_child(path)
        del _routing_config['routes'][parent_path]
        
    return initialize, add_edit_base_route, add_edit_route, delete_route       