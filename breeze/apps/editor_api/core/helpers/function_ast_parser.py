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
    
    def generate_statement_code(self,config):
        
        if not config.get('type'):
            return ""
        
        
        elif config["type"] == "BLOCK":
            statements = "\n".join([ self.generate_statement_code(code) for code in config['statements']])
            return f"""{{ 
                {statements}
            }}"""
        
        elif config['type'].upper() == "FUNCTION":
            func_name = ""
            if not config.get('isAnonymous'):
                func_name = f"const {config['name']} = "
            
            return f"""{func_name} {"" if config.get('isAsync') is not True else "async"} ( {", ".join([
                    self.get_function_param(p) for p in config.get("parameters",[])
                ])} ) => {self.generate_statement_code(config.get('bodyConfig',{}))}"""
        
        
        elif config["type"] == "DECLARATION":
            declaration_type = config.get("declarationType","const") 
            varName = config["varName"]
            if declaration_type == "const" or config.get("value",False):
                value = self.get_value_code(config["value"])
                return f"""{declaration_type} {varName} = {value}"""
            else:
                return f"""{declaration_type} {varName} """
            
        elif config["type"] == "ASSIGNMENT": 
            varName = config["varName"]
            value = self.get_value_code(config["value"])
            return f"""{varName} = {value}"""
        
        
        
        elif config['type'] == "FUNCTION_CALL":
            return self.get_function_call_code(config)
        elif config['type']== "CHAINED_FUNCTIONS":
            function_calls = [ self.get_function_call_code(func,True) for func in config["functions"] ]
            isAwaited = ""
            if config.get("isAwaited", False):
                isAwaited = "await "
            return isAwaited+".".join(function_calls)
        
        elif config['type'] == "CUSTOM":
            return config.get("body","")
        
        elif config['type'] == "IF_BLOCK":
            code = f""" if ({self.get_value_code(config["condition"])}) {self.generate_statement_code(config.get('bodyConfig',{}))} 
            """
            if config.get('elseBody', False):
                code += f"""else  {self.generate_statement_code(config.get('elseBody',{}))}
            """
            return code
        
        elif config['type'] == "FOR_BLOCK":
            if config.get('loopType', "STANDARD") == "STANDARD":
                initializer = self.generate_statement_code(config["initializer"])
                configiton = self.generate_statement_code(config["initializer"])
                
            else:
                iterator = f"""{config["iterator"].get("declarationType","const ")} {config["iterator"]["name"]}"""
                iterate = "in" if config.get('loopType')=="FOR_IN" else "of"
                iterable = self.get_value_code(config["iterable"])
                return f""" for ( {iterator} {iterate} {iterable})
                    {self.generate_statement_code(config.get('bodyConfig'))}
                """
            pass
        
        elif config['type'] == 'TRY_CATCH':
            tryBody = f"""try {self.generate_statement_code(config["tryBody"])}"""
            catchBody = f"""catch (err) {self.generate_statement_code(config["catchBody"])}"""
            
            finallyBody = ""
            if config.get('finallyBody'):
                finallyBody = f"""finally {self.generate_statement_code(config["finallyBody"])}"""
            
            return " ".join([tryBody,catchBody,finallyBody])
        
        elif config['type'] == "WHILE_BLOCK":
            return f""" while ({self.get_value_code(config["condition"])}) {self.generate_statement_code(config.get('bodyConfig',{}))} 
        """
        
        elif config['type'] == "DO_WHILE_BLOCK":
            return f"""do  {self.generate_statement_code(config.get('bodyConfig',{}))} while ({self.get_value_code(config["condition"])}) 
        """
        
        
        elif config['type'] == "RETURN":
            return f""" return {self.get_value_code(config.get("value",{}))}
        """
        
        elif config["type"] == "OPERATION":
            return f" {self.get_operation_code(config)} "
        
        return ""
        
    def get_condition(self,config):
        return "true"
    
    
    def get_function_param(self,param):
        if param.get('type',"ANY") != "OBJECT" or not param.get('properties',False) or not param.get("destructured",False) :
            return param["name"]
        else:
            return f"""{{ {", ".join([
                self.get_function_param(p) for p in param["properties"]
                ])} }}"""
        
    
    def get_value_code(self,value):
        ref = value.get("$ref")
        type = value.get("type")
        if ref:
            return RESOURCES[ref]["name"]
        else:
            if type == "STRING":
                return f" '{value['value']}' "
            
            if type == "NUMERIC" or type == "TOKEN":
                return value["value"]
            
            if type == "OBJECT":
                return f"""{{ {",".join([ f" {x} : {self.get_value_code(value['properties'][x])}" for x in value.get("properties") ])}}}"""

            if type == "OPERATION":
                return self.get_operation_code(value)
            
            if type == "FUNCTION":
                return self.generate_statement_code(value)
            
            if type == "CUSTOM":
                return value["value"]

            if type == "FUNCTION_CALL":
                return self.generate_statement_code(value)
            
            if type == "CHAINED_FUNCTIONS":
                return self.generate_statement_code(value)

        return ""
        
    def get_function_call_code(self,config,disableAwait = False):
        callType = config.get("callType", "SIMPLE")
        if callType == "SIMPLE":
            ref = config.get("$ref",None)
            if ref:
                functionName = RESOURCES[config["$ref"]]["functionName"]
            else:
                functionName = config['functionName']
            isAwait = ""
            if config.get("isAwaited") and not disableAwait:
                isAwait = "await "
            return f"""{isAwait}{functionName}({self.get_parameter_mapping(config)})
            """
        
        
    def get_parameter_mapping(self,config):
        param_list =[]
        for param in config.get("parameters",[]):
            param_list.append(self.get_value_code(param))
        return ", ".join(param_list)
    
    def get_operation_code(self,config):
        if config["operationType"] == "UNARY":
            return f" {config['operation']}{self.get_operand_code(config['operand'] )}"

        elif config["operationType"] == "BINARY":
            operand1 = self.get_operand_code(config['operand1'] )
            operand2 = self.get_operand_code(config['operand2'] )
            return f" {operand1}{config['operation']}{operand2} "
            
        
        elif config["operationType"] == "TERNARY":
            operand1 = self.get_operand_code(config['operand1'] )
            operand2 = self.get_operand_code(config['operand2'] )
            operand3 = self.get_operand_code(config['operand3'] )
            return f" {operand1} ? {operand2} : {operand3} "
            
    def get_operand_code(self, operand):
        if operand.get("type") == "OPERATION":
            return f" ( {self.get_value_code(operand )} ) "
        else:
            return self.get_value_code(operand)
        