from apps.code_generator.core.generate_routing_code import get_routing_code as routing_code_generator

def get_routing_code(_app_config, _route_config, _comp_config_index):
    
    # get the generated code from code_generator module
    generated_routing_code = routing_code_generator(_route_config, _comp_config_index, _app_config)
    return generated_routing_code
    
    
    
