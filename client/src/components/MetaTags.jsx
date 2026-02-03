import { useEffect } from 'react';

const MetaTags = ({ 
  title, 
  description, 
  image, 
  url, 
  type = 'website',
  siteName = 'BizCo Print Shop'
}) => {
  useEffect(() => {
    if (!title || !description) {
      console.warn('MetaTags: Missing required props (title or description)');
      return;
    }

    // Default image if none provided
    const defaultImage = `${window.location.origin}/default-share-image.jpg`;
    const shareImage = image || defaultImage;
    
    // Ensure full URLs
    const fullUrl = url?.startsWith('http') 
      ? url 
      : `${window.location.origin}${url || window.location.pathname}`;
    
    const fullImageUrl = shareImage?.startsWith('http') 
      ? shareImage 
      : `${window.location.origin}${shareImage}`;

    // Debug logging
    console.log('🔖 MetaTags Updated:', {
      title,
      description: description.substring(0, 50) + '...',
      image: fullImageUrl,
      url: fullUrl
    });

    // Update document title
    document.title = `${title} | ${siteName}`;

    // Update or create meta tags
    const updateMetaTag = (selector, attribute, content) => {
      let element = document.querySelector(selector);
      
      if (!element) {
        element = document.createElement('meta');
        const [attrName, attrValue] = selector.match(/\[(.+?)="(.+?)"\]/).slice(1);
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      
      element.setAttribute(attribute || 'content', content);
    };

    try {
      // Basic meta tags
      updateMetaTag('meta[name="title"]', 'content', title);
      updateMetaTag('meta[name="description"]', 'content', description);

      // Open Graph / Facebook
      updateMetaTag('meta[property="og:type"]', 'content', type);
      updateMetaTag('meta[property="og:url"]', 'content', fullUrl);
      updateMetaTag('meta[property="og:site_name"]', 'content', siteName);
      updateMetaTag('meta[property="og:title"]', 'content', title);
      updateMetaTag('meta[property="og:description"]', 'content', description);
      updateMetaTag('meta[property="og:image"]', 'content', fullImageUrl);
      updateMetaTag('meta[property="og:image:width"]', 'content', '1200');
      updateMetaTag('meta[property="og:image:height"]', 'content', '630');
      updateMetaTag('meta[property="og:image:alt"]', 'content', title);

      // Twitter
      updateMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
      updateMetaTag('meta[name="twitter:url"]', 'content', fullUrl);
      updateMetaTag('meta[name="twitter:title"]', 'content', title);
      updateMetaTag('meta[name="twitter:description"]', 'content', description);
      updateMetaTag('meta[name="twitter:image"]', 'content', fullImageUrl);
      updateMetaTag('meta[name="twitter:image:alt"]', 'content', title);

      console.log('✅ Meta tags updated successfully');
    } catch (error) {
      console.error('❌ Error updating meta tags:', error);
    }

    // Cleanup function
    return () => {
      // Optional: Reset to defaults on unmount
      // document.title = siteName;
    };
  }, [title, description, image, url, type, siteName]);

  // This component doesn't render anything
  return null;
};

export default MetaTags;