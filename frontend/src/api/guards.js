import { validateForm, loginSchema, registerSchema } from '../utils/validators';

// ============================================
// PRE-FLIGHT VALIDATORS
// Block bad requests before they hit the server
// ============================================

/**
 * Validate login request
 * @returns { valid: boolean, error: string | null }
 */
export function guardLogin(payload) {
  const { isValid, errors } = validateForm(payload, loginSchema);
  if (!isValid) {
    const firstError = Object.values(errors)[0];
    return { valid: false, error: firstError };
  }
  return { valid: true, error: null };
}

/**
 * Validate register request
 */
export function guardRegister(payload) {
  const { isValid, errors } = validateForm(payload, registerSchema);
  if (!isValid) {
    const firstError = Object.values(errors)[0];
    return { valid: false, error: firstError };
  }
  return { valid: true, error: null };
}

/**
 * Validate file upload
 */
export function guardFileUpload(file, { maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = {}) {
  if (!file) return { valid: false, error: 'Please select a file.' };

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Only ${allowedTypes.map((t) => t.split('/')[1].toUpperCase()).join(', ')} files are allowed.`,
    };
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File must be less than ${maxSizeMB} MB.`,
    };
  }

  return { valid: true, error: null };
}

/**
 * Sanitize string input (defense in depth — backend also validates)
 */
export function sanitizeString(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/<[^>]*>/g, '').trim();
}