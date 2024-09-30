import json
import re
from apps.common.constants.consts import CONFIG_FILES_PATH, CONFIG_PATH
from apps.common.utils.file_helpers.json_handler import write_json_file
from apps.code_generator.core.generate_routing_code import get_routing_code

# TODO:

def RouteHandler():
    _app_config = None
    _route_config = None
    _comp_config_index = None

    def initialize(app_config, route_config, comp_config_index):
        nonlocal _app_config
        nonlocal _route_config
        nonlocal _comp_config_index
        _app_config = app_config
        _route_config = route_config
        _comp_config_index = comp_config_index        
      
    
    
    def handle_routing_code(_app_config, _route_config, _comp_config_index):
        
        # get the generated code from code_generator module
        generated_routing_code = get_routing_code(_route_config, _comp_config_index, _app_config)
        return generated_routing_code
    
    return initialize, handle_routing_code
    
    
