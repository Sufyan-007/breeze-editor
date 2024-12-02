# from breeze.apps.editor_api.core.component_config_service import ComponentConfigService
import copy

from apps.common.utils.uuid_as_key import generate_uuid_as_key
from .reference_helper import resolve_ref
import apps.code_generator.core.new_component_generator as CompGenerator
from .html_generator import HTMLGenerator


class FunctionParser:
    def __init__(self,projectId=None, resources=[],meta_config={}):
        self.projectId = projectId
        self.resources = copy.deepcopy(resources)
        self.generated_imports = {
            'other':[],
            'components':[],
        }
        self.meta_config = meta_config
        self.scope = []
        
    def get_generated_imports(self):
        return self.generated_imports
    
    def get_meta_config(self):
        return self.meta_config
    
    def generate_statement_code(self,config,key_chaining=[]):
        # if config.get('$ref'):
        #     entityType =config["entityType"]
        #     config = resolve_ref(projectId=self.projectId,entityType=entityType,entityId= config["$ref"],extras=config)
        #     config["type"]= entityType
        if not config.get('type'):
            raise KeyError('type must be defined')
        
        statement_id = config.get("id")
        if not statement_id:
            statement_id = generate_uuid_as_key()
            config["id"] = statement_id
        
        conf = {
            "index": "<>".join([str(x) for x in key_chaining]),
            "type":config["type"],
        }
        self.meta_config[statement_id] = conf
        
        code =""
        
        tree = {
            "type":config["type"],
            "id":statement_id,
            "children" :[],
            "code":""
        }
        
        if config["type"][:5] =="REACT":
            code,t = self.generate_react_code(config = config, key_chaining=key_chaining)
            if t:
                tree["children"].append(t)
        elif config["type"] == "BLOCK":
            statements = []
            
            
            for i,code in enumerate(config['statements']):
                statement,t =  self.generate_statement_code(code,key_chaining=key_chaining+["statements",i])
                statements.append(statement)
                tree["children"].append(t)
            
            statements = "\n".join(statements)
            
            if config.get("noWrap"):
                code = statements
            else:
                code = f"""{{ 
                    {statements}
                }}"""
        
        elif config['type'].upper() == "FUNCTION":
            func_name = ""
            if not config.get('isAnonymous'):
                func_name = f"const {config['name']} = "
            
            body,t= self.generate_statement_code(config.get('bodyConfig',{}),key_chaining=key_chaining+["bodyConfig"])
            
            tree["children"].append(t)
            
            code = f"""{func_name} {"" if config.get('isAsync') is not True else "async"} ( {", ".join([
                    self.get_function_param(p) for p in config.get("parameters",[])
                ])} ) => {body}"""
        
        
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
                value,t = self.get_value_code(config["value"], key_chaining=key_chaining+["value"])
                if t:
                    tree["children"].append(t)
                code = f"""{declaration_type} {varName} = {value}"""
            else:
                code= f"""{declaration_type} {varName} """
            
        elif config["type"] == "ASSIGNMENT": 
            varName = config["varName"]
            value,t = self.get_value_code(config["value"], key_chaining=key_chaining+["value"])
            if t:
                tree["children"].append(t)
                
            code = f"""{varName} = {value}"""
        
        
        
        elif config['type'] == "FUNCTION_CALL":
            code = self.get_function_call_code(config,key_chaining=key_chaining)
        elif config['type']== "CHAINED_FUNCTIONS":
            function_calls = [ self.get_function_call_code(func,True,key_chaining=key_chaining+["functions",i]) for i,func in enumerate(config["functions"]) ]
            isAwaited = ""
            if config.get("isAwaited", False):
                isAwaited = "await "
            code= isAwaited+".".join(function_calls)
        
        elif config['type'] == "CUSTOM":
            code= config.get("body","")
        
        elif config['type'] == "IF_BLOCK":
            cond,t =self.get_value_code(config["condition"],key_chaining=key_chaining+["condition"])
            if t:
                tree["children"].append(t)
            
            if_code,t = self.generate_statement_code(config.get('bodyConfig',{}),key_chaining=key_chaining+["bodyConfig"])
            tree["children"].append(t)
        
            code = f""" if ({cond}) {if_code} """
            if config.get('elseIf', False):
                for x in config.get('elseIf'):
                    cond2,t =self.get_value_code(x["condition"],key_chaining=key_chaining+["condition"])
                    if t:
                        tree["children"].append(t)
                    elif_body,t = self.generate_statement_code(x.get('bodyConfig',{},key_chaining=key_chaining+["bodyConfig"]))
                    tree["children"].append(t)
                    
                    code += f"""else if({cond2}) {elif_body}"""
            if config.get('elseBody', False):
                else_body,t = self.generate_statement_code(config.get('elseBody',{}),key_chaining=key_chaining+["elseBody"])
                tree["children"].append(t)

                code += f"""else  {else_body}"""
            
        
        elif config['type'] == "FOR_BLOCK":
            if config.get('loopType', "STANDARD") == "STANDARD":
                # initializer = self.generate_statement_code(config["initializer"],key_chaining=key_chaining+["initializer"])
                # configiton = self.generate_statement_code(config["initializer"],key_chaining=key_chaining+["initializer"])
                pass
            else:
                iterator = f"""{config["iterator"].get("declarationType","const ")} {config["iterator"]["name"]}"""
                iterate = "in" if config.get('loopType')=="FOR_IN" else "of"
                iterable,t = self.get_value_code(config["iterable"],key_chaining=key_chaining+["iterable"])
                if t:
                    tree["children"].append(t)
                code= f""" for ( {iterator} {iterate} {iterable})
                    {self.generate_statement_code(config.get('bodyConfig'),key_chaining=key_chaining+["bodyConfig"])}
                """
            pass
        
        elif config['type'] == 'TRY_CATCH':
            tryBody,t = self.generate_statement_code(config["tryBody"],key_chaining=key_chaining+["tryBody"])
            tree["children"].append(t)
            tryBody = f"""try {tryBody}"""
            catchBody,t = self.generate_statement_code(config["catchBody"],key_chaining=key_chaining+["catchBody"])
            tree["children"].append(t)
            catchBody = f"""catch (err) {catchBody}"""
            
            finallyBody = ""
            if config.get('finallyBody'):
                finallyBody,t = self.generate_statement_code(config["finallyBody"],key_chaining=key_chaining+["finallyBody"])
                tree["children"].append(t)
                finallyBody = f"""finally {finallyBody}"""
            
            code= " ".join([tryBody,catchBody,finallyBody])
        
        elif config['type'] == "WHILE_BLOCK":
            cond,t = self.get_value_code(config["condition"],key_chaining=key_chaining+["condition"])
            if t:
                tree["children"].append(t)
                
            body, t =self.generate_statement_code(config.get('bodyConfig',{}),key_chaining=key_chaining+["bodyConfig"])
            tree["children"].append(t)
            code= f""" while ({cond}) {body} 
        """
        
        elif config['type'] == "DO_WHILE_BLOCK":
            cond,t = self.get_value_code(config["condition"],key_chaining=key_chaining+["condition"])
            if t:
                tree["children"].append(t)
            body,t = self.generate_statement_code(config.get('bodyConfig',{}),key_chaining=key_chaining+["bodyConfig"])
            tree["children"].append(t)
            code= f"""do  {body} while ({cond}) 
        """
        
        
        elif config['type'] == "RETURN":
            val, t =self.get_value_code(config.get("value",{}),key_chaining=key_chaining+["value"])
            if t:
                tree["children"].append(t)
            code= f""" return {val}
        """
        
        elif config["type"] == "OPERATION":
            val,t = self.get_operation_code(config,key_chaining=key_chaining)
            code= f" {val} "
        
        elif config["type"] == "IMPORT":
            if config.get("importType") == "DEFAULT":
                code= f" import {config['importEntity']} from '{config['path']}'"
            elif config.get("importType") == "NAMESPACE":
                code= f" import * as {config['importEntity']} from '{config['path']}'"
            else:
                code= f"import {{{config['importEntity']}}} from '{config['path']}'"
        
        elif config["type"] == "COMMENT":
            code= f" /* {config['text']} */"
        
        elif config["type"] == "Element":
            return self.generate_html(config,key_chaining=key_chaining)
        
        tree["code"] = code
        
        return code, tree
        
    
    
    
    def get_function_param(self,param):
        if param.get('type',"ANY") != "OBJECT" or not param.get('properties',False) or not param.get("destructured",False) :
            return param["name"]
        else:
            return f"""{{ {", ".join([
                self.get_function_param(p) for p in param["properties"]
                ])} }}"""
        
    
    
    def get_value_code(self,value, key_chaining=[]):
        ref = value.get("$ref")
        type = value.get("type","UNDEFINED")
        code = ""
        
        t= None
        
        if ref:
            pass
        else:
            if type == "STRING":
                code= f" '{value['value']}' "
            
            elif type == "NUMERIC" or type == "TOKEN":
                code= value["value"]
            
            elif type == "UNDEFINED":
                code= "undefined"
            
            elif type == "NULL":
                code= "null"
            
            elif type == "BOOLEAN":
                if value["value"] and value["value"]!="false":
                    code= "true"
                else:
                    code= "false"
            
            elif type == "OBJECT":
                properties =[]
                for x in value.get("properties"):
                    prop,t = self.get_value_code(value['properties'][x],key_chaining=key_chaining+['properties',x])
                    properties.append(f" {x} : {prop}" )
                code= f"""{{ {",".join(properties)}}}"""
            
            elif type == "ARRAY":
                # code= f"[{', '.join([ )])}]"
                values =[]
                for i,x in enumerate(value.get('values', [])):
                    value,t = self.get_value_code(x,key_chaining=key_chaining+[i])
                    values.append(value )
                    
                code= f"""[ { ', '.join(values) } ]"""
            elif type == "OPERATION":
                code, t= self.get_operation_code(value,key_chaining=key_chaining)
                
            
            elif type == "FUNCTION" or type == "CALLBACK":
                code, t= self.generate_statement_code(value, key_chaining=key_chaining)
            
            elif type == "CUSTOM":
                code= value["value"]

            elif type == "FUNCTION_CALL":
                code,t= self.generate_statement_code(value, key_chaining=key_chaining)
            
            elif type == "CHAINED_FUNCTIONS":
                code,t= self.generate_statement_code(value, key_chaining=key_chaining)
            
            elif type == "Element":
                code,t = self.generate_statement_code(value,key_chaining=key_chaining)
                
        return code,t
        
        
    def generate_html(self,config,key_chaining=[]):
        if config.get('elementType',"") == 'CUSTOM':
            tag =config.get("tagName") 
            if tag!=self.config.get('name'):
                if tag not in self.generated_imports['components']:
                    self.generated_imports['components'].append(tag)
                print("ImportExample",self.config['imports']['components'])
        elif config.get('elementType',"") == 'THIRD_PARTY':
            tag = config.get("tagName")
            typeId = config.get("typeId")
            for imports in self.generated_imports['other']:
                if imports.get('typeId',"") == typeId:
                    break
            else:
                imports = {
                    "TYPE": "THIRD_PARTY",
                    "from": config["library"],
                    "import_entity": tag,
                    "import_type": "SINGLE"
                }
                self.generated_imports['other'].append(imports)

                                
        tag_name = config['tagName']
        attributes = config.get('attributes', {})
        children = config.get('children', [])
        attribute_str = ' '.join([f'{attr}={{{self.get_value_code(value,key_chaining=key_chaining+["attributes",attr])[0]}}}' for attr, value in attributes.items()])
        attribute_str = attribute_str+f" data-brz-id='{config['id']}'"
        open_tag = f'<{tag_name} {attribute_str}>' if attribute_str else f'<{tag_name}>'
        close_tag = f'</{tag_name}>'

        if not children:
            tree = {
                "type" : "HTML",
                # "statementType" : "NA",
                "code" : f'{open_tag[:-1]}/>',
                "id" : config["id"]
            }
            return f'{open_tag[:-1]}/>' , tree

        inner_code_tree = []
        inner_html= []
        for i,child in enumerate(children):
            code,t = self.get_value_code(child,key_chaining=key_chaining+["children",i])
            inner_html.append(code)
            inner_code_tree.append(t)
            
        inner_html = ''.join(inner_html)
        tree = {
            "type" : "HTML",
            # "statementType" : "NA",
            "code":f'{open_tag}{inner_html}{close_tag}',
            "children" : inner_code_tree,
            "id" : config["id"]
        }
        return f'{open_tag}{inner_html}{close_tag}' , tree
    
        
    def get_function_call_code(self,config,disableAwait = False,key_chaining=[]):
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
        return f"""{isAwait}{functionName}({self.get_parameter_mapping(config,key_chaining=key_chaining)})
        """
        
        
    def get_parameter_mapping(self,config,key_chaining=[]):
        param_list =[]
        for i,param in enumerate(config.get("parameters",[])):
            val,t = self.get_value_code(param,key_chaining=key_chaining+["parameters",i])
            param_list.append(val)
        return ", ".join([str(x) for x in param_list])
    
    def get_operation_code(self,config,key_chaining=[]):
        
        tree = []
        
        code= ""
        
        if config["operationType"] == "UNARY":
            o1,t1 = self.get_value_code(config['operand'] )
            if t1:
                if type(t1) is list:
                    tree+=t1
                else:
                    tree.append(t1)
            
            code= f" {config['operation']}{o1}"

        elif config["operationType"] == "BINARY":
            operand1,t1 = self.get_value_code(config['operand1'], key_chaining=key_chaining+["operand1"] )
            operand2,t2 = self.get_value_code(config['operand2'], key_chaining=key_chaining+["operand2"] )
            if t1:
                if type(t1) is list:
                    tree+=t1
                else:
                    tree.append(t1)
            if t2:
                if type(t2) is list:
                    tree+=t2
                else:
                    tree.append(t2)
                
            
            code= f" ({operand1}){config['operation']}({operand2}) "
            
        
        elif config["operationType"] == "TERNARY":
            operand1,t1 = self.get_value_code(config['operand1'], key_chaining=key_chaining+["operand1"] )
            operand2,t2 = self.get_value_code(config['operand2'], key_chaining=key_chaining+["operand2"] )
            operand3,t3 = self.get_value_code(config['operand3'], key_chaining=key_chaining+["operand3"])
            if t1:
                if type(t1) is list:
                    tree+=t1
                else:
                    tree.append(t1)
            if t2:
                if type(t2) is list:
                    tree+=t2
                else:
                    tree.append(t2)
            if t3:
                if type(t3) is list:
                    tree+=t3
                else:
                    tree.append(t3)
            
            code= f" ({operand1} )? ({operand2}) : ({operand3}) "
        
        return code,tree

    def generate_react_code(self,config,key_chaining=[]):
        code = ""
        t= None
        if config["type"]== "REACT_COMPONENT":
            bodyCode, t = self.generate_statement_code(config["bodyConfig"],key_chaining=key_chaining+["bodyConfig"])
            props=[]
            for prop in config.get("propVars",[]):
                props.append(prop["name"])
            
            if config.get("hasImperativeHandling"):
                code = f""" const {config["name"]} = forwardRef( ({{ {','.join(props)} }}, ref) => {bodyCode} )"""
                
            else:
                code = f""" const {config["name"]} = ({{ {','.join(props)} }}) => {bodyCode} """
            
        elif config["type"] == "REACT_USE_STATE":
            varName = config["varName"]
            varName = "".join(varName.split())
            defaultValue = ""
            if config.get("defaultValue"):
                defaultValue,t = self.get_value_code(config["defaultValue"],key_chaining=key_chaining+["defaultValue"])
            code = f"const [{varName},{varName.title()}] = useState({defaultValue})"
        
        elif config["type"] == "REACT_USE_REF":
            varName = config["varName"]
            varName = "".join(varName.split())
            defaultValue = ""
            if config.get("defaultValue"):
                defaultValue,t = self.get_value_code(config["defaultValue"],key_chaining=key_chaining+["defaultValue"])
            code = f"const {varName} = useRef({defaultValue})"
        
        elif config["type"] == "REACT_USE_EFFECT":
            blockCode, t = self.generate_statement_code(config["bodyConfig"],key_chaining=key_chaining+["bodyConfig"])
            
            if not config.get("dependencies") and config["dependencies"]!=[]:
                code = f"useEffect(()=>{blockCode})"
            else:
                dependencies =[]
                for i,val in enumerate(config["dependencies"]):
                    value, _ = self.get_value_code(val)
                    dependencies.append(value)
                code = f"useEffect(()=>{blockCode}, [{','.join(dependencies)}] )"

        elif config["type"] == "REACT_USE_CALLBACK":
            callBackCode, t = self.generate_statement_code(config["callback"],key_chaining=key_chaining+["callback"])
            varname = config["varName"]
            if not config.get("dependencies") and config["dependencies"]!=[]:
                code = f"const {varname} = useCallback({callBackCode})"
            else:
                dependencies =[]
                for i,val in enumerate(config["dependencies"]):
                    value, _ = self.get_value_code(val)
                    dependencies.append(value)
                code = f"const {varname} = useCallback({callBackCode}), [{','.join(dependencies)}] )"
        
        elif config["type"] == "REACT_USE_MEMO":
            blockCode,t = self.generate_statement_code(config["bodyConfig"],key_chaining=key_chaining+["bodyConfig"])
            varname = config["varName"]
            if not config.get("dependencies") and config.get("dependencies")!=[]:
                code = f"const {varname} = useMemo(() => {blockCode})"
            else:
                dependencies =[]
                for i,val in enumerate(config["dependencies"]):
                    value, _ = self.get_value_code(val)
                    dependencies.append(value)
                code = f"const {varname} = useMemo(() => {blockCode}), [{','.join(dependencies)}] )"
                

        
        return code , t
            