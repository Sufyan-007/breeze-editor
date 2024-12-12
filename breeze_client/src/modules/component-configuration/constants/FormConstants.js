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

export const availableServices = [
  { id: 1, serviceName: 'getAllUsers', fileName: 'users.jsx', moduleName: 'User Management' },
  { id: 2, serviceName: 'createUser', fileName: 'users.jsx', moduleName: 'User Management' },
  { id: 3, serviceName: 'getUserById', fileName: 'users.jsx', moduleName: 'User Management' },
  { id: 4, serviceName: 'updateUser', fileName: 'users.jsx', moduleName: 'User Management' },
  { id: 5, serviceName: 'deleteUser', fileName: 'users.jsx', moduleName: 'User Management' },
  { id: 6, serviceName: 'login', fileName: 'authentication.jsx', moduleName: 'User Management' },
  { id: 7, serviceName: 'logout', fileName: 'authentication.jsx', moduleName: 'User Management' },
];
