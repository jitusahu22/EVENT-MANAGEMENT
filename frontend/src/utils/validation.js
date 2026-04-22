export const validationRules = {
  email: (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return '';
  },
  
  phone: (value) => {
    if (!value) return 'Phone number is required';
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(value)) return 'Please enter a valid phone number (e.g., +1 555-000-0000)';
    return '';
  },
  
  username: (value) => {
    if (!value) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (value.length > 30) return 'Username must be less than 30 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
    return '';
  },
  
  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    if (value.length > 100) return 'Password must be less than 100 characters';
    return '';
  },
  
  name: (value) => {
    if (!value) return 'Name is required';
    if (value.length < 2) return 'Name must be at least 2 characters';
    if (value.length > 100) return 'Name must be less than 100 characters';
    return '';
  },
  
  membershipNumber: (value) => {
    if (!value) return 'Membership number is required';
    if (value.length < 3) return 'Membership number must be at least 3 characters';
    if (value.length > 50) return 'Membership number must be less than 50 characters';
    if (!/^[A-Za-z0-9\-]+$/.test(value)) return 'Membership number can only contain letters, numbers, and hyphens';
    return '';
  },
  
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) return 'This field is required';
    return '';
  }
};

export const validateField = (fieldName, value) => {
  const validator = validationRules[fieldName];
  if (validator) {
    return validator(value);
  }
  return '';
};

export const validateForm = (formData, rules) => {
  const errors = {};
  for (const field in rules) {
    const error = validateField(rules[field], formData[field]);
    if (error) {
      errors[field] = error;
    }
  }
  return errors;
};
