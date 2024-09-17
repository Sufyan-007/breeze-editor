export const ArrayMapping = {
  type: 'ARRAY',
  label: 'Array',
  itemType: {
    type: 'TEXT',
    label: 'Personal Interests',
    validation: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z ]+$/,
      noSpaces: false,
    },
    placeholder: 'Enter your interests',
  },
};
export const NestedMapping = {
  type: 'OBJECT',
  label: 'Root',
  className: 'm-2 d-block',
  properties: {
    name: {
      type: 'TEXT',
      label: 'Sample name',
      placeholder: 'Enter your name',
      className: 'mx-3',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z ]+$/,
        noSpaces: false,
      },
      condition: {
        operation: 'ANY',
        conditions: [
          {
            conditionType: 'ORDINARY',
            operand: 'obj.prop1',
            operandValue: 'name',
            operandValueIsDynamic: true,
            operator: '!==',
            type: 'UNARY',
          },
        ],
      },
    },
    age: {
      type: 'NUMBER',
      label: 'Sample age',
      className: 'mx-3',
    },
    role: {
      type: 'SELECT',
      label: 'Sample role',
      className: 'mx-3',
      options: [
        { value: '', label: 'Select a role' },
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
        { value: 'guest', label: 'Guest' },
      ],
      validation: {
        required: true,
      },
      // condition: 'myCondition',
      condition: {
        operation: 'ANY',
        conditions: [
          {
            operand: 'name',
            operandValue: 'abc',
            operator: '!==',
            type: 'UNARY',
          },
          {
            operand: 'age',
            operandValue: '80',
            operator: '<',
            type: 'BINARY',
          },
          {
            operand: 'obj.prop1',
            operandValue: 'abc',
            operator: '!==',
            type: 'UNARY',
          },
        ],
      },
    },
    interests: {
      type: 'ARRAY',
      label: 'Interests',
      className: 'mx-3 d-block',
      itemType: {
        type: 'TEXT',
        label: 'Personal Interests',
        placeholder: 'Enter your interests',
        className: 'mx-3',
        validation: {
          required: true,
          minLength: 2,
          maxLength: 50,
          pattern: /^[a-zA-Z ]+$/,
          noSpaces: false,
        },
      },
    },
    sampleRecord: {
      type: 'RECORD',
      label: 'sample record',
      className: 'mx-3 d-block',
      itemType: {
        type: 'TEXT',
        label: 'Sample name',
        placeholder: 'Enter your name',
        className: 'mx-3',
      },
    },
    obj: {
      type: 'OBJECT',
      label: 'another obj',
      className: 'mx-3 d-block',
      properties: {
        prop1: {
          type: 'TEXT',
          label: 'Sample name',
          placeholder: 'Enter your name',
          className: 'mx-3',
        },
      },
      condition: {
        operation: 'ANY',
        conditions: [
          {
            conditionType: 'OTHERSTATE',
            operand: 'MyCondition',
          },
        ],
      },
    },
  },
};

