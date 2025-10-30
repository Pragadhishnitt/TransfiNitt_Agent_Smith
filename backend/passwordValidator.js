// passwordValidator.js

/**
 * Password validation requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */

export const passwordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true
};

/**
 * Validates password against requirements
 * @param {string} password - Password to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password) {
    return {
      isValid: false,
      errors: ['Password is required']
    };
  }

  // Check minimum length
  if (password.length < passwordRequirements.minLength) {
    errors.push(`Password must be at least ${passwordRequirements.minLength} characters long`);
  }

  // Check for uppercase letter
  if (passwordRequirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Check for lowercase letter
  if (passwordRequirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Check for number
  if (passwordRequirements.requireNumber && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Check for special character
  if (passwordRequirements.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>?/)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Express middleware for password validation
 */
export const validatePasswordMiddleware = (req, res, next) => {
  const { password } = req.body;

  const validation = validatePassword(password);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_PASSWORD',
        message: 'Password does not meet requirements',
        details: validation.errors
      }
    });
  }

  next();
};

/**
 * Get password strength score (0-4)
 * 0 = Very Weak
 * 1 = Weak
 * 2 = Fair
 * 3 = Good
 * 4 = Strong
 */
export const getPasswordStrength = (password) => {
  let score = 0;

  if (!password) return { score: 0, label: 'Very Weak' };

  // Length score
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Character variety
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

  // Cap at 4
  score = Math.min(score, 4);

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  
  return {
    score,
    label: labels[score]
  };
};

/**
 * Check if password is commonly used (basic check)
 */
const commonPasswords = [
  'password', '123456', '12345678', 'qwerty', 'abc123',
  'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
  'baseball', 'iloveyou', 'master', 'sunshine', 'ashley',
  'bailey', 'shadow', '123123', '654321', 'superman',
  'password1', 'password123'
];

export const isCommonPassword = (password) => {
  return commonPasswords.includes(password.toLowerCase());
};

/**
 * Enhanced password validation with common password check
 */
export const validatePasswordEnhanced = (password) => {
  const basicValidation = validatePassword(password);

  if (!basicValidation.isValid) {
    return basicValidation;
  }

  // Check for common passwords
  if (isCommonPassword(password)) {
    return {
      isValid: false,
      errors: ['This password is too common. Please choose a more unique password.']
    };
  }

  // Check for sequential characters
  if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)) {
    return {
      isValid: false,
      errors: ['Password should not contain sequential characters (e.g., abc, 123)']
    };
  }

  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    return {
      isValid: false,
      errors: ['Password should not contain repeated characters (e.g., aaa, 111)']
    };
  }

  return {
    isValid: true,
    errors: []
  };
};

/**
 * Middleware for enhanced password validation
 */
export const validatePasswordEnhancedMiddleware = (req, res, next) => {
  const { password } = req.body;

  const validation = validatePasswordEnhanced(password);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_PASSWORD',
        message: 'Password does not meet requirements',
        details: validation.errors
      }
    });
  }

  next();
};