import React from 'react';
import DOMPurify from 'dompurify';

interface SafeHtmlRendererProps {
  html: string;
  className?: string;
}

/**
 * Sanitizes and safely renders rich HTML content generated from TipTap editor
 */
export const SafeHtmlRenderer: React.FC<SafeHtmlRendererProps> = ({ html, className = '' }) => {
  const cleanHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'b', 'i', 'u', 'strong', 'em', 's', 'strike',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'hr', 'br',
      'a', 'span'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
  });

  return (
    <div
      className={`prose prose-sm sm:prose-base max-w-none text-[#121316] leading-relaxed break-words font-medium ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};
