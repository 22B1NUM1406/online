// Placeholder URLs for missing images
// Use external service - no local files needed!

export const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/600x400/e5e7eb/6b7280?text=No+Image';

export const SHARE_IMAGE = 'https://via.placeholder.com/1200x630/1e40af/ffffff?text=BizCo+Print+Shop';

export const AVATAR_IMAGE = 'https://via.placeholder.com/200x200/3b82f6/ffffff?text=User';

export const PRODUCT_PLACEHOLDER = 'https://via.placeholder.com/600x400/dbeafe/1e40af?text=Product+Image';

export const BLOG_PLACEHOLDER = 'https://via.placeholder.com/800x400/f3e8ff/7c3aed?text=Blog+Image';

export const SERVICE_PLACEHOLDER = 'https://via.placeholder.com/600x400/fef3c7/f59e0b?text=Service+Image';

// Helper to get appropriate placeholder based on type
export const getPlaceholder = (type = 'default') => {
  const placeholders = {
    product: PRODUCT_PLACEHOLDER,
    blog: BLOG_PLACEHOLDER,
    service: SERVICE_PLACEHOLDER,
    share: SHARE_IMAGE,
    avatar: AVATAR_IMAGE,
    default: PLACEHOLDER_IMAGE
  };
  
  return placeholders[type] || PLACEHOLDER_IMAGE;
};