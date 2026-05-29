import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Middleware factory that validates request body fields against a schema of rules
export function validate(schema) {
  return (req, res, next) => {
    const errors = [];
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];
      for (const rule of rules) {
        const error = rule(value, field);
        if (error) {
          errors.push(error);
          break;
        }
      }
    }

    if (errors.length > 0) {
      return next(new AppError(errors.join('; '), 400, ERROR_CODES.VALIDATION_ERROR));
    }

    next();
  };
}

// Validates that a field value is present
export const required = (value, field) => {
  if (value === undefined || value === null || value === '') {
    return `${field} is required`;
  }
  return null;
};

// Validates that a field value is a valid email format
export const isEmail = (value, field) => {
  if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return `${field} must be a valid email`;
  }
  return null;
};

// Validates that a field value meets a minimum length
export const minLength = (min) => (value, field) => {
  if (value && value.length < min) {
    return `${field} must be at least ${min} characters`;
  }
  return null;
};
