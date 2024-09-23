export const initialPropConfig = {
  propName: '',
  isRequired: false,
  dataType: 'string',
  defaultValue: '',
  description: '',
};

export const initialVariableConfig = {
  varName: '',
  varType: 'stateVar',
  declarationType: 'const',
  dataType: '',
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
