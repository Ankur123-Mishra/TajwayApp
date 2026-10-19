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
