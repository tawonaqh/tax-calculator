/**
 * Shared Validation Utilities
 * Input validation functions used across calculators
 */

export const validateRequired = (value, fieldName) => {
  if (!value || value === '' || value === null || value === undefined) {
    return `${fieldName} is required`
  }
  return null
}

export const validateNumeric = (value, fieldName) => {
  if (value && isNaN(parseFloat(value))) {
    return `${fieldName} must be a valid number`
  }
  return null
}

export const validatePositive = (value, fieldName) => {
  if (value && parseFloat(value) < 0) {
    return `${fieldName} must be a positive number`
  }
  return null
}

export const validateRange = (value, min, max, fieldName) => {
  const num = parseFloat(value)
  if (value && (num < min || num > max)) {
    return `${fieldName} must be between ${min} and ${max}`
  }
  return null
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (email && !emailRegex.test(email)) {
    return 'Invalid email address'
  }
  return null
}

export const validateForm = (formData, rules) => {
  const errors = {}
  
  Object.keys(rules).forEach(field => {
    const value = formData[field]
    const fieldRules = rules[field]
    
    for (const rule of fieldRules) {
      const error = rule(value, field)
      if (error) {
        errors[field] = error
        break
      }
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
