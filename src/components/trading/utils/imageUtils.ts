
/**
 * Utility functions for handling images in trading components
 */

/**
 * Returns a fallback image URL based on the item title
 * @param title The title of the item to analyze
 * @returns A URL to an appropriate fallback image
 */
export const getReliableFallbackImage = (title: string): string => {
  const lowerTitle = title?.toLowerCase() || '';
  
  // Direct paths to our public images for better reliability
  const defaultHandgun = "/firearms/default-handgun.jpg";
  const defaultRifle = "/firearms/default-rifle.jpg";
  const defaultShotgun = "/firearms/default-shotgun.jpg";
  const defaultFirearm = "/firearms/default-firearm.jpg";
  
  if (lowerTitle.includes('glock') || lowerTitle.includes('pistol') || 
      lowerTitle.includes('handgun') || lowerTitle.includes('9mm') || 
      lowerTitle.includes('.45') || lowerTitle.includes('beretta')) {
    return defaultHandgun;
  } 
  else if (lowerTitle.includes('ar') || lowerTitle.includes('rifle') || 
           lowerTitle.includes('22lr') || lowerTitle.includes('carbine') || 
           lowerTitle.includes('5.56') || lowerTitle.includes('ruger')) {
    return defaultRifle;
  }
  else if (lowerTitle.includes('shotgun') || lowerTitle.includes('12 gauge') || 
           lowerTitle.includes('remington') || lowerTitle.includes('mossberg')) {
    return defaultShotgun;
  }
  
  return defaultFirearm;
};

/**
 * Cleans markdown formatting from AI-generated text for better display
 */
export const cleanMarkdownFormatting = (text: string): string => {
  return text
    .replace(/#{1,6}\s/g, '') // Remove headings (#, ##, etc.)
    .replace(/\*\*/g, '') // Remove bold formatting
    .replace(/\*/g, '') // Remove italics/bullet points
    .replace(/- /g, '• ') // Replace markdown lists with bullets
    .replace(/\n{3,}/g, '\n\n') // Replace multiple line breaks with double line breaks
    .split('\n')
    .map(line => line.trim())
    .join('\n');
};

/**
 * Check if an image URL is valid and accessible
 */
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  
  // Basic URL validation
  try {
    new URL(url);
    return true;
  } catch (e) {
    console.error("Invalid URL format:", url);
    return false;
  }
};

/**
 * Normalize image array to ensure consistent format
 * @param images The image array or string to normalize
 * @returns A properly formatted array of image URLs
 */
export const normalizeImages = (images: string[] | string | null | undefined): string[] => {
  if (!images) return [];
  
  // If it's a string, convert to array
  if (typeof images === 'string') {
    return [images];
  }
  
  // Filter out any invalid entries in the array
  return images.filter(img => !!img && typeof img === 'string' && img.trim() !== '');
};

/**
 * Get the first valid image URL from an array, or return fallback
 */
export const getFirstValidImage = (images: string[] | null | undefined, title: string): string => {
  const normalizedImages = normalizeImages(images);
  
  for (const img of normalizedImages) {
    if (isValidImageUrl(img)) {
      return img;
    }
  }
  
  // No valid images found, return fallback
  return getReliableFallbackImage(title);
};
