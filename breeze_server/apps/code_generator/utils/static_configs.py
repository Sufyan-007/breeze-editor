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