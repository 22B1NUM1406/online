import React from 'react';

/**
 * TextDisplay Component
 * Displays text with preserved formatting:
 * - Line breaks
 * - Paragraphs
 * - Basic HTML tags (p, br, ul, ol, li)
 * - Sanitized output
 */
const TextDisplay = ({ text, className = '' }) => {
  if (!text) return null;

  // Format text with line breaks and paragraphs
  const formatText = (rawText) => {
    // Remove dangerous HTML tags
    const sanitized = rawText
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');

    // Convert double line breaks to paragraphs
    const withParagraphs = sanitized
      .split('\n\n')
      .map(para => para.trim())
      .filter(para => para.length > 0)
      .map(para => `<p class="mb-4">${para}</p>`)
      .join('');

    // Convert single line breaks to <br>
    const withLineBreaks = withParagraphs.replace(/\n/g, '<br />');

    return withLineBreaks;
  };

  return (
    <div 
      className={`text-gray-700 leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: formatText(text) }}
    />
  );
};

export default TextDisplay;