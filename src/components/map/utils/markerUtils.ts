export const getPlaceType = (types: string[] | string): string => {
  if (!types || (Array.isArray(types) && types.length === 0)) return 'shop';
  
  // Convert types array to a single lowercase string for easier pattern matching
  const stringTypes = Array.isArray(types) ? types.join(' ').toLowerCase() : typeof types === 'string' ? types.toLowerCase() : '';
  
  // Debug log to see what types we're receiving
  console.log("Processing types:", stringTypes);
  
  // Enhanced name-based detection for search results
  const keywords = {
    range: ['shooting range', 'range', 'target practice', 'firing range', 'sport shooting'],
    shop: ['gun store', 'firearm store', 'weapons store', 'firearms dealer', 'ammo store'],
    gunsmith: ['gunsmith', 'gun repair', 'firearms service', 'weapon customization'],
    training: ['firearms training', 'gun class', 'tactical training', 'shooting school'],
    museum: ['firearms museum', 'gun history', 'weapon exhibit'],
    clay: ['clay shooting', 'skeet', 'trap shooting', 'sporting clays']
  };

  // Check keywords for each type
  for (const [type, typeKeywords] of Object.entries(keywords)) {
    if (typeKeywords.some(keyword => stringTypes.includes(keyword))) {
      return type;
    }
  }

  // More aggressive name-based detection
  const aggressiveKeywords = {
    range: ['outdoor', 'sport', 'recreation', 'target'],
    training: ['tactical', 'class', 'learn', 'school'],
    gunsmith: ['custom', 'repair', 'service', 'build'],
    museum: ['history', 'collect', 'exhibit'],
    clay: ['club', 'sports_club']
  };

  for (const [type, typeKeywords] of Object.entries(aggressiveKeywords)) {
    if (typeKeywords.some(keyword => stringTypes.includes(keyword))) {
      return type;
    }
  }

  // Specific business names or keywords
  if (stringTypes.includes('arms') || 
      stringTypes.includes('ammo') || 
      stringTypes.includes('firearms') ||
      stringTypes.includes('weapon')) {
    return 'shop';
  }

  // If no specific type found, default to shop but log for investigation
  console.log("Defaulting to 'shop' for types:", stringTypes);
  return 'shop';
};

// No changes needed in getMarkerIcon function
export const getMarkerIcon = (type: string): { url: string } => {
  let color = '';
  let bgColor = '';
  
  console.log("Getting marker icon for type:", type);
  
  switch(type) {
    case 'range':
      color = '#ff4d4d';
      bgColor = '#ffeeee';
      break;
    case 'shop': 
      color = '#4d94ff';
      bgColor = '#eef4ff';
      break;
    case 'gunsmith':
      color = '#ffa64d';
      bgColor = '#fff4e6';
      break;
    case 'training':
      color = '#4dff88';
      bgColor = '#eeffee';
      break;
    case 'museum':
      color = '#cb4dff';
      bgColor = '#f4eeff';
      break;
    case 'clay':
      color = '#ffcc4d';
      bgColor = '#fffbea';
      break;
    default:
      console.warn("Unknown marker type:", type);
      color = '#4d94ff'; // Default to shop color
      bgColor = '#eef4ff';
  }
  
  return {
    url: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
        <path d="M16 4c6.6 0 12 5.4 12 12 0 8-12 20-12 20S4 24 4 16c0-6.6 5.4-12 12-12z" 
              fill="${bgColor}" stroke="${color}" stroke-width="2" filter="url(#shadow)"/>
        <circle cx="16" cy="16" r="5" fill="${color}"/>
      </svg>
    `)}`
  };
};
