export const formatCurrency = (amount, currency = 'INR') => {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount ?? 0);
  } catch {
    return `₹${amount ?? 0}`;
  }
};

export const capitalize = value => {
  if (!value || typeof value !== 'string') {
    return '';
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
};
