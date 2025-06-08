
// Map calibers to ballistic data
export const caliberToBulletType: Record<string, string> = {
  // Pistol calibers
  '9mm': 'fmj9mm',
  '.45 ACP': '45acp',
  '.45': '45acp',
  '.380': 'fmj9mm', // Similar to 9mm for simplicity
  '.38 Special': 'fmj9mm', // Similar to 9mm for simplicity
  '.357': 'fmj9mm', // Approximation
  '.40 S&W': '45acp', // More similar to .45 than 9mm
  '10mm': '45acp', // Approximation
  
  // Rifle calibers
  '.223': '223rem',
  '.223 Remington': '223rem',
  '5.56': '223rem',
  '5.56 NATO': '223rem',
  '.308': '308win',
  '.308 Winchester': '308win',
  '7.62x51': '308win',
  '7.62': '308win',
  '7.62x39': '308win', // Approximation
  '6.5': '6.5cm',
  '6.5 Creedmoor': '6.5cm',
  '.300 Win Mag': '300wm',
  '.300': '300wm',
  '.300 Blackout': '300wm', // Approximation
  
  // Shotgun
  '12 gauge': '12gauge',
  '12ga': '12gauge',
  '20 gauge': '12gauge', // Approximation
  '20ga': '12gauge', // Approximation
  '410': '12gauge', // Approximation
};

// Map gun types to default zero ranges
export const gunTypeToZeroRange: Record<string, number> = {
  'pistol': 25,
  'handgun': 25,
  'revolver': 25,
  'rifle': 100,
  'shotgun': 50,
  'ar': 100,
  'ar-15': 100,
  'ak': 100,
  'ak-47': 100,
  'bolt action': 100,
  'dmr': 100,
  'sniper': 200,
};

// Extract caliber from firearm data
export const extractCaliber = (title: string, description: string = ''): string => {
  // Common caliber patterns
  const calibers = [
    '9mm', '.45 ACP', '.45', '.380', '.38 Special', '.357', '.40 S&W', '10mm',
    '.223', '.223 Remington', '5.56', '5.56 NATO', '.308', '.308 Winchester',
    '7.62x51', '7.62', '7.62x39', '6.5', '6.5 Creedmoor', '.300 Win Mag',
    '.300', '.300 Blackout', '12 gauge', '12ga', '20 gauge', '20ga', '410'
  ];
  
  // Check title first
  for (const caliber of calibers) {
    if (title.toLowerCase().includes(caliber.toLowerCase())) {
      return caliber;
    }
  }
  
  // Then check description
  for (const caliber of calibers) {
    if (description.toLowerCase().includes(caliber.toLowerCase())) {
      return caliber;
    }
  }
  
  // Default to .223 if nothing found (common caliber)
  return '.223';
};

// Determine gun type from title/description
export const extractGunType = (title: string, description: string = ''): string => {
  const gunTypes = [
    'pistol', 'handgun', 'revolver', 'rifle', 'shotgun', 
    'ar', 'ar-15', 'ak', 'ak-47', 'bolt action', 'dmr', 'sniper'
  ];
  
  // Check title first
  for (const type of gunTypes) {
    if (title.toLowerCase().includes(type.toLowerCase())) {
      return type;
    }
  }
  
  // Then check description
  for (const type of gunTypes) {
    if (description.toLowerCase().includes(type.toLowerCase())) {
      return type;
    }
  }
  
  // Default to rifle
  return 'rifle';
};

// Get appropriate bullet type based on firearm data
export const getBallisticDefaults = (title: string, description: string = '') => {
  const caliber = extractCaliber(title, description);
  const gunType = extractGunType(title, description);
  
  const bulletType = caliberToBulletType[caliber] || '223rem'; // Default to .223 if unknown
  const zeroRange = gunTypeToZeroRange[gunType] || 100; // Default to 100 yards if unknown
  
  return {
    bulletType,
    zeroRange,
    caliber, // Include caliber in the return object
    // Default environmental conditions
    windSpeed: 10,
    windAngle: 90
  };
};
