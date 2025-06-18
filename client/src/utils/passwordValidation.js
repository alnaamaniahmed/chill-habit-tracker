export const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
};

export const checkWeakPatterns = (password, username = "", email = "") => {
  const weakPatterns = [
    /^(?:123456|password|qwerty|abc123|letmein|welcome|admin|guest)$/i,
  ];
  
  if (username) {
    weakPatterns.push(new RegExp(username, 'i'));
  }
  
  if (email) {
    weakPatterns.push(new RegExp(email.split('@')[0], 'i'));
  }
  
  return weakPatterns.some(pattern => pattern.test(password));
};