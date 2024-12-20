//Full name Validation
export const isValidFullName = (fullName: string): boolean => {
  return /^[A-Za-z]+([ ]+[A-Za-z]+){1,2}$/.test(fullName);
};

// Username validation
export const isValidUserName = (userId: string): boolean => {
  return /^[a-zA-Z0-9_-]{3,20}$/.test(userId);
};

// Email validation with regex
export const isValidateEmail = (email: string): boolean => {
  return !!String(email)
    .toLowerCase()
    .match(/^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?@hiteshi\.com$/);
};

//OTP validation
export const isValidOTP = (otp: string): boolean => {
  return /^[0-9]{6}$/.test(otp);
};