export const lifeCycleConfigMapping = {
  type: 'OBJECT',
  // label: 'Life Cycle Config Form',
  className: 'mb-2 row',
  properties: {
    name: {
      type: 'TEXT',
      label: 'Name',
      placeholder: 'Enter your name',
      className: 'form-control-sm',
      required: true,
    },
    body: {
      type: 'OBJECT',
      className: 'mb-2 row',
      // label: "Body",
      properties: {
        description: {
          type: 'TEXT',
          label: 'Description',
          placeholder: 'Enter your Description',
          className: 'form-control-sm',
          required: true,
        },
        lifecycleType: {
          type: 'RADIO',
          label: 'LifeCycleType',
          placeholder: 'Enter your lifecycle type',
          className: 'mx-1',
          required: true,
          options: [
            { value: 'onEveryMount', label: 'onEveryMount' },
            { value: 'onInitialMount', label: 'onInitialMount' },
            { value: 'onComponentMount', label: 'onComponentMount' },
          ],
        },
      },
    },
  },
};
export const variableConfigMapping = {
  type: 'OBJECT',
  // label: 'Life Cycle Config Form',
  // className: "mb-2 row",
  properties: {
    name: {
      type: 'TEXT',
      label: 'Variable Name',
      placeholder: 'Enter your name',
      className: 'form-control form-control-sm',
      labelClass: null,
      groupClass: null,
      required: true,
    },
    type: {
      type: 'SELECT',
      label: 'Variable Type',
      placeholder: 'Enter your name',
      // className: "form-control-sm",
      options: [
        { value: '', label: 'Select' },
        { value: 'stateVars', label: 'State' },
        { value: 'otherVars', label: 'Other' },
        { value: 'refVars', label: 'Ref' },
      ],
      required: true,
    },
    body: {
      type: 'OBJECT',
      // className: "mb-2 row",
      // label: "Body",
      properties: {
        datatype: {
          type: 'SELECT',
          label: 'Data Type',
          placeholder: 'Enter your Description',
          // className: "form-control-sm",
          required: true,
          options: [
            { value: '', label: 'Select' },
            { value: 'STRING', label: 'STRING' },
            { value: 'NUMERIC', label: 'NUMERIC' },
            { value: 'BOOLEAN', label: 'BOOLEAN' },
            { value: 'ARRAY', label: 'ARRAY' },
            { value: 'FUNCTION', label: 'FUNCTION' },
            { value: 'OBJECT', label: 'OBJECT' },
            { value: 'COMPONENT', label: 'COMPONENT' },
            { value: 'ELEMENT', label: 'ELEMENT' },
            { value: 'ANY', label: 'ANY' },
          ],
        },
        declarationType: {
          type: 'SELECT',
          label: 'Declaration Type',
          placeholder: 'Enter your Description',
          // className: "form-control-sm",
          required: true,
          options: [
            { value: '', label: 'Select' },
            { value: 'const', label: 'Const' },
            { value: 'let', label: 'Let' },
            { value: 'var', label: 'Var' },
          ],
          condition: {
            operation: 'ANY',
            conditions: [
              {
                conditionType: 'ORDINARY',
                operand: 'type',
                operandValue: 'otherVars',
                operandValueIsDynamic: false,
                operator: '===',
                type: 'UNARY',
              },
            ],
          },
        },
        description: {
          type: 'TEXT',
          label: 'Description',
          placeholder: 'Enter your name',
          // className: "form-control-sm",
          required: true,
        },
        defaultValue: {
          type: 'MONACO',
          label: 'Default Value',
          styles: {
            height: '100px',
            width: '100%',
          },
          // id:{isEditing ? `editor-${formState?.id}` : "prop-value"}
          language: 'javascript',
        },
      },
    },
  },
};
export const OtherSampleMaps = {
  // {
  //   type: 'TEXT',
  //   label: 'Name',
  //   validation: {
  //     required: true,
  //     minLength: 2,
  //     maxLength: 50,
  //     pattern: /^[a-zA-Z ]+$/,
  //     noSpaces: false,
  //   },
  //   onBlur: (e) => console.log('Name field blurred:', e.target.value),
  //   placeholder: 'Enter your name',
  // },
  // {
  //   type: 'NUMBER',
  //   label: 'Age',
  //   validation: {
  //     required: true,
  //     min: 0,
  //     max: 120,
  //     noSpaces: true,
  //   },
  //   onBlur: (e) => console.log('Age field blurred:', e.target.value),
  //   placeholder: 'Enter your age',
  // },
  // {
  //   label: 'Role',
  //   type: 'TEXT',
  //   validation: {
  //     required: true,
  //     minLength: 1,
  //     maxLength: 20,
  //     requireSpaces: false,
  //   },
  //   placeholder: 'Enter your role',
  //   readOnly: true,
  // },
  // {
  //   label: 'Select a role',
  //   type: 'SELECT',
  //   options: [
  //     { value: '', label: 'Select a role' },
  //     { value: 'admin', label: 'Admin' },
  //     { value: 'user', label: 'User' },
  //     { value: 'guest', label: 'Guest' },
  //   ],
  //   validation: {
  //     required: true,
  //   },
  // },
  // {
  //   type: 'CHECKBOX',
  //   label: 'Subscribe to newsletter',
  //   validation: {
  //     required: false,
  //   },
  // },
  // {
  //   type: 'RADIO',
  //   label: 'Gender',
  //   options: [
  //     { value: 'male', label: 'Male' },
  //     { value: 'female', label: 'Female' },
  //     { value: 'other', label: 'Other' },
  //   ],
  //   validation: {
  //     required: true,
  //   },
  // },
  // {
  //   type: 'BUTTON',
  //   label: 'Submit',
  //   onClick: () => {
  //     alert('Submit button clicked!');
  //   },
  // },
};

