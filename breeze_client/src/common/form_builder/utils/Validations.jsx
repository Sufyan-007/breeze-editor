export const validateField = (value, validation) => {
  if (typeof value === 'boolean') {
    if (validation.required && value === undefined) return 'This field is required.';
    return null;
  }
  // to remove leading and trailing spaces
  const trimmedValue = value ? value.trim() : '';

  // Normal validations
  if (validation.required && !trimmedValue) return 'This field is required.';
  if (validation.minLength && trimmedValue.length < validation.minLength)
    return `Must be at least ${validation.minLength} characters.`;
  if (validation.maxLength && trimmedValue.length > validation.maxLength)
    return `Must be at most ${validation.maxLength} characters.`;
  if (validation.pattern && !validation.pattern.test(trimmedValue)) return 'Invalid format.';
  if (validation.min !== undefined && Number(trimmedValue) < validation.min)
    return `Value must be at least ${validation.min}.`;
  if (validation.max !== undefined && Number(trimmedValue) > validation.max)
    return `Value must be at most ${validation.max}.`;

  // Space-specific checks
  if (validation.noSpaces && /\s/.test(trimmedValue)) return 'Spaces are not allowed.';
  if (validation.requireSpaces && !/\s/.test(trimmedValue)) return 'At least one space is required.';

  return null;
};
