export const initialPropConfig = {
  propName: '',
  isRequired: false,
  dataType: 'string',
  defaultValue: '',
  description: '',
};

export const initialParamConfig = {
  name: '',
  dataType: 'string',
  defaultValue: '',
  description: '',
};

export const initialComponentConfig = {
  type: 'REACT_COMPONENT',
  name: '',
  description: '',
  propsVar: [],
};

export const initialVariableConfig = {
  type: 'DECLARATION',
  varName: '',
  declarationType: 'const',
  dataType: 'string',
  defaultValue: '',
  description: '',
};

export const initialStateVarConfig = {
  type: 'REACT_STATE_VAR',
  varName: '',
  declarationType: 'const',
  dataType: 'string',
  defaultValue: '',
  description: '',
};

export const initialRefVarConfig = {
  type: 'REACT_REF_VAR',
  varName: '',
  declarationType: 'const',
  dataType: 'string',
  defaultValue: '',
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
  parameters: [],
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
  dependencies: { type: 'ARRAY', values: [] },
};

export const initialUseMemoConfig = {
  type: 'REACT_USE_MEMO',
  name: '',
  description: '',
  bodyConfig: {
    type: 'BLOCK',
    statements: [],
  },
  dependencies: { type: 'ARRAY', values: [] },
};

export const initialUseCallbackConfig = {
  type: 'REACT_USE_CALLBACK',
  name: '',
  description: '',
  callback: {
    type: 'FUNCTION',
    name: '',
    isAsync: false,
    isAnonymous: true,
    description: '',
    parameters: [],
    bodyConfig: {
      type: 'BLOCK',
      statements: [],
    },
  },
  dependencies: { type: 'ARRAY', values: [] },
};
