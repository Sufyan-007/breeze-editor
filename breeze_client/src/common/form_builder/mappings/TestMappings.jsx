export const sampleMap = [
  {
    order: 1,
    name: 'name',
    type: 'TEXT',
    label: 'Name',
    validation: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z ]+$/,
      noSpaces: false,
    },
    onBlur: (e) => console.log('Name field blurred:', e.target.value),
    placeholder: 'Enter your name',
  },
  {
    order: 2,
    name: 'age',
    type: 'NUMBER',
    label: 'Age',
    validation: {
      required: true,
      min: 0,
      max: 120,
      noSpaces: true,
    },
    onBlur: (e) => console.log('Age field blurred:', e.target.value),
    placeholder: 'Enter your age',
  },
  {
    order: 3,
    name: 'role',
    label: 'Role',
    type: 'TEXT',
    validation: {
      required: true,
      minLength: 1,
      maxLength: 20,
      requireSpaces: false,
    },
    placeholder: 'Enter your role',
    readOnly: true,
  },
  {
    order: 4,
    name: 'role',
    label: 'Select a role',
    type: 'SELECT',
    options: [
      { value: '', label: 'Select a role' },
      { value: 'admin', label: 'Admin' },
      { value: 'user', label: 'User' },
      { value: 'guest', label: 'Guest' },
    ],
    validation: {
      required: true,
    },
  },
  {
    order: 6,
    name: 'subscribed',
    type: 'CHECKBOX',
    label: 'Subscribe to newsletter',
    validation: {
      required: false,
    },
    style: {
      wrapper: { marginBottom: '10px' },
      label: { marginLeft: '5px' },
    },
  },
  {
    order: 7,
    name: 'gender',
    type: 'RADIO',
    label: 'Gender',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
    ],
    validation: {
      required: true,
    },
    style: {
      wrapper: { marginBottom: '10px' },
      label: { marginLeft: '5px' },
    },
  },
  {
    order: 5,
    name: 'submit',
    type: 'BUTTON',
    label: 'Submit',
    onClick: () => {
      alert('Submit button clicked!');
    },
    style: { backgroundColor: 'gray', color: 'white' },
    ariaLabel: 'Submit form',
  },
];

export const loginMappings = [
  {
    order: 1,
    name: 'username',
    type: 'TEXT',
    label: 'Username',
    validation: {
      required: true,
      minLength: 5,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9]+$/,
      noSpaces: false,
    },
    onBlur: (e) => console.log('Username field blurred:', e.target.value),
    placeholder: 'Enter your username',
  },
  {
    order: 2,
    name: 'password',
    type: 'TEXT',
    label: 'Password',
    validation: {
      required: true,
      minLength: 5,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9]+$/,
      noSpaces: true,
    },
    onBlur: (e) => console.log('Password field blurred:', e.target.value),
    placeholder: 'Enter your Password',
  },
  {
    order: 3,
    name: 'rememberMe',
    type: 'CHECKBOX',
    // label: 'Remember This Device',
    validation: {
      required: false,
    },
  },
  {
    order: 4,
    name: 'signin',
    type: 'BUTTON',
    label: 'Sign In',
    onClick: () => {
      alert('Submit button clicked!');
    },
  },
];
