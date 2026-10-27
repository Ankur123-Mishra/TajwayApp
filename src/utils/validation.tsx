export const required = value =>
  value != null && String(value).trim().length > 0;

export const isValidIndianMobile = mobile => {
  const digits = String(mobile || '').replace(/\D/g, '');
  const ten = digits.length > 10 ? digits.slice(-10) : digits;
  return /^[6-9]\d{9}$/.test(ten);
};

export const isValidEmail = email =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());

export const isValidIFSC = ifsc =>
  /^[A-Z]{4}0[A-Z0-9]{6}$/i.test(String(ifsc || '').trim());

export const isValidPincode = pincode =>
  /^[1-9][0-9]{5}$/.test(String(pincode || '').trim());

/** Personal Information field limits */
export const FULL_NAME_MIN = 2;
export const FULL_NAME_MAX = 50;
export const COMPANY_NAME_MIN = 2;
export const COMPANY_NAME_MAX = 100;
export const EMAIL_MAX = 100;

export const validateFullName = value => {
  const name = String(value || '').trim();
  if (!required(name)) {
    return 'Please enter your full name';
  }
  if (name.length < FULL_NAME_MIN) {
    return `Full name must be at least ${FULL_NAME_MIN} characters`;
  }
  if (name.length > FULL_NAME_MAX) {
    return `Full name must be at most ${FULL_NAME_MAX} characters`;
  }
  if (!/^[a-zA-Z\s.'-]+$/.test(name)) {
    return 'Full name can only contain letters, spaces, and . \' -';
  }
  return null;
};

export const validateCompanyName = value => {
  const company = String(value || '').trim();
  if (!required(company)) {
    return 'Please enter your company name';
  }
  if (company.length < COMPANY_NAME_MIN) {
    return `Company name must be at least ${COMPANY_NAME_MIN} characters`;
  }
  if (company.length > COMPANY_NAME_MAX) {
    return `Company name must be at most ${COMPANY_NAME_MAX} characters`;
  }
  return null;
};

/** Email is optional; validate format only when provided. */
export const validateOptionalEmail = value => {
  const email = String(value || '').trim();
  if (!email) {
    return null;
  }
  if (email.length > EMAIL_MAX) {
    return `Email must be at most ${EMAIL_MAX} characters`;
  }
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};
