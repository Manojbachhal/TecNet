
/**
 * Helper function to extract caliber from title or description
 */
export const extractCaliber = (title: string, description: string): string => {
  const fullText = `${title} ${description}`.toLowerCase();
  
  // Common caliber patterns
  const calibers = [
    '5.56', '7.62', '.223', '.308', '9mm', '.45', '.22lr', 
    '6.5 creedmoor', '300 win mag', '12ga', '20ga', '.30-06'
  ];
  
  for (const caliber of calibers) {
    if (fullText.includes(caliber)) {
      return caliber;
    }
  }
  
  return 'Unknown';
};

/**
 * Get default ballistic values based on caliber
 */
export const getBallisticDefaults = (title: string, description: string) => {
  const caliber = extractCaliber(title, description);
  const caliberLower = caliber.toLowerCase();
  
  // Default values based on common calibers
  if (caliberLower.includes('223') || caliberLower.includes('5.56')) {
    return { bulletWeight: 55, muzzleVelocity: 3250, ballisticCoefficient: 0.243 };
  } else if (caliberLower.includes('308') || caliberLower.includes('7.62')) {
    return { bulletWeight: 168, muzzleVelocity: 2680, ballisticCoefficient: 0.447 };
  } else if (caliberLower.includes('9mm')) {
    return { bulletWeight: 115, muzzleVelocity: 1150, ballisticCoefficient: 0.145 };
  } else if (caliberLower.includes('45')) {
    return { bulletWeight: 230, muzzleVelocity: 850, ballisticCoefficient: 0.195 };
  } else if (caliberLower.includes('300')) {
    return { bulletWeight: 200, muzzleVelocity: 2700, ballisticCoefficient: 0.625 };
  } else if (caliberLower.includes('6.5') || caliberLower.includes('creedmoor')) {
    return { bulletWeight: 140, muzzleVelocity: 2710, ballisticCoefficient: 0.625 };
  } else if (caliberLower.includes('12ga') || caliberLower.includes('12 ga')) {
    return { bulletWeight: 437, muzzleVelocity: 1300, ballisticCoefficient: 0.145 };
  }
  
  // Generic default for unknown calibers
  return { bulletWeight: 150, muzzleVelocity: 2700, ballisticCoefficient: 0.365 };
};
