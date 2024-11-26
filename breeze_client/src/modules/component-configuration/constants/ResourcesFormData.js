export const initialPropConfig = {
  propName: '',
  isRequired: false,
  dataType: 'string',
  defaultValue: '',
  description: '',
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
  functionName: '',
  isAsync: false,
  isAnonymous: false,
  description: '',
  params: [],
  functionBody: '',
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
