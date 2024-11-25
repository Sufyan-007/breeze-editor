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
  description: '',
  lifecycleType: 'onInitialMount',
  dependentVars: [],
  lifecycleBody: '',
};
export const initialHookConfig = {
  hookName: '',
  hookDescription: '',
  hookType: 'useMemo',
  dependentVars: [],
  functionParams: [],
};
