const required = (value) => {
  return !value ? 'This field is required!' : '';
};

const numberValidation = (value) => {
  return isNaN(value) ? 'Please enter a valid number!' : '';
};

const lengthValidation = (value, minLength = 5) => {
  return value && value.length < minLength ? `Please enter at least ${minLength} characters!` : '';
};

const usernameValidation = (value) => {
  return /\s/.test(value) ? 'Username should not contain spaces!' : '';
};

const emailValidation = (value) => {
  return !/\S+@\S+\.\S+/.test(value) ? 'Please enter a valid email address!' : '';
};

const passwordValidation = (value) => {
  return value && value.length < 8 ? 'Password should be at least 8 characters!' : '';
};

const confirmPasswordValidation = (value, password) => {
  return value && value !== password ? 'Passwords do not match!' : '';
};

const phoneValidation = (value) => {
  return !/^\+?\d{1,3}?[- ]?\(?(?:\d{2,3})\)?[- ]?\d\d\d[- ]?\d\d[- ]?\d\d$/.test(value)
    ? 'Please enter a valid phone number!'
    : '';
};

export const validator = {
  REQUIRED: required,
  NUMBER_VALIDATION: numberValidation,
  LENGTH_VALIDATION: lengthValidation,
  USERNAME_VALIDATION: usernameValidation,
  EMAIL_VALIDATION: emailValidation,
  PASSWORD_VALIDATION: passwordValidation,
  CONFIRM_PASSWORD_VALIDATION: confirmPasswordValidation,
  PHONE_VALIDATION: phoneValidation,
};
