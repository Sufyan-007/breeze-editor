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
        "default": "DEFAULT_COMP_ID",
        "others": [
        
        ]
    },
    "BLOCK": {
            "type": "BLOCK",
            "noWrap": 1,
            "statements": [
                {
                    "type": "REACT_COMPONENT",
                    "id":"DEFAULT_COMP_ID",
                    "name": "DEFAULT_COMP_NAME",
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
                                "type": "RETURN",
                                "value": {
                                    "type": "Element",
                                    "tagName": "div",
                                    "id": "Main",
                                    "attributes":{

                                    },
                                    "children": [
                                        {
                                            "type": "CUSTOM",
                                            "value": "Hello world"
                                        },
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
}