// client/src/components/MetaTags.jsx
import { useEffect } from 'react';

const MetaTags = ({
  title,
  description,
  image,
  url,
  type = 'website',
  siteName = 'BizCo Print Shop',
}) => {
  useEffect(() => {
    const origin = window.location.origin;

    // default image
    const defaultImage = `${origin}/default-share-image.jpg`;
    const shareImage = image || defaultImage;

    // full urls
    const fullUrl = url?.startsWith('http')
      ? url
      : `${origin}${url || ''}`;

    const fullImageUrl = shareImage?.startsWith('http')
      ? shareImage
      : `${origin}${shareImage}`;

    // title
    document.title = `${title} | ${siteName}`;

    // helper
    const setMeta = (attr, key, value) => {
      if (!value) return;
      let tag = document.querySelector(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', value);
    };

    // basic meta
    setMeta('name', 'description', description);

    // Open Graph
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', fullUrl);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', fullImageUrl);
    setMeta('property', 'og:site_name', siteName);
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');

    // Twitter / X
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:url', fullUrl);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', fullImageUrl);
  }, [title, description, image, url, type, siteName]);

  return null;
};

export default MetaTags;
