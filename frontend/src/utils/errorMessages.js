// ============================================
// CONVERT SERVER ERRORS → FRIENDLY MESSAGES
// ============================================

const ERROR_MAP = {
  // Auth
  'Invalid credentials': 'The email or password you entered is incorrect.',
  'Email already registered': 'This email is already registered. Try signing in instead.',
  'Email already exists': 'This email is already registered. Try signing in instead.',
  'User not found': "We couldn't find an account with that email.",
  'Invalid or expired reset token': 'Your reset link has expired. Please request a new one.',
  'Current password incorrect': 'Your current password is incorrect.',
  'Current password is incorrect': 'Your current password is incorrect.',
  'Passwords do not match': "The passwords you entered don't match.",
  'Not authorized': 'Please sign in to continue.',
  'Invalid token': 'Your session has expired. Please sign in again.',
  'Authentication failed': 'Please sign in again to continue.',

  // Validation
  'Validation failed': 'Please check the highlighted fields and try again.',
  'Email is required': 'Please enter your email address.',
  'Password is required': 'Please enter your password.',
  'Password must be at least 6 characters': 'Your password must be at least 6 characters long.',
  'No file uploaded': 'Please select a file to upload.',

  // Resources
  'Workout not found': "We couldn't find that workout. It may have been deleted.",
  'Entry not found': "We couldn't find that entry. It may have been deleted.",
  'Progress not found': "We couldn't find that entry. It may have been deleted.",
  'Feedback not found': "We couldn't find that feedback.",
  'Notification not found': "We couldn't find that notification.",
  'User not found': "We couldn't find that user.",

  // Admin
  'Cannot remove the last admin': "You can't remove the last admin account.",
  'Cannot delete the last admin': "You can't delete the last admin account.",
  'You cannot delete your own account': "You can't delete your own account while signed in.",
  'Role': 'Invalid role. Please try again.',

  // Generic
  'Failed to fetch': "We couldn't connect to the server. Check your internet connection.",
  'Network Error': "We couldn't connect to the server. Check your internet connection.",
  'Request failed with status code 401': 'Please sign in to continue.',
  'Request failed with status code 403': "You don't have permission to do that.",
  'Request failed with status code 404': "We couldn't find what you were looking for.",
  'Request failed with status code 429': 'Too many attempts. Please wait a moment and try again.',
  'Request failed with status code 500': 'Something went wrong on our end. Please try again in a moment.',
};

// ============================================
// MAIN FUNCTION — returns friendly message
// ============================================
export function getFriendlyError(error) {
  // 1. No response — network issue
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'The request timed out. Please check your connection and try again.';
    }
    if (error.message === 'Network Error') {
      return "We couldn't connect to the server. Check your internet connection.";
    }
    return "We couldn't connect to the server. Please try again.";
  }

  const { status, data } = error.response;

  // 2. Prefer mapped message
  if (data?.message) {
    const mapped = ERROR_MAP[data.message];
    if (mapped) return mapped;
    // If message looks safe (short, no stack), return it
    if (typeof data.message === 'string' && data.message.length < 200 && !data.message.includes('at ')) {
      return data.message;
    }
  }

  // 3. Status-based fallback
  switch (status) {
    case 400:
      return 'Some information was missing or incorrect. Please check and try again.';
    case 401:
      return 'Please sign in to continue.';
    case 403:
      return "You don't have permission to do that.";
    case 404:
      return "We couldn't find what you were looking for.";
    case 409:
      return 'That already exists. Try a different value.';
    case 422:
      return 'Please check the highlighted fields and try again.';
    case 429:
      return 'Too many attempts. Please wait a moment and try again.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Something went wrong on our end. Please try again in a moment.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

// ============================================
// SUCCESS MESSAGES (consistent across app)
// ============================================
export const SUCCESS_MESSAGES = {
  LOGIN: 'Welcome back!',
  REGISTER: 'Account created. Please sign in.',
  LOGOUT: 'You have been signed out.',
  PROFILE_UPDATED: 'Your profile has been updated.',
  PASSWORD_CHANGED: 'Your password has been changed.',
  WORKOUT_CREATED: 'Workout logged successfully.',
  WORKOUT_UPDATED: 'Workout updated.',
  WORKOUT_DELETED: 'Workout deleted.',
  MEAL_CREATED: 'Meal logged successfully.',
  MEAL_UPDATED: 'Meal updated.',
  MEAL_DELETED: 'Meal deleted.',
  PROGRESS_CREATED: 'Progress saved.',
  PROGRESS_DELETED: 'Entry deleted.',
  FEEDBACK_SENT: 'Thanks for your feedback!',
  NOTIFICATION_READ: 'Marked as read.',
  AVATAR_UPLOADED: 'Profile picture updated.',
  SETTINGS_SAVED: 'Settings saved.',
  STORY_SUBMITTED: 'Story submitted for review.',
};