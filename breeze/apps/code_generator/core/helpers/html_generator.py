from .function_code_generator import FunctionCodeGenerator

class HTMLGenerator:
    def __init__(self):
        pass

    @staticmethod
    def generateAttributeCode(attr, value):

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
            #  print("------------FUNCTION------------")
            #  print(FunctionCodeGenerator.generate_function(value.get('value'), {}))
             return f"{{{FunctionCodeGenerator.generate_function(value.get('value'), {})}}}"
        return ""

    @staticmethod
    def generateHTML(config):
        # print("---", config)
        if config.get('type') == 'Element':
            # print(config)
            tag_name = config['tagName']
            attributes = config.get('attributes', {})
            children = config.get('children', [])

            attribute_str = ' '.join([f'{attr}={HTMLGenerator.generateAttributeCode(attr, value)}' for attr, value in attributes.items()])
            open_tag = f'<{tag_name} {attribute_str}>' if attribute_str else f'<{tag_name}>'
            close_tag = f'</{tag_name}>'

            if not children:
                return f'{open_tag}{close_tag}'

            inner_html = ''.join([HTMLGenerator.generateHTML(child) for child in children])

            return f'{open_tag}{inner_html}{close_tag}'

        elif config.get('type') == 'text':
            return config['text']
        
        elif config.get("type") == "Expression":

            children_code = "\n".join(HTMLGenerator.generateHTML(child) for child in config.get("children", []))
            return f"""
                {{  {children_code} }}
            """

        elif config.get("type") in   ["map", "forEach"]:
            callback_params = config.get("callbackParams", ["item", "index"])
            children_code = "\n".join(HTMLGenerator.generateHTML(child) for child in config.get("children", []))

            return f"""
                    {config["variable"]}.{config.get("type")}( ({", ".join(callback_params)}) => {{
                        {config.get("code", "")} 
                        return {children_code}
                    }})
                """

        elif config.get('type') == 'condition':
                condition_code = f"if {config['condition']}:" if "condition" in config else ""
                true_case_code = HTMLGenerator.generateHTML(config.get("trueCase", {}))
                false_case_code = HTMLGenerator.generateHTML(config.get("falseCase", {}))

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