from .function_code_generator import FunctionCodeGenerator
import copy
# from resource_handler import ResourceHandler

class HTMLGenerator:
    def __init__(self,config):
        self.config = config

    def generateAttributeCode(self,attr, value):
        
        # print("----")
        # print(value)
        val=""
        if value.get('type') == "DESTRUCTURABLE":
            return f"{{...{value.get('value')} }}"
        if value.get('type') in ['LITERAL','ANY']:
            if value.get("value").startswith('{') and value.get("value").endswith('}'):
                valueWithoutBraces = value.get('value')[1:-1]
                val= f"{{{valueWithoutBraces}}}"
            else:
               val= f'"{value.get("value")}"'
        elif value.get('type') == 'OBJECT':
            val= f"{{{value.get('value')}}}"
        elif value.get('type') == 'BOOLEAN':
            val= f"{{{value.get('value')}}}"
        elif value.get('type')=='COMPONENT':
            #value['type'] = 'VARIABLE'
            if value.get('importType',"") == 'custom':
                tag =value.get('value')
                if tag!=self.config.get('name'):
                    #if tag not in self.config['imports']['components']:
                    self.config['imports']['components'].append(tag)
            elif value.get('importType',"") == 'third_party':
                # config=self.config["html_elements"][config_id["_id"]]
                tag =value.get('value')

                imports = {
                        "TYPE": "THIRD_PARTY",
                        "from": "react-bootstrap",
                        "import_entity": tag,
                        "import_type": "SINGLE"
                    }
                self.config['imports']['other'].append(imports)
                
            val= f"{{{value.get('value')}}}"
        elif value.get('type') in ['VARIABLE', 'NUMERIC']:
            ref = value.get("$ref",None)
            if ref:
                for resource in self.config["resources"]:
                    if resource["id"]==ref:
                        related_var_config=resource
                        related_var_config["name"]=resource["name"]
                        val = "{%s}" % related_var_config["name"]
                        break
                else:
                    for resource in self.config["propsVars"]:
                        if resource["id"]==ref:
                            related_var_config=resource
                            related_var_config["name"]=resource["name"]
                            val = "{%s}" % related_var_config["name"]
                            break
                    else:
                        raise IndexError("Could not find %s" % ref)
            else:
                val= f"{{{value.get('value')}}}"

                
              
        elif value.get('type') == "FUNCTION":
            print("------------FUNCTION------------")
            #  print(FunctionCodeGenerator.generate_function(value.get('value')))
            ref = value.get("$ref",None)
            if ref:
                for resource in self.config["resources"]:
                    if resource["id"]==ref:
                        print("------------RESOURCE------------")
                        print(resource)
                        related_func_config=resource
                        related_func_config["name"]=resource["name"]
                        break
                else:
                    for resource in self.config["propsVars"]:
                        if resource["id"]==ref:
                            related_func_config=resource
                            related_func_config["name"]=resource["name"]
                            break
                    else:
                        raise IndexError("Could not find %s" % ref)
            else:
                related_func_config = value.get('value')
                related_func_config["isAnonymous"]=True
            if related_func_config["isAnonymous"]:
                val= f"{{{FunctionCodeGenerator.generate_function(related_func_config)}}}"
            else:
                val = "{%s}" % related_func_config["name"]
        return f"{attr}={val}"

    def generateHTML(self,config_id):
        # print("---", config)
        try:
            config=self.config["html_elements"][config_id["_id"]]
        except:
            return ""
        if config.get('type') == 'Element':
            print("ImportExample",self.config ,config)
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

            attribute_str = ' '.join([f'{self.generateAttributeCode(attr, value)}' for attr, value in attributes.items()])
            attribute_str = attribute_str+f" data-brz-id='{config_id['_id']}'"
            open_tag = f'<{tag_name} {attribute_str}>' if attribute_str else f'<{tag_name}>'
            close_tag = f'</{tag_name}>'

            if not children:
                tree = {
                    "type" : "HTML",
                    # "statementType" : "NA",
                    "code" : f'{open_tag}{close_tag}',
                    "id" : config_id["_id"]
                }
                return f'{open_tag}{close_tag}', tree

            inner_code_tree = []
            inner_html= []
            for child in children:
                code,tree = self.generateHTML(child)
                inner_html.append(code)
                inner_code_tree.append(tree)
                
            inner_html = ''.join(inner_html)
            tree = {
                "type" : "HTML",
                # "statementType" : "NA",
                "code":f'{open_tag}{inner_html}{close_tag}',
                "children" : inner_code_tree,
                "id" : config_id["_id"]
            }
            return f'{open_tag}{inner_html}{close_tag}' , tree

        elif config.get('type') == 'text':
            tree = {
                "type" : "HTML",
                # "statementType" : "NA",
                "code" : config['text'],
                "id" : config_id["_id"]
            }
            return config['text'],tree
        
        # elif config.get("type") == "Expression":

        #     children_code = "\n".join(self.generateHTML(child) for child in config.get("children", []))
        #     return f"""
        #         {{  {children_code} }}
        #     """

        elif config.get("type") in   ["map", "forEach"]:
            callback_params = config.get("callbackParams", ["item", "index"])
            children_code = "\n".join(self.generateHTML(child) for child in config.get("children", []))

            return f"""
                    {{{config["variable"]}.{config.get("type")}( ({", ".join(callback_params)}) => {{
                        {config.get("code", "")} 
                        return <>{children_code}</>
                    }})}}
                """

        elif config.get('type') == 'condition':
                condition_code = f"if {config['condition']}:" if "condition" in config else ""
                true_case_code = self.generateHTML(config.get("trueCase", {}))
                false_case_code = self.generateHTML(config.get("falseCase", {}))

                return f"""
                    {{{config["variable"]} ? 
                        <>{true_case_code if 'trueCase' in config else ''}</>
                    :
                        <>{false_case_code if 'falseCase' in config else ''}</>
                    }}
                """

        elif config.get('type') == "code":
                return f"""{{ {config['code']} }}"""
        
        return ""