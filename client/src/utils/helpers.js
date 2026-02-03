// Format price to Mongolian currency
export const formatPrice = (price) => {
  return new Intl.NumberFormat('mn-MN').format(price) + '₮';
};

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format date with time
export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get order status label
export const getOrderStatusLabel = (status) => {
  const labels = {
    pending: 'Хүлээгдэж буй',
    paid: 'Төлөгдсөн',
    processing: 'Үйлдвэрлэлд',
    completed: 'Дууссан',
    cancelled: 'Цуцлагдсан',
  };
  return labels[status] || status;
};

// Get order status color
export const getOrderStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

// Get quotation status label
export const getQuotationStatusLabel = (status) => {
  const labels = {
    pending: 'Хүлээгдэж буй',
    replied: 'Хариулсан',
    completed: 'Дууссан',
    cancelled: 'Цуцлагдсан',
  };
  return labels[status] || status;
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone
export const isValidPhone = (phone) => {
  const re = /^[0-9]{8}$/;
  return re.test(phone.replace(/\s/g, ''));
};

// Get full image URL
import { PLACEHOLDER_IMAGE } from './placeholders';

export const getImageUrl = (imagePath) => {
  // If no path, return placeholder
  if (!imagePath) {
    return PLACEHOLDER_IMAGE;
  }
  
  // If full URL (Cloudinary, etc), return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If local /uploads/ path, construct full URL
  if (imagePath.startsWith('/uploads/')) {
    // Get base URL and remove /api suffix if present
    const apiUrl = import.meta.env.VITE_API_URL || window.location.origin;
    const baseUrl = apiUrl.replace(/\/api\/?$/, '');
    return `${baseUrl}${imagePath}`;
  }
  
  // If relative path starting with /, make it absolute
  if (imagePath.startsWith('/')) {
    return `${window.location.origin}${imagePath}`;
  }
  
  // Fallback: return placeholder
  return PLACEHOLDER_IMAGE;
};