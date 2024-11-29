export const BreezeDatatypes = [
  { value: 'STRING', label: 'String' },
  { value: 'NUMBER', label: 'Number' },
  { value: 'BOOLEAN', label: 'Boolean' },
  { value: 'OBJECT', label: 'Object' },
  { value: 'ARRAY', label: 'Array' },
  { value: 'FUNCTION', label: 'Function' },
  { value: 'CUSTOM', label: 'Custom' },
];

export const DeclarationTypes = [
  { label: 'const', value: 'const' },
  { label: 'let', value: 'let' },
  { label: 'var', value: 'var' },
];

export const ImportTypes = [
  { label: 'Single', value: 'single' },
  { label: 'Full', value: 'full' },
];

export const ImportCategories = [
  { label: 'Component', value: 'component' },
  { label: 'Services', value: 'services' },
  { label: 'Third Party', value: 'thirdparty' },
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
