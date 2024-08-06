export const dataTypes = [
  "CUSTOM",
  "STRING",
  "NUMERIC",
  "BOOLEAN",
  "ARRAY",
  "FUNCTION",
  "OBJECT",
  "TOKEN",
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
    addData: {
      name: "addData",
      parameters: [
        {
          type: "OBJECT",
          name: "payload",
          properties: {
            id: {
              type: "NUMERIC",
            },
            name: {
              type: "STRING",
              value: "",
            },
            // available: {
            //   type: "BOOLEAN",
            //   value: true,
            // },
            childObj: {
              type: "OBJECT",
              properties: {
                param1: {
                  type: "STRING",
                  value: "",
                },
              },
            },
          },
        },
        { type: "STRING", name: "name" },
        { type: "STRING", name: "username" },
        {
          name: "abc",
          type: "ARRAY",
          items: {
            type: "STRING",
          },
        },
      ],
    },
    testService: {
      name: "testService",
      parameters: [{ type: "ANY" }],
    },
  },
};
