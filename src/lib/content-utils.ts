/**
 * Check if content is actually empty (not just whitespace or empty HTML tags)
 */
export const isContentEmpty = (content: string | null | undefined): boolean => {
  if (!content) return true;
  
  // Remove HTML tags and check if only whitespace remains
  const textContent = content.replace(/<[^>]*>/g, '').trim();
  return textContent === '';
};

/**
 * Clean content by removing empty HTML tags and whitespace
 * Returns null, undefined, or empty string for truly empty content
 */
export const cleanContent = (content: string | null | undefined): string | null => {
  if (!content) return null;
  
  // Remove empty paragraph tags and whitespace
  const cleaned = content
    .replace(/<p>\s*&nbsp;\s*<\/p>/g, '') // Remove <p>&nbsp;</p>
    .replace(/<p>\s*<\/p>/g, '') // Remove empty <p></p>
    .trim();
  
  return cleaned === '' ? null : cleaned;
};

/**
 * Clean content for form submission - converts empty content to undefined
 */
export const cleanContentForSubmission = (content: string | null | undefined): string | null => {
  const cleaned = cleanContent(content);
  return cleaned === null ? null : cleaned;
}; 

/**
 * Convert HTML content to plain text
 * @param html The HTML content to convert
 * @returns Plain text without HTML tags
 */
export const htmlToText = (html: string | null | undefined): string => {
  if (!html) return '';
  
  return html
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .trim();
};

/**
 * Convert HTML content to plain text with better formatting
 * @param html The HTML content to convert
 * @returns Plain text with proper spacing and formatting
 */
export const htmlToTextAdvanced = (html: string | null | undefined): string => {
  if (!html) return '';
  
  return html
    // Replace common HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '...')
    
    // Replace block elements with line breaks
    .replace(/<\/?(div|p|br|h[1-6]|section|article|header|footer|main|aside|nav)[^>]*>/gi, '\n')
    
    // Replace list items
    .replace(/<\/?li[^>]*>/gi, '\n• ')
    
    // Replace table elements
    .replace(/<\/?(table|tr|td|th)[^>]*>/gi, ' ')
    
    // Remove all remaining HTML tags
    .replace(/<[^>]*>/g, '')
    
    // Clean up multiple spaces and line breaks
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();
};

/**
 * Convert HTML to text using DOM parser (client-side only)
 * @param html The HTML content to convert
 * @returns Plain text
 */
export const htmlToTextDOM = (html: string | null | undefined): string => {
  if (!html || typeof window === 'undefined') return '';
  
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  return tempElement.textContent || tempElement.innerText || '';
}; 