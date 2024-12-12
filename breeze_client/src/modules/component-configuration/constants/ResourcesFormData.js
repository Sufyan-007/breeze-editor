export const initialPropConfig = {
  name: '',
  isRequired: false,
  dataType: 'STRING',
  defaultValue: { type: 'CUSTOM', value: '""' },
  description: '',
};

export const initialParamConfig = {
  name: '',
  dataType: 'STRING',
  defaultValue: { type: 'CUSTOM', value: '""' },
  description: '',
};

export const initialComponentConfig = {
  type: 'REACT_COMPONENT',
  name: '',
  description: '',
  propVars: [],
  bodyConfig: {
    type: 'BLOCK',
    statements: [],
  },
};

export const initialVariableConfig = {
  type: 'DECLARATION',
  varName: '',
  declarationType: 'const',
  dataType: 'STRING',
  value: { type: 'CUSTOM', value: '' },
  description: '',
};

export const initialStateVarConfig = {
  type: 'REACT_USE_STATE',
  varName: '',
  dataType: 'STRING',
  defaultValue: { type: 'CUSTOM', value: '' },
  description: '',
};

export const initialRefVarConfig = {
  type: 'REACT_USE_REF',
  varName: '',
  dataType: 'STRING',
  defaultValue: { type: 'CUSTOM', value: '' },
  description: '',
};

export const initialImportConfig = {
  importEntity: '',
  importFrom: '',
  importType: 'single',
  category: 'component',
};

export const initialFunctionConfig = {
  type: 'FUNCTION',
  name: '',
  isAsync: false,
  isAnonymous: false,
  description: '',
  schema: {
    type: 'FUNCTION',
    returnType: {
      selection: 'anyOf',
      types: [{ type: 'any' }],
    },
    parameters: [],
  },
  bodyConfig: {
    type: 'BLOCK',
    statements: [],
  },
};

export const initialLifecycleConfig = {
  type: 'REACT_USE_EFFECT',
  description: '',
  lifecycleType: 'onInitialMount',
  bodyConfig: {
    type: 'BLOCK',
    statements: [],
  },
  dependencies: [],
};

export const initialUseMemoConfig = {
  type: 'REACT_USE_MEMO',
  varName: '',
  description: '',
  bodyConfig: {
    type: 'BLOCK',
    statements: [],
  },
  dependencies: [],
};

export const initialUseCallbackConfig = {
  type: 'REACT_USE_CALLBACK',
  varName: '',
  description: '',
  callback: {
    type: 'FUNCTION',
    name: '',
    isAsync: false,
    isAnonymous: true,
    description: '',
    schema: {
      type: 'FUNCTION',
      returnType: {
        selection: 'anyOf',
        types: [{ type: 'any' }],
      },
      parameters: [],
    },
    bodyConfig: {
      type: 'BLOCK',
      statements: [],
    },
  },
  dependencies: [],
};
