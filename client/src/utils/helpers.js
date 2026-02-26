// Format price with thousand separators
export const formatPrice = (price) => {
  if (!price && price !== 0) return '0';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Get full image URL (UPDATED for Facebook sharing)
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://www.bizco.mn/images/default-product.jpg';
  }
  
  // If already absolute URL
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Get backend URL from environment or use production URL
  const baseUrl = import.meta.env.VITE_API_URL || 'https://online-production-0222.up.railway.app';
  
  // Ensure proper path formatting
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // Return absolute URL for social sharing
  return `${baseUrl}${cleanPath}`;
};

// Format date
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate slug from text
export const generateSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Mongolia)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{8}$/;
  return phoneRegex.test(phone);
};