export const isValidFullName = (fullName: string): boolean => {
  return /^[A-Za-z]+([ ]+[A-Za-z]+){1,2}$/.test(fullName);
};

export const isValidUserName = (userId: string): boolean => {
  return /^[a-zA-Z0-9_-]{3,20}$/.test(userId);
};

export const isValidateEmail = (email: string): boolean => {
  //return !!String(email).match(/^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?@hiteshi\.com$/);
  return !!String(email).match(/^[^@]+@hiteshi\.com$/);
};

export const isValidOTP = (otp: string): boolean => {
  return /^[0-9]{6}$/.test(otp);
};
