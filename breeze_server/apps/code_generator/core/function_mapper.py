
from react import api_client_generator as r_api
from typescript import api_client_generator as  t_api
from react import component_generator as rc_api
from react import component_generator  as tc_api

def mapper(lang,function_name,**args): 
    
    functiona_execution =   {
        "typescript" : 
            {
                "generate_route_code" : t_api.remove_circular_refs,
            },
        "react" :{
                "generate_route_code" : r_api.remove_circular_refs,
            }
    } 
    
    functiona_execution[lang][function_name](**args) 
    


