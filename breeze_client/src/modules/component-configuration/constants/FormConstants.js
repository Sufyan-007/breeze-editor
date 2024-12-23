export const BreezeDatatypes = [
  { value: 'STRING', label: 'String' },
  { value: 'NUMERIC', label: 'Number' },
  { value: 'BOOLEAN', label: 'Boolean' },
  { value: 'OBJECT', label: 'Object' },
  { value: 'ARRAY', label: 'Array' },
  { value: 'FUNCTION', label: 'Function' },
  { value: 'ANY', label: 'Any' },
  { value: 'UNDEFINED', label: 'Undefined' },
  { value: 'NULL', label: 'Null' },
  { value: 'TOKEN', label: 'Token' },
];

export const DeclarationTypes = [
  { label: 'const', value: 'const' },
  { label: 'let', value: 'let' },
  { label: 'var', value: 'var' },
];

export const ImportTypes = [
  { label: 'Single', value: 'SINGLE' },
  { label: 'Full', value: 'FULL' },
];

export const ImportCategories = [{ label: 'Third Party', value: 'THIRD_PARTY' }];

export const ImportModules = [
  { label: 'Select', value: '' },
  { label: 'Component', value: 'component' },
  { label: 'Variable', value: 'variables' },
  { label: 'Function', value: 'functions' },
  { label: 'Hook', value: 'hooks' },
];

export const lifecycleTypes = [
  { label: 'On Initial Mount', value: 'onInitialMount' },
  { label: 'On Dependency', value: 'onDependency' },
  { label: 'On Every Mount', value: 'onEveryMount' },
];

export const hookTypes = [
  { label: 'useMemo', value: 'REACT_USE_MEMO' },
  { label: 'useCallback', value: 'REACT_USE_CALLBACK' },
];

export const availableDependentVars = [
  { label: 'Variable 1', value: 'var1' },
  { label: 'Variable 2', value: 'var2' },
  { label: 'Variable 3', value: 'var3' },
  { label: 'Dep 1', value: 'dependency1' },
  { label: 'Dep 2', value: 'dependency2' },
];

export const scopeOptions = {
  data: '',
  test: '',
  Main: '',
};
export const inputTypeMapping = Object.freeze({
  text: 'STRING',
  number: 'NUMERIC',
});
