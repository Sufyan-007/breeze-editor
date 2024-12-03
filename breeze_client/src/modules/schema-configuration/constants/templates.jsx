// export const schemaTemplate = {
//   templates: [],
//   name: '',
//   type: '',
//   extends: '',
//   swaggerId: '',
// };

// export const objectTemplate = {
//   type: '',
//   properties: propertyTemplate,
//   required: [],
//   additionalProperties: {},
// };

// export const propertyTemplate = {
//   types: [typeTemplate],
// };
export const objectTemplate = {
  type: 'object',
  properties: { SampleProperty: { selection: 'anyOf', types: [{ type: 'string' }] } },
  required: [],
  additionalProperties: {},
};

export const typeTemplate = { types: [{ type: 'string' }], selection: 'anyOf' };

export const typeWithTemplateInput = {
  type: '',
  templateInputs: [{ name: 'item' }],
  enums: [],
};

export const metaDataTemplate = {
  example: '',
  description: '',
};

export const basicTypeTemplate = [
  { label: 'Select', value: '' },
  { label: 'string', value: 'string' },
  { label: 'boolean', value: 'boolean' },
  { label: 'number', value: 'number' },
  { label: 'integer', value: 'integer' },
  { label: 'any', value: 'any' },
  // { label: 'object', value: 'object' },
  { label: 'array', value: 'array', templates: [{ name: 'item' }] },
];

export const selectionTypes = {
  string: {
    type: 'string',
  },
  array: {
    type: 'array',
    templates: [{ name: 'item' }],
  },
  boolean: {
    type: 'boolean',
  },
};

export const schemaTemplate = {
  type: 'object',
  properties: { SampleProperty: { selection: 'anyOf', types: [{ type: 'string' }] } },
  required: [],
  additionalProperties: {},
  templateInputs: [],
  name: '',
};
