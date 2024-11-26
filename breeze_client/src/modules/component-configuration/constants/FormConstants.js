export const BreezeDatatypes = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'object', label: 'Object' },
  { value: 'array', label: 'Array' },
  { value: 'function', label: 'Function' },
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
  { label: 'useMemo', value: 'useMemo' },
  { label: 'useCallback', value: 'useCallback' },
];

export const availableDependentVars = [
  { label: 'Variable 1', value: 'var1' },
  { label: 'Variable 2', value: 'var2' },
  { label: 'Variable 3', value: 'var3' },
];
