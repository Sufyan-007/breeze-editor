export const dataTypes = [
  "STRING",
  "NUMERIC",
  "BOOLEAN",
  "ARRAY",
  "FUNCTION",
  "OBJECT",
  "COMPONENT",
  "ELEMENT",
  "ANY",
  
  "TOKEN",
  // "FUNCTION_CALL",
  // "OPERATION"
];

export const staticServiceList = {
  userService: {
    createUser: {
      id: "1",
      name: "createUser",
      parameters: [
        { type: "STRING", name: "name" },
        { type: "NUMERIC", name: "phone" },
      ],
    },
    addData: {
      id: "2",
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
            available: {
              type: "BOOLEAN",
              value: true,
            },
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
        {
          name: "data",
          type: "ARRAY",
          items: {
            type: "STRING",
          },
        },
      ],
    },
    testService: {
      id: "3",
      name: "testService",
      parameters: [{ type: "ANY" }],
    },
  },
};
