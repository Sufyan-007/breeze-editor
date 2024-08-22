export const funcConfigOptions = [
  { value: "createVariable", label: "Create Variable" },
  { value: "updateVariable", label: "Update Variable" },
  { value: "ifBlock", label: "If Else Block" },
  { value: "whileBlock", label: "While Block" },
  { value: "doWhileBlock", label: "Do While Block" },
  { value: "customCode", label: "Custom Code" },
  { value: "return", label: "Return Value" },
  { value: "functionCall", label: "Function Call" },
  { value: "serviceCall", label: "Service Call" },
  { value: "tryCatch", label: "Try Catch" },
  { value: "addNavigation", label: "Add navigation" },
];

export const funcConfigTemplates = {
  ifBlock: {
    type: "IF_BLOCK",
    condition: {
      type: "CUSTOM",
      value: "",
    },
    bodyConfig: {
      type: "BLOCK",
      statements: [],
    },
    elseIf: [],
    elseBody: {
      type: "BLOCK",
      statements: [],
    },
  },
  createVariable: {
    type: "DECLARATION",
    declarationType: "",
    varName: "",
  },
  updateVariable: {
    type: "ASSIGNMENT",
    varName: "",
  },
  customCode: {
    type: "CUSTOM",
    body: "",
  },
  return: {
    type: "RETURN",
    value: {},
  },
  whileBlock: {
    type: "WHILE_BLOCK",
    condition: {
      type: "CUSTOM",
      value: "",
    },
    bodyConfig: {
      type: "BLOCK",
      statements: [],
    },
  },
  doWhileBlock: {
    type: "DO_WHILE_BLOCK",
    bodyConfig: {
      type: "BLOCK",
      statements: [],
    },
    condition: {
      type: "CUSTOM",
      value: "",
    },
  },
  functionCall: {
    callType: "functionCall",
    type: "FUNCTION_CALL",
    functionName: "",
    parameters: [],
  },
  serviceCall: {
    callType: "serviceCall",
    type: "FUNCTION_CALL",
    functionName: "",
    parameters: [],
  },
  tryCatch: {
    type: "TRY_CATCH",
    tryBody: {
      type: "BLOCK",
      statements: [],
    },
    catchBody: {
      type: "BLOCK",
      statements: [],
    },
    finallyBody: {
      type: "BLOCK",
      statements: [],
    },
  },
  addNavigation: {
    callType: "navigation",
    type: "FUNCTION_CALL",
    functionName: "router.navigate",
    parameters: [{ type: "STRING", value: "" }],
  },
};