export const propConfigMapping = {
  type: 'OBJECT',
  properties: {
    name: {
      type: 'TEXT',
      label: 'Prop Name',
      placeholder: 'Enter your name',
      className: 'form-control form-control-sm',
      labelClass: null,
      groupClass: null,
      required: true,
    },
    body: {
      type: 'OBJECT',
      // className: "mb-2 row",
      // label: "Body",
      properties: {
        isRequired: {
          type: 'CHECKBOX',
          label: 'Is Required',
        },
        datatype: {
          type: 'SELECT',
          label: 'Data Type',
          placeholder: 'Enter your Description',
          // className: "form-control-sm",
          required: true,
          options: [
            { value: '', label: 'Select' },
            { value: 'STRING', label: 'STRING' },
            { value: 'NUMERIC', label: 'NUMERIC' },
            { value: 'BOOLEAN', label: 'BOOLEAN' },
            { value: 'ARRAY', label: 'ARRAY' },
            { value: 'FUNCTION', label: 'FUNCTION' },
            { value: 'OBJECT', label: 'OBJECT' },
            { value: 'COMPONENT', label: 'COMPONENT' },
            { value: 'ELEMENT', label: 'ELEMENT' },
            { value: 'ANY', label: 'ANY' },
          ],
        },
        declarationType: {
          type: 'SELECT',
          label: 'Declaration Type',
          placeholder: 'Enter your Description',
          // className: "form-control-sm",
          required: true,
          options: [
            { value: '', label: 'Select' },
            { value: 'const', label: 'Const' },
            { value: 'let', label: 'Let' },
            { value: 'var', label: 'Var' },
          ],
          condition: {
            operation: 'ANY',
            conditions: [
              {
                conditionType: 'ORDINARY',
                operand: 'type',
                operandValue: 'otherVars',
                operandValueIsDynamic: false,
                operator: '===',
                type: 'UNARY',
              },
            ],
          },
        },
        description: {
          type: 'TEXT',
          label: 'Description',
          placeholder: 'Enter your name',
          // className: "form-control-sm",
          required: true,
        },
        defaultValue: {
          type: 'MONACO',
          label: 'Default Value',
          styles: {
            height: '100px',
            width: '100%',
          },
          // id:{isEditing ? `editor-${formState?.id}` : "prop-value"}
          language: 'javascript',
        },
      },
    },
  },
};

