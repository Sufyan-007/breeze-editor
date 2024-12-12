# write all static config code here

TEMPLATE_CODE_FILE = {
    "IMPORTS": {
        "other": [],
        "components": [],
    },
    "BLOCK": {
        "type": "BLOCK",
        "noWrap": 1,
        "statements": [{"type": "COMMENT", "text": " Happy coding!!"}],
    },
    "EXPORTS": {"default": None, "others": []},
    "name": "",
}

TEMPLATE_COMP_CONFIG = {
    "IMPORTS": {
        "other": [
            {
                "TYPE": "THIRD_PARTY",
                "import_type": "SINGLE",
                "import_entity": "useEffect",
                "from": "react",
            },
            {
                "TYPE": "THIRD_PARTY",
                "import_type": "SINGLE",
                "import_entity": "useState",
                "from": "react",
            },
        ],
        "components": [],
    },
    "EXPORTS": {"default": "DEFAULT_COMP_ID", "others": []},
    "BLOCK": {
        "type": "BLOCK",
        "noWrap": 1,
        "statements": [
            {
                "type": "REACT_COMPONENT",
                "id": "DEFAULT_COMP_ID",
                "name": "DEFAULT_COMP_NAME",
                "propVars": [
                    {"dataType": "STRING", "name": "prop1"},
                    {"dataType": "STRING", "name": "prop2"},
                ],
                "bodyConfig": {
                    "type": "BLOCK",
                    "statements": [
                        {
                            "type": "REACT_USE_STATE",
                            "varName": "data",
                            "defaultValue": {"type": "TOKEN", "value": "{}"},
                        },
                        {
                            "type": "RETURN",
                            "value": {
                                "type": "Element",
                                "tagName": "div",
                                "id": "Main",
                                "attributes": {},
                                "children": [
                                    {"type": "CUSTOM", "value": "Hello world"},
                                ],
                            },
                        },
                    ],
                },
            }
        ],
    },
}

TEMPLATE_HOOK_CONFIG = {
    "IMPORTS": {
        "other": [
            {
                "TYPE": "THIRD_PARTY",
                "import_type": "SINGLE",
                "import_entity": "useEffect",
                "from": "react",
            },
            {
                "TYPE": "THIRD_PARTY",
                "import_type": "SINGLE",
                "import_entity": "useState",
                "from": "react",
            },
        ],
        "components": [],
    },
    "EXPORTS": {"default": "DEFAULT_HOOK_ID", "others": []},
    "BLOCK": {
        "type": "BLOCK",
        "noWrap": 1,
        "statements": [
            {
                "type": "REACT_COMPONENT",
                "id": "DEFAULT_HOOK_ID",
                "name": "DEFAULT_HOOK_NAME",
                "propVars": [
                    {"dataType": "STRING", "name": "initialValue"},
                ],
                "bodyConfig": {
                    "type": "BLOCK",
                    "statements": [
                        {
                            "type": "REACT_USE_STATE",
                            "varName": "state",
                            "defaultValue": {"type": "TOKEN", "value": "initialValue"},
                        },
                        {
                            "type": "REACT_USE_EFFECT",
                            "description": "",
                            "lifecycleType": "onInitialMount",
                            "bodyConfig": {
                                "type": "BLOCK",
                                "statements": [],
                            },
                            "dependencies": [],
                        },
                        {
                            "type": "FUNCTION",
                            "name": "updateState",
                            "isAsync": False,
                            "isAnonymous": False,
                            "description": "",
                            "parameters": [],
                            "bodyConfig": {
                                "type": "BLOCK",
                                "statements": [],
                            },
                        },
                        {
                            "type": "RETURN",
                            "value": {
                                "type": "ARRAY",
                                "values": [
                                    {"type": "CUSTOM", "value": "state"},
                                    {"type": "CUSTOM", "value": "updateState"},
                                ],
                            },
                        },
                    ],
                },
            }
        ],
    },
}