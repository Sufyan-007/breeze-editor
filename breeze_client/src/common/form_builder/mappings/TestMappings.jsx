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
  label: 'Life Cycle Config Form',
  className: 'm-2 d-block',
  properties: {
    name: {
      type: 'TEXT',
      label: 'Name',
      placeholder: 'Enter your name',
      className: '',
      required: true,
    },
    body: {
      type: 'OBJECT',
      label: 'Body',
      properties: {
        description: {
          type: 'TEXT',
          label: 'Description',
          placeholder: 'Enter your Description',
          className: 'mx-3',
          required: true,
        },
        lifecycleType: {
          type: 'RADIO',
          label: 'LifeCycleType',
          placeholder: 'Enter your lifecycle type',
          className: 'mx-3',
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
