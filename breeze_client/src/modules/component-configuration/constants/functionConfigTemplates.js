export const funcConfigTemplates = {
  ifBlock: {
    type: 'IF_BLOCK',
    condition: {
      type: 'CUSTOM',
      value: '',
    },
    bodyConfig: {
      type: 'BLOCK',
      statements: [],
    },
    elseIf: [],
    elseBody: {
      type: 'BLOCK',
      statements: [],
    },
  },
  createVariable: {
    type: 'DECLARATION',
    declarationType: '',
    varName: '',
  },
  updateVariable: {
    type: 'ASSIGNMENT',
    varName: '',
  },
  customCode: {
    type: 'CUSTOM',
    body: '',
  },
  return: {
    type: 'RETURN',
    value: {},
  },
  whileBlock: {
    type: 'WHILE_BLOCK',
    condition: {
      type: 'CUSTOM',
      value: '',
    },
    bodyConfig: {
      type: 'BLOCK',
      statements: [],
    },
  },
  doWhileBlock: {
    type: 'DO_WHILE_BLOCK',
    bodyConfig: {
      type: 'BLOCK',
      statements: [],
    },
    condition: {
      type: 'CUSTOM',
      value: '',
    },
  },
  functionCall: {
    callType: 'functionCall',
    type: 'FUNCTION_CALL',
    functionName: '',
    parameters: [],
  },
  serviceCall: {
    callType: 'serviceCall',
    type: 'FUNCTION_CALL',
    functionName: '',
    parameters: [],
  },
  tryCatch: {
    type: 'TRY_CATCH',
    tryBody: {
      type: 'BLOCK',
      statements: [],
    },
    catchBody: {
      type: 'BLOCK',
      statements: [],
    },
    finallyBody: {
      type: 'BLOCK',
      statements: [],
    },
  },
  addNavigation: {
    callType: 'navigation',
    type: 'FUNCTION_CALL',
    functionName: 'router.navigate',
    parameters: [{ type: 'STRING', value: '' }],
  },
  consoleStatement: {
    callType: 'console',
    type: 'FUNCTION_CALL',
    functionName: 'console.log',
    parameters: [{ type: 'CUSTOM', value: '' }],
  },
  comment: {
    type: 'COMMENT',
    text: '',
  },
};
