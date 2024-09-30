export const validateField = (value, validation) => {
  const errors = [];
  if (typeof value === 'boolean') {
    if (validation.required && value === undefined) errors.push('This field is required.');
    return errors;
  }
  // to remove leading and trailing spaces
  const trimmedValue = value ? value.trim() : '';

  // Normal validations
  if (validation.required && !trimmedValue) errors.push('This field is required.');
  if (validation.minLength && trimmedValue.length < validation.minLength)
    errors.push(`Must be at least ${validation.minLength} characters.`);
  if (validation.maxLength && trimmedValue.length > validation.maxLength)
    errors.push(`Must be at most ${validation.maxLength} characters.`);
  if (validation.pattern && !validation.pattern.test(trimmedValue)) errors.push('Invalid format.');
  if (validation.min !== undefined && Number(trimmedValue) < validation.min)
    errors.push(`Value must be at least ${validation.min}.`);
  if (validation.max !== undefined && Number(trimmedValue) > validation.max)
    errors.push(`Value must be at most ${validation.max}.`);

  // Space-specific checks
  if (validation.noSpaces && /\s/.test(trimmedValue)) errors.push('Spaces are not allowed.');
  if (validation.requireSpaces && !/\s/.test(trimmedValue)) errors.push('At least one space is required.');

  return errors;
};
