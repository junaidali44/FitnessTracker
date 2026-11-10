// VALIDATION REGEX PATTERNS
export const REGEX = {
  // Email — RFC 5322 simplified
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // Password — min 6 chars, at least 1 letter and 1 number
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,

  // Strong password — min 8, uppercase, lowercase, number, special
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

  // Name — letters, spaces, hyphens, apostrophes (2-100 chars)
  NAME: /^[a-zA-Z][a-zA-Z\s'-]{1,99}$/,

  // Phone — international format
  PHONE: /^\+?[1-9]\d{1,14}$/,

  // Number (positive, optional decimals)
  NUMBER: /^\d+(\.\d{1,2})?$/,

  // Integer
  INTEGER: /^\d+$/,

  // Username — alphanumeric + underscore (3-20)
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,

  // URL
  URL: /^https?:\/\/.+\..+/,

  // Mongo ObjectId
  OBJECT_ID: /^[a-fA-F0-9]{24}$/,

  // Date (YYYY-MM-DD)
  DATE: /^\d{4}-\d{2}-\d{2}$/,

  // Time (HH:MM)
  TIME: /^([01]\d|2[0-3]):([0-5]\d)$/,

  // No HTML/script tags
  NO_HTML: /^[^<>]*$/,

  // No special chars (for names in some contexts)
  SAFE_TEXT: /^[a-zA-Z0-9\s.,!?'"()-]*$/,
};

// FIELD VALIDATORS
// Each returns { valid: boolean, error: string | null }

export const validateEmail = (value) => {
  if (!value) return { valid: false, error: 'Email is required' };
  if (value.length > 254) return { valid: false, error: 'Email is too long' };
  if (!REGEX.EMAIL.test(value)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  return { valid: true, error: null };
};

export const validatePassword = (value, { strong = false } = {}) => {
  if (!value) return { valid: false, error: 'Password is required' };
  if (value.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }
  if (value.length > 128) {
    return { valid: false, error: 'Password is too long (max 128 characters)' };
  }
  if (strong) {
    if (!REGEX.STRONG_PASSWORD.test(value)) {
      return {
        valid: false,
        error: 'Password must contain uppercase, lowercase, number, and special character',
      };
    }
  } else {
    if (!REGEX.PASSWORD.test(value)) {
      return {
        valid: false,
        error: 'Password must contain at least one letter and one number',
      };
    }
  }
  return { valid: true, error: null };
};

export const validateConfirmPassword = (password, confirm) => {
  if (!confirm) return { valid: false, error: 'Please confirm your password' };
  if (password !== confirm) {
    return { valid: false, error: 'Passwords do not match' };
  }
  return { valid: true, error: null };
};

export const validateName = (value, field = 'Name') => {
  if (!value || !value.trim()) {
    return { valid: false, error: `${field} is required` };
  }
  if (value.trim().length < 2) {
    return { valid: false, error: `${field} must be at least 2 characters` };
  }
  if (value.trim().length > 100) {
    return { valid: false, error: `${field} is too long (max 100 characters)` };
  }
  if (!REGEX.NAME.test(value.trim())) {
    return {
      valid: false,
      error: `${field} can only contain letters, spaces, hyphens, and apostrophes`,
    };
  }
  return { valid: true, error: null };
};

export const validateNumber = (value, { min, max, field = 'Value', required = false } = {}) => {
  if (value === '' || value === null || value === undefined) {
    if (required) return { valid: false, error: `${field} is required` };
    return { valid: true, error: null };
  }
  const num = Number(value);
  if (isNaN(num)) {
    return { valid: false, error: `${field} must be a valid number` };
  }
  if (min !== undefined && num < min) {
    return { valid: false, error: `${field} must be at least ${min}` };
  }
  if (max !== undefined && num > max) {
    return { valid: false, error: `${field} must be at most ${max}` };
  }
  return { valid: true, error: null };
};

export const validatePositiveNumber = (value, field = 'Value') => {
  return validateNumber(value, { min: 0, field });
};

export const validateDate = (value, { required = false, past = false, future = false } = {}) => {
  if (!value) {
    if (required) return { valid: false, error: 'Date is required' };
    return { valid: true, error: null };
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Please enter a valid date' };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (past && date > today) {
    return { valid: false, error: 'Date cannot be in the future' };
  }
  if (future && date < today) {
    return { valid: false, error: 'Date cannot be in the past' };
  }
  return { valid: true, error: null };
};

export const validateRequired = (value, field = 'This field') => {
  if (value === null || value === undefined || value === '') {
    return { valid: false, error: `${field} is required` };
  }
  if (typeof value === 'string' && !value.trim()) {
    return { valid: false, error: `${field} is required` };
  }
  return { valid: true, error: null };
};

export const validateMaxLength = (value, max, field = 'This field') => {
  if (value && value.length > max) {
    return { valid: false, error: `${field} must be at most ${max} characters` };
  }
  return { valid: true, error: null };
};

export const validateMinLength = (value, min, field = 'This field') => {
  if (!value || value.length < min) {
    return { valid: false, error: `${field} must be at least ${min} characters` };
  }
  return { valid: true, error: null };
};

export const validateTags = (value, { max = 10, maxLength = 30 } = {}) => {
  if (!value) return { valid: true, error: null };
  const tags = value.split(',').map((t) => t.trim()).filter(Boolean);
  if (tags.length > max) {
    return { valid: false, error: `Maximum ${max} tags allowed` };
  }
  for (const tag of tags) {
    if (tag.length > maxLength) {
      return { valid: false, error: `Each tag must be at most ${maxLength} characters` };
    }
  }
  return { valid: true, error: null };
};

// ============================================
// FORM-LEVEL VALIDATOR (validates whole object)
// ============================================
export const validateForm = (data, schema) => {
  const errors = {};
  let isValid = true;

  for (const [field, validator] of Object.entries(schema)) {
    const result = validator(data[field], data);
    if (!result.valid) {
      errors[field] = result.error;
      isValid = false;
    }
  }

  return { isValid, errors };
};

// PRE-BUILT SCHEMAS
export const loginSchema = {
  email: (v) => validateEmail(v),
  password: (v) => validateRequired(v, 'Password'),
};

export const registerSchema = {
  fullName: (v) => validateName(v, 'Full name'),
  email: (v) => validateEmail(v),
  password: (v) => validatePassword(v),
  confirm: (v, data) => validateConfirmPassword(data.password, v),
};

export const workoutSchema = {
  name: (v) => validateName(v, 'Workout name'),
  category: (v) => validateRequired(v, 'Category'),
  duration: (v) => validateNumber(v, { min: 0, max: 600, field: 'Duration' }),
  caloriesBurned: (v) => validateNumber(v, { min: 0, max: 10000, field: 'Calories' }),
};

export const nutritionSchema = {
  mealType: (v) => validateRequired(v, 'Meal type'),
  date: (v) => validateDate(v, { required: true }),
};

export const progressSchema = {
  weight: (v) => validateNumber(v, { min: 20, max: 400, field: 'Weight' }),
  bodyFat: (v) => validateNumber(v, { min: 0, max: 70, field: 'Body fat' }),
};

export const feedbackSchema = {
  subject: (v) => validateName(v, 'Subject'),
  message: (v) => validateMinLength(v, 10, 'Message'),
};

export const profileSchema = {
  fullName: (v) => validateName(v, 'Full name'),
  age: (v) => validateNumber(v, { min: 10, max: 120, field: 'Age' }),
  height: (v) => validateNumber(v, { min: 50, max: 250, field: 'Height' }),
  weight: (v) => validateNumber(v, { min: 20, max: 400, field: 'Weight' }),
};

export const changePasswordSchema = {
  currentPassword: (v) => validateRequired(v, 'Current password'),
  newPassword: (v) => validatePassword(v),
  confirm: (v, data) => validateConfirmPassword(data.newPassword, v),
};