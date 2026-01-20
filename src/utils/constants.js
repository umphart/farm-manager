// Nigerian currency formatter
export const formatNaira = (amount) => {
  if (amount === null || amount === undefined) return '₦0';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Number formatter
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '0';
  return new Intl.NumberFormat('en-NG').format(number);
};

// Date formatter
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Time formatter
export const formatTime = (time) => {
  if (!time) return '';
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Short date formatter
export const formatShortDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric'
  });
};

// Status colors
export const statusColors = {
  active: 'success',
  inactive: 'default',
  pending: 'warning',
  completed: 'success',
  in_progress: 'info',
  cancelled: 'error',
  draft: 'default',
  published: 'success',
  archived: 'default',
  low: 'warning',
  medium: 'info',
  high: 'error',
  critical: 'error'
};

// Common categories
export const expenseCategories = [
  'Feed & Nutrition',
  'Medication & Vaccines',
  'Labor & Wages',
  'Equipment & Machinery',
  'Maintenance & Repairs',
  'Utilities (Water, Electricity)',
  'Transport & Logistics',
  'Veterinary Services',
  'Marketing & Sales',
  'Administrative',
  'Insurance',
  'Rent & Lease',
  'Other'
];

export const livestockTypes = [
  { value: 'fish', label: 'Fish', icon: '🐟', color: '#2196F3' },
  { value: 'poultry', label: 'Poultry', icon: '🐔', color: '#4CAF50' },
  { value: 'goat', label: 'Goat', icon: '🐐', color: '#FF9800' },
  { value: 'sheep', label: 'Sheep', icon: '🐑', color: '#E91E63' },
  { value: 'cattle', label: 'Cattle', icon: '🐄', color: '#795548' },
];

export const healthStatuses = [
  { value: 'excellent', label: 'Excellent', color: 'success' },
  { value: 'good', label: 'Good', color: 'success' },
  { value: 'fair', label: 'Fair', color: 'warning' },
  { value: 'poor', label: 'Poor', color: 'error' },
  { value: 'critical', label: 'Critical', color: 'error' },
];

export const taskPriorities = [
  { value: 'low', label: 'Low', color: 'success' },
  { value: 'medium', label: 'Medium', color: 'warning' },
  { value: 'high', label: 'High', color: 'error' },
  { value: 'critical', label: 'Critical', color: 'error' },
];

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};