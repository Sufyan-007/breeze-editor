from .function_code_generator import FunctionCodeGenerator
import copy
class HTMLGenerator:
    def __init__(self,config):
        self.config = config

    def generateAttributeCode(self,attr, value):

        # print("----")
        # print(value)
        if value.get('type') == 'LITERAL':
             return f'"{value.get("value")}"'
        elif value.get('type') == 'OBJECT':
             return f"{{{value.get('value')}}}"
        elif value.get('type') == 'BOOLEAN':
             return f"{{{value.get('value')}}}"
        
        elif value.get('type') == 'VARIABLE':
             return f"{{{value.get('value')}}}"
        elif value.get('type') == "FUNCTION":
            print("------------FUNCTION------------")
            #  print(FunctionCodeGenerator.generate_function(value.get('value'), {}))
            ref = value.get("$ref",None)
            if ref:
                for func in self.config["functions"]:
                    if func["$id"]==ref:
                        related_func_config=func
                        break
                else:
                    related_func_config={
                        "parameters": { "list": [] },
                        "isAnonymous": True,
                        "isAsync": False,
                        "body": "alert(\"Function reference not defined\")"
                    }
            else:
                related_func_config = value.get('value')
            related_func_config = copy.deepcopy(related_func_config)
            related_func_config["isAnonymous"]=True
            return f"{{{FunctionCodeGenerator.generate_function(related_func_config, {})}}}"
        return ""

    def generateHTML(self,config):
        # print("---", config)
        if config.get('type') == 'Element':
            # print(config)
            if config.get('elementType',"") == 'CUSTOM':
                tag =config.get("tagName") 
                if tag!=self.config.get('name'):
                    if tag not in self.config['imports']['components']:
                        self.config['imports']['components'].append(tag)
            elif config.get('elementType',"") == 'THIRD_PARTY':
                tag = config.get("tagName")
                typeId = config.get("typeId")
                for imports in self.config['imports']['other']:
                    if imports.get('typeId',"") == typeId:
                        break
                else:
                    imports = {
                        "TYPE": "THIRD_PARTY",
                        "from": config.get("libary"),
                        "import_entity": tag,
                        "import_type": "SINGLE"
                    }
                    self.config['imports']['other'].append(imports)

                                    
            tag_name = config['tagName']
            attributes = config.get('attributes', {})
            children = config.get('children', [])

            attribute_str = ' '.join([f'{attr}={self.generateAttributeCode(attr, value)}' for attr, value in attributes.items()])
            open_tag = f'<{tag_name} {attribute_str}>' if attribute_str else f'<{tag_name}>'
            close_tag = f'</{tag_name}>'

            if not children:
                return f'{open_tag}{close_tag}'

            inner_html = ''.join([self.generateHTML(child) for child in children])

            return f'{open_tag}{inner_html}{close_tag}'

        elif config.get('type') == 'text':
            return config['text']
        
        elif config.get("type") == "Expression":

            children_code = "\n".join(self.generateHTML(child) for child in config.get("children", []))
            return f"""
                {{  {children_code} }}
            """

        elif config.get("type") in   ["map", "forEach"]:
            callback_params = config.get("callbackParams", ["item", "index"])
            children_code = "\n".join(self.generateHTML(child) for child in config.get("children", []))

            return f"""
                    {config["variable"]}.{config.get("type")}( ({", ".join(callback_params)}) => {{
                        {config.get("code", "")} 
                        return {children_code}
                    }})
                """

        elif config.get('type') == 'condition':
                condition_code = f"if {config['condition']}:" if "condition" in config else ""
                true_case_code = self.generateHTML(config.get("trueCase", {}))
                false_case_code = self.generateHTML(config.get("falseCase", {}))

                return f"""
                    {config["variable"]} ? 
                        {true_case_code if 'trueCase' in config else ''}
                    :
                        {false_case_code if 'falseCase' in config else ''}
                    
                """

        elif config.get('type') == "code":
                return f""" {config['code']} """
        
        return ""
    
config = {
            "tagName": "div",
            "type" : "Element",
            "children": [{
              "type": "Element",
              "tagName": "div",
              "attributes": {
                "style": "height:10rpx;width: 20rpx;"
              },
              "children": [
               {
                "type": "Element",
                "tagName": "Layout",
                "attributes": {},
                "children": [
                        {
                      "type": "Element",
                      "tagName": "Header",
                      "attributes": {},
                            "children": [
                                {
                              "type": "Element",
                              "tagName": "icon",
                              "attributes": {},
                                    "children": []
                                }	
                            ]
                        },
                        {
                      "type": "Element",
                      "tagName": "Content",
                      "attributes": {},
                            "children": [
                                {
                              "type": "Element",
                              "tagName": "Sidebar",
                              "attributes": {},
                                    "children": [
                                        {
                                            "type": "Element",
                                      "tagName": "Nav",
                                      "attributes": {},
                                            "children": [
                                                {
                                                    "type" : "Element",
                                                    "tagName" : "div",
                                                    "attributes" : {},
                                                    "children" : [
                                                        {
                                                            "type": "Expression",
                                                            "operation": "map",
                                                            "variable": "allData",
                                                            "code": "a = 1",
                                                            "callbackParams": ["item", "index"],
                                                            "attributes": {},
                                                            "children": [
                                                                {
                                                                    "type": "Element",
                                                                    "tagName": "div",
                                                                    "attributes": {},
                                                                    "children": []
                                                                }
                                                            ]
                                                        }
                                                        
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                              "type": "Element",
                              "tagName": "MainContent",
                              "attributes": {},
                                    "children": []
                                }
                            ]
                        },
                        {
                      "type": "Element",
                      "tagName": "Footer",
                      "attributes": {},
                            "children": []
                        } 
                    ]
                    
                }]
              
            }]
          }
# print(HTMLGenerator.generateHTML(config))