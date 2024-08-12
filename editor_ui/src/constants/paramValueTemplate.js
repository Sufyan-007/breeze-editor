export const TEMPLATE = {
  STRING: {
    type: "STRING",
    value: "",
  },
  NUMERIC: {
    type: "NUMERIC",
    value: 0,
  },
  OBJECT: {
    type: "OBJECT",
    properties: {
      name: {
        type: "STRING",
        value: "",
      },
    },
  },
  BOOLEAN: {
    type: "BOOLEAN",
    value: false,
  },
  UNDEFINED: {
    type: "UNDEFINED",
  },
  NULL: {
    type: "NULL",
  },
  CUSTOM: {
    type: "CUSTOM",
    value: "",
  },
  FUNCTION: {
    type: "FUNCTION",
    isAnonymous: true,
    parameters: [],
    bodyConfig: {
      type: "BLOCK",
      statements: [],
    },
  },
};
