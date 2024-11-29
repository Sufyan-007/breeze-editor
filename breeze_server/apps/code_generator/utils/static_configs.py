# write all static config code here

TEMPLATE_CODE_FILE = {
    "IMPORTS":{
      "other":[],
      "components":[],  
    },
    "BLOCK":{
        "type": "BLOCK",
        "noWrap": 1,
        "statements": [
            {
                "type" : "COMMENT",
                "text" : " Happy coding!!"
            }
        ]
    },
    "EXPORTS":{
        "default":None,
        "others":[]
    },
    "name":""
}

TEMPLATE_COMP_CONFIG_prev = {
    
    "IMPORTS": {
        "other": [
            {
                "TYPE": "THIRD_PARTY",
                "import_type": "SINGLE",
                "import_entity": "useEffect",
                "from": "react"
            },
            {
                "TYPE": "THIRD_PARTY",
                "import_type": "SINGLE",
                "import_entity": "useState",
                "from": "react"
            }
        ],
        "components": []
    },
    "EXPORTS": {
        "default": {
                "id":"DEFAULT_COMP_ID"
            },
        "others": []
    },
    "BLOCK": {
        "type": "BLOCK",
        "noWrap": 1,
        "statements": [
            {
                "type": "FUNCTION",
                "name": "DEFAULT_COMP_NAME",
                "id":"DEFAULT_COMP_ID",
                "parameters": [],
                "bodyConfig": {
                    "type": "BLOCK",
                    "statements": [
                        {
                            "type": "DECLARATION",
                            "declarationType": "const",
                            "varName": "[num,setNum]",
                            "value": {
                                "type": "FUNCTION_CALL",
                                "functionName": "useState",
                                "parameters": [
                                    {
                                        "type": "TOKEN",
                                        "value": "10"
                                    }
                                ]
                            }
                        },
                        {
                            "type": "FUNCTION_CALL",
                            "functionName": "useEffect",
                            "parameters": [
                                {
                                    "type": "FUNCTION",
                                    "isAnonymous": True,
                                    "parameters": [],
                                    "bodyConfig": {
                                        "type": "BLOCK",
                                        "statements": [
                                            {
                                                "type": "FUNCTION_CALL",
                                                "functionName": "console.log",
                                                "parameters": [
                                                    {
                                                        "type": "STRING",
                                                        "value": "Hello - "
                                                    },
                                                    {
                                                        "type": "TOKEN",
                                                        "value": "num"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                },
                                {
                                    "type": "ARRAY",
                                    "values": [
                                        {
                                            "type": "TOKEN",
                                            "value": "num"
                                        }
                                    ]
                                }
                            ]
                        }
                        ,
                        {
                            "type":"RETURN",
                            "value":{
                                "type":"Element",
                                "tagName":"div",
                                "id":"Main",
                                "children":[
                                    {
                                        "type":"CUSTOM",
                                        "value":"Hello world"
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    }

}

TEMPLATE_COMP_CONFIG = {
    "IMPORTS": {
        "other": [
            {
                "TYPE": "THIRD_PARTY",
                "import_type": "SINGLE",
                "import_entity": "useEffect",
                "from": "react"
            },
            {
                "TYPE": "THIRD_PARTY",
                "import_type": "SINGLE",
                "import_entity": "useState",
                "from": "react"
            }
        ],
        "components": []
    },
    "EXPORTS": {
        "default": "Main",
        "others": [
            "Hello"
        ]
    },
    "BLOCK": {
            "type": "BLOCK",
            "noWrap": 1,
            "statements": [
                {
                    "type": "REACT_COMPONENT",
                    "name": "Main",
                    "propVars": [
                        {
                            "dataType": "STRING",
                            "name": "prop1"
                        },
                        {
                            "dataType": "STRING",
                            "name": "prop2"
                        }
                    ],
                    "bodyConfig": {
                        "type": "BLOCK",
                        "statements": [
                            {
                                "type": "REACT_USE_STATE",
                                "varName": "num",
                                "defaultValue": {
                                    "type": "TOKEN",
                                    "value": "10"
                                }
                            },
                            {
                                "type": "REACT_USE_REF",
                                "varName": "ref",
                                "defaultValue": {
                                    "type": "TOKEN",
                                    "value": "10"
                                }
                            },
                            {
                                "type": "REACT_USE_MEMO",
                                "varName": "hello",
                                "bodyConfig": {
                                    "type": "BLOCK",
                                    "statements": [
                                        {
                                            "type": "RETURN",
                                            "value": {
                                                "type": "STRING",
                                                "value": "Hello"
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                "type": "REACT_USE_EFFECT",
                                "bodyConfig": {
                                    "type": "BLOCK",
                                    "statements": [
                                        {
                                            "type": "FUNCTION_CALL",
                                            "functionName": "console.log",
                                            "parameters": [
                                                {
                                                    "type": "STRING",
                                                    "value": "Hello - "
                                                },
                                                {
                                                    "type": "TOKEN",
                                                    "value": "num"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                "dependencies": [
                                    {
                                        "type": "TOKEN",
                                        "value": "num"
                                    }
                                ]
                            },
                            {
                                "type":"FUNCTION",
                                "name":"onClick",
                                "parameters":[],
                                "bodyConfig":{
                                    "type":"BLOCK",
                                    "statements":[{
                                        "type":"FUNCTION_CALL",
                                        "functionName":"console.log",
                                        "parameters":[
                                            {
                                                "type":"STRING",
                                                "value":"clicked"
                                            }
                                        ]
                                    }]
                                }
                            },
                            {
                                "type": "RETURN",
                                "value": {
                                    "type": "Element",
                                    "tagName": "div",
                                    "id": "Main",
                                    "attributes":{
                                        "className":{
                                            "type":"STRING",
                                            "value":"bg-dark"
                                        }
                                    },
                                    "children": [
                                        {
                                            "type": "CUSTOM",
                                            "value": "Hello world"
                                        },
                                        {
                                            "type":"Element",
                                            "tagName":"a",
                                            "id":"Main-0","attributes":{
                                                "onClick":{
                                                    "type":"TOKEN",
                                                    "value":"onClick"
                                                }
                                            },
                                            "children":[
                                                {
                                                    "type":"CUSTOM",
                                                    "value":"Click Me"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    "type": "DECLARATION",
                    "declarationType": "var",
                    "varName": "Hello",
                    "value": {
                        "type": "OPERATION",
                        "operationType": "BINARY",
                        "operand1": {
                            "value": "true",
                            "type": "TOKEN"
                        },
                        "operand2": {
                            "type": "OPERATION",
                            "operationType": "UNARY",
                            "operand": {
                                "type": "TOKEN",
                                "value": "false"
                            },
                            "operation": "!"
                        },
                        "operation": "==="
                    }
                }
            ]
        }
}