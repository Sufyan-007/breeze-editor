export const dataTypes = [
  "CUSTOM",
  "STRING",
  "NUMERIC",
  "BOOLEAN",
  "ARRAY",
  "FUNCTION",
  "OBJECT",
  "TOKEN"
  // "FUNCTION_CALL",
  // "OPERATION"
];

export const staticServiceList = {
  userService: {
    createUser: {
      name: "createUser",
      parameters: [
        { type: "STRING", name: "name" },
        { type: "STRING", name: "username" },
      ],
    },
  },
};
