import { Helmet } from 'react-helmet-async';

const MetaTags = ({ 
  title, 
  description, 
  image, 
  url, 
  type = 'website',
  siteName = 'BizCo Print Shop'
}) => {
  // Default image if none provided
  const defaultImage = `${window.location.origin}/default-share-image.jpg`;
  const shareImage = image || defaultImage;
  
  // Ensure full URL
  const fullUrl = url?.startsWith('http') ? url : `${window.location.origin}${url}`;
  const fullImageUrl = shareImage?.startsWith('http') ? shareImage : `${window.location.origin}${shareImage}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title} | {siteName}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* LinkedIn */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </Helmet>
  );
};

export default MetaTags;