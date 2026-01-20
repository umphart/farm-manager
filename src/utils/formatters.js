// Naira currency formatting
export const formatNaira = (amount) => {
  if (!amount && amount !== 0) return '₦0';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Number formatting
export const formatNumber = (number) => {
  if (!number && number !== 0) return '0';
  return new Intl.NumberFormat('en-NG').format(number);
};

// Date formatting
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Short date formatting
export const formatShortDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric'
  });
};