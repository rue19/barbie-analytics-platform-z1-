export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

export const validateEmail = (email: string): string => {
  if (!email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
  return '';
};

export const validatePassword = (password: string): string => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  }
  return '';
};

export const validateUsername = (username: string): string => {
  if (!username.trim()) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
  return '';
};

export const getPasswordStrength = (password: string) => {
  if (!password) return { strength: 0, label: '' };
  
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[^a-zA-Z\d]/.test(password)) strength += 1;

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = ['red', 'orange', 'yellow', 'lightgreen', 'green', 'darkgreen'];
  
  return { 
    strength, 
    label: labels[strength],
    color: colors[strength]
  };
};