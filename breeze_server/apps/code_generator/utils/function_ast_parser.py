# from breeze.apps.editor_api.core.component_config_service import ComponentConfigService
import copy
from .reference_helper import resolve_ref
import apps.code_generator.core.new_component_generator as CompGenerator

from .html_generator import HTMLGenerator


class FunctionParser:
    def __init__(self,projectId=None, resources=[]):
        self.projectId = projectId
        self.resources = copy.deepcopy(resources)
        self.generated_imports = {
            'other':[],
            'components':[],
        }
        self.scope = []
        
    def get_generated_imports(self):
        return self.generated_imports
    
    def generate_statement_code(self,config,key_chaining=[]):
        # if config.get('$ref'):
        #     entityType =config["entityType"]
        #     config = resolve_ref(projectId=self.projectId,entityType=entityType,entityId= config["$ref"],extras=config)
        #     config["type"]= entityType
        if not config.get('type'):
            raise KeyError('type must be defined')
        
        elif config["type"] =="COMPONENT":
            code,tree, imports = CompGenerator.generate_react_component_code(config)
            self.generated_imports["other"].extend(imports.get('other',[]))
            self.generated_imports["components"].extend(imports.get('components',[]))
            return code
        
        elif config["type"] == "BLOCK":
            statements = "\n".join([ self.generate_statement_code(code) for code in config['statements']])
            if config.get("noWrap"):
                return statements
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
            destructured = config.get("destructured",False)
            if destructured:
                variables = [x["name"] for x in config.get("variables") ]
                if config.get("destructureType","OBJECT") == "OBJECT":
                    varName = f"{{ {','.join(variables)} }}"
                else:
                    varName = f"[ {','.join(variables)} ]"                   
            else:
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
            if config.get('elseIf', False):
                for x in config.get('elseIf'):
                    code += f"""else if({self.get_value_code(x["condition"])}) {self.generate_statement_code(x.get('bodyConfig',{}))}"""
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
        
        elif config["type"] == "IMPORT":
            if config.get("importType") == "DEFAULT":
                return f" import {config['importEntity']} from '{config['path']}'"
            elif config.get("importType") == "NAMESPACE":
                return f" import * as {config['importEntity']} from '{config['path']}'"
            else:
                return f"import {{{config['importEntity']}}} from '{config['path']}'"
        
        elif config["type"] == "COMMENT":
            return f" /* {config['text']} */"
        
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
        
    
    def get_resource_by_id(self,ref):
        for resource in self.resources:
            if resource.get("id") == ref:
                return resource
        raise IndexError(f"Resource with id {ref} not found.")
    
    def get_value_code(self,value):
        ref = value.get("$ref")
        type = value.get("type","UNDEFINED")
        if ref:
            pass
        else:
            if type == "STRING":
                return f" '{value['value']}' "
            
            elif type == "NUMERIC" or type == "TOKEN":
                return value["value"]
            
            elif type == "UNDEFINED":
                return "undefined"
            
            elif type == "NULL":
                return "null"
            
            elif type == "BOOLEAN":
                if value["value"] and value["value"]!="false":
                    return "true"
                else:
                    return "false"
            
            elif type == "OBJECT":
                return f"""{{ {",".join([ f" {x} : {self.get_value_code(value['properties'][x])}" for x in value.get("properties") ])}}}"""
            
            elif type == "ARRAY":
                return f"[{', '.join([self.get_value_code(x) for x in value.get('values', [])])}]"

            elif type == "OPERATION":
                return self.get_operation_code(value)
            
            elif type == "FUNCTION" or type == "CALLBACK":
                return self.generate_statement_code(value)
            
            elif type == "CUSTOM":
                return value["value"]

            elif type == "FUNCTION_CALL":
                return self.generate_statement_code(value)
            
            elif type == "CHAINED_FUNCTIONS":
                return self.generate_statement_code(value)
            
            elif type == "Element":
                code = self.generate_html(value)
                return code
        return ""
        
        
    def generate_html(self,config):
        if config.get('elementType',"") == 'CUSTOM':
            tag =config.get("tagName") 
            if tag!=self.config.get('name'):
                if tag not in self.config['imports']['components']:
                    self.config['imports']['components'].append(tag)
                print("ImportExample",self.config['imports']['components'])
        elif config.get('elementType',"") == 'THIRD_PARTY':
            tag = config.get("tagName")
            typeId = config.get("typeId")
            for imports in self.config['imports']['other']:
                if imports.get('typeId',"") == typeId:
                    break
            else:
                imports = {
                    "TYPE": "THIRD_PARTY",
                    "from": config["library"],
                    "import_entity": tag,
                    "import_type": "SINGLE"
                }
                self.config['imports']['other'].append(imports)

                                
        tag_name = config['tagName']
        attributes = config.get('attributes', {})
        children = config.get('children', [])

        attribute_str = ' '.join([f'{self.generate_attribute_code(attr, value)}' for attr, value in attributes.items()])
        attribute_str = attribute_str+f" data-brz-id='{config['id']}'"
        open_tag = f'<{tag_name} {attribute_str}>' if attribute_str else f'<{tag_name}>'
        close_tag = f'</{tag_name}>'

        if not children:
            tree = {
                "type" : "HTML",
                # "statementType" : "NA",
                "code" : f'{open_tag}{close_tag}',
                "id" : config["id"]
            }
            return f'{open_tag}{close_tag}'

        # inner_code_tree = []
        inner_html= []
        for child in children:
            code = self.get_value_code(child)
            inner_html.append(code)
            # inner_code_tree.append(tree)
            
        inner_html = ''.join(inner_html)
        # tree = {
        #     "type" : "HTML",
        #     # "statementType" : "NA",
        #     "code":f'{open_tag}{inner_html}{close_tag}',
        #     "children" : inner_code_tree,
        #     "id" : config["id"]
        # }
        return f'{open_tag}{inner_html}{close_tag}' 
    
    def generate_attribute_code(self,attr,value):
        return f"{attr}={self.get_value_code(value)}"
        
    def get_function_call_code(self,config,disableAwait = False):
        ref = config.get("$ref",None)
        if ref:
            functionConfig = resolve_ref(
                projectId=self.projectId,
                entityType=config.get("functionType","SERVICE"),
                entityId=ref,
                extras=config
            )
            functionName = functionConfig.get("name")
            self.generated_imports["components"].append({
                "import_type":"SINGLE",
                "import_entity":functionName,
                "fileId":config.get("fileId"),
            })
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
        return ", ".join([str(x) for x in param_list])
    
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
        