export const functionConfigMapping = {
  type: 'OBJECT',
  // groupClass: 'd-flex',
  properties: {
    name: {
      type: 'TEXT',
      placeholder: 'Function name',
      labelClass: null,
      groupClass: null,
      required: true,
    },
    isAsync: {
      type: 'CHECKBOX',
      label: 'Is Async',
      labelClass: null,
      groupClass: null,
      required: true,
    },
    isAnonymous: {
      type: 'CHECKBOX',
      label: 'Is Anonymous',
      labelClass: null,
      groupClass: null,
      required: true,
    },
    // description: {
    //   type: "TEXT",
    //   label: "Description",
    //   placeholder: "Description",
    //   required: true,
    // },
    // body: {
    //   type: "OBJECT",
    //   // className: "mb-2 row",
    //   // label: "Body",
    //   properties: {
    //     isRequired: {
    //       type: "CHECKBOX",
    //       label: "Is Required",
    //     },
    //     datatype: {
    //       type: "SELECT",
    //       label: "Data Type",
    //       placeholder: "Enter your Description",
    //       // className: "form-control-sm",
    //       required: true,
    //       options: [
    //         { value: "", label: "Select" },
    //         { value: "STRING", label: "STRING" },
    //         { value: "NUMERIC", label: "NUMERIC" },
    //         { value: "BOOLEAN", label: "BOOLEAN" },
    //         { value: "ARRAY", label: "ARRAY" },
    //         { value: "FUNCTION", label: "FUNCTION" },
    //         { value: "OBJECT", label: "OBJECT" },
    //         { value: "COMPONENT", label: "COMPONENT" },
    //         { value: "ELEMENT", label: "ELEMENT" },
    //         { value: "ANY", label: "ANY" },
    //       ],
    //     },
    //     declarationType: {
    //       type: "SELECT",
    //       label: "Declaration Type",
    //       placeholder: "Enter your Description",
    //       // className: "form-control-sm",
    //       required: true,
    //       options: [
    //         { value: "", label: "Select" },
    //         { value: "const", label: "Const" },
    //         { value: "let", label: "Let" },
    //         { value: "var", label: "Var" },
    //       ],
    //       condition: {
    //         operation: "ANY",
    //         conditions: [
    //           {
    //             conditionType: "ORDINARY",
    //             operand: "type",
    //             operandValue: "otherVars",
    //             operandValueIsDynamic: false,
    //             operator: "===",
    //             type: "UNARY",
    //           },
    //         ],
    //       },
    //     },
    //     description: {
    //       type: "TEXT",
    //       label: "Description",
    //       placeholder: "Enter your name",
    //       // className: "form-control-sm",
    //       required: true,
    //     },
    //     defaultValue: {
    //       type: "MONACO",
    //       label: "Default Value",
    //       styles: {
    //         height: "100px",
    //         width: "100%",
    //       },
    //       // id:{isEditing ? `editor-${formState?.id}` : "prop-value"}
    //       language: "javascript",
    //     },
    //   },
    // },
  },
};
export const functionConfigMapping2 = {
  type: 'OBJECT',
  groupClass: 'd-flex w-100 ',
  // className: "m-1",
  properties: {
    name: {
      groupClass: 'w-100',
      className: 'form-control form-control-sm',
      type: 'TEXT',
      placeholder: 'Function name',
      labelClass: null,
      required: true,
    },
    type: {
      className: 'form-control form-control-sm',
      groupClass: 'w-100',
      type: 'SELECT',
      placeholder: 'Enter your Description',
      required: true,
      options: [
        { value: '', label: 'Select' },
        { value: 'STRING', label: 'STRING' },
        { value: 'NUMERIC', label: 'NUMERIC' },
        { value: 'BOOLEAN', label: 'BOOLEAN' },
        { value: 'ARRAY', label: 'ARRAY' },
        { value: 'FUNCTION', label: 'FUNCTION' },
        { value: 'OBJECT', label: 'OBJECT' },
        { value: 'COMPONENT', label: 'COMPONENT' },
        { value: 'ELEMENT', label: 'ELEMENT' },
        { value: 'ANY', label: 'ANY' },
      ],
    },
    value: {
      className: 'form-control form-control-sm',
      groupClass: 'w-100',
      type: 'TEXT',
      placeholder: 'Value',
      labelClass: null,
      required: true,
    },
    description: {
      className: ' form-control form-control-sm ',
      type: 'TEXT',
      placeholder: 'Function name',
      labelClass: null,
      groupClass: 'w-100',
      required: true,
    },
  },
};
