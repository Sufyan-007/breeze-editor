from .function_helper_consts import OPERATION_TYPES 
RESOURCES={
    "STATE/UUID1":{
        "name":"xyz"
    },
    "SERVICE/UUID1":{
        "functionName":"createUser"
    }
}

class FunctionParser:
    def __init__(self):
        pass
    
    def generate_function_code(self,config):
        
        if not config.get('type'):
            return ""
        
        
        elif config["type"] == "BLOCK":
            statements = "\n".join([ self.generate_function_code(code) for code in config['statements']])
            return f"""{{ 
                {statements}
            }}"""
        
        elif config['type'] == "FUNCTION":
            func_name = ""
            if not config.get('isAnonymous'):
                func_name = f"const {config['name']} = "
            
            return f"""{func_name} {"" if config.get('isAsync') is not True else "async"} ({self.get_function_params()}) => {self.generate_function_code(config.get('bodyConfig',{}))}"""
        elif config["type"] == "DECLARATION":
            declaration_type = config.get("DECLARATION_TYPE","const") 
            varName = config["varName"]
            value = self.get_value_code(config["value"])
            return f"""{declaration_type} {varName} = {value}"""
        
        elif config['type'] == "FUNCTION_CALL":
            return self.get_function_call_code(config)
        
        elif config['type'] == "CUSTOM":
            return config.get("body","")
        
        elif config['type'] == "IF_BLOCK":
            code = f""" if ({self.get_value_code(config["condition"])}) {self.generate_function_code(config.get('bodyConfig',{}))} 
            """
            if config.get('elseBody', False):
                code += f"""else  {self.generate_function_code(config.get('bodyConfig',{}))}
            """
            return code
        
        
        elif config['type'] == "WHILE_BLOCK":
            return f""" while ({self.get_value_code(config["condition"])}) {self.generate_function_code(config.get('bodyConfig',{}))} 
        """
        
        elif config['type'] == "RETURN":
            return f""" return {self.get_value_code(config.get("value",{}))}
        """
        
        elif config["type"] == "OPERATION":
            return f" {self.get_operation_code(config)} "
        
        return ""
        
    def get_condition(self,config):
        return "true"
    
    
    def get_function_params(self):
        return ""
    
    def get_value_code(self,value):
        ref = value.get("$ref")
        type = value.get("type")
        if ref:
            return RESOURCES[ref]["name"]
        else:
            if type == "STRING":
                return f" '{value['value']}' "
            
            if type == "NUMERIC":
                return value["value"]
            
            if type == "OBJECT":
                return f"""{{ {",".join([ f" {x} : {self.get_value_code(value['properties'][x])}" for x in value.get("properties") ])}}}"""

            if type == "OPERATION":
                return self.get_operation_code(value)
            
            if type == "FUNCTION":
                return self.generate_function_code(value)
            
        return ""
        
    def get_function_call_code(self,config):
        callType = config.get("callType", "SIMPLE")
        
        if callType == "SIMPLE":
            ref = config.get("$ref",None)
            if ref:
                functionName = RESOURCES[config["$ref"]]["functionName"]
            else:
                functionName = config['functionName']
            return f"""{functionName}({self.get_parameter_mapping(config)})
            """
        elif callType== "CHAINED":
            function_calls = [ self.get_function_call_code(func) for func in config["functions"] ]
            return ".".join(function_calls)
        
    def get_parameter_mapping(self,config):
        param_list =[]
        for param in config.get("parameters",[]):
            param_list.append(self.get_value_code(param))
        return ", ".join(param_list)
    
    def get_operation_code(self,config):
        if config["operationType"] == "UNARY":
            operand = f" ( {self.get_value_code(config['operand'] )} ) "
            return f" {config['operation']} {operand} "

        elif config["operationType"] == "BINARY":
            operand1 = f" ( {self.get_value_code(config['operand1'] )} ) "
            operand2 = f" ( {self.get_value_code(config['operand2'] )} ) "
            return f" {operand1} {config['operation']} {operand2} "
            return
        
        elif config["operationType"] == "TERNARY":
            pass
        
        