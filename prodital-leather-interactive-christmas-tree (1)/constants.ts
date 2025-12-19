
import * as THREE from 'three';

export const COLORS = {
  emerald: '#012015', 
  emeraldDeep: '#00140D',
  silver: '#C0C0C0',
  silverHighlight: '#F5F5F7', 
  palePink: '#FADADD',
  silverPink: '#E6BDC8', 
  lightGold: '#E6BE8A', 
  goldHighlight: '#F9E4B7', 
  black: '#000000', 
  white: '#FFFFFF',
  pearlWhite: '#F0F0F5', 
  // Refined palette: Increased frequency and variety of Silver/Platinum/Diamond tones
  gemColors: [
    '#F5F5F7', // Pure Platinum
    '#E5E4E2', // Platinum
    '#D1D1D1', // Bright Silver
    '#B8B8B8', // Polished Silver
    '#A9A9A9', // Dark Silver
    '#FFFFFF', // Diamond White
    '#012015', // Deep Emerald
    '#001F18', // Midnight Emerald
    '#E6BE8A', // Pale Gold
    '#D4AFB9', // Metallic Rose
    '#FBCFE8', // Pink Diamond
  ], 
};

export const TREE_CONFIG = {
  foliageCount: 35000,
  ornamentCount: 450, 
  pearlCount: 1500, // Increased for dense necklace strings
  lightCount: 200,
  treeHeight: 12,
  treeBaseRadius: 4.5,
  chaosRadius: 15,
};

export const GREETINGS = [
  "May your holidays be filled with joy and laughter!",
  "Wishing you a season of peace and love.",
  "Merry Christmas from the Prodital Leather Team!",
  "Cheers to a wonderful New Year ahead.",
  "Warmest wishes for a bright holiday season.",
  "May the magic of Christmas fill your heart.",
  "Luxury in every stitch, joy in every moment.",
  "Elegant holidays to you and yours."
];

/**
 * Creates a 5-pointed star shape.
 */
export const starGeometry = () => {
  const shape = new THREE.Shape();
  const radius = 1;
  const innerRadius = 0.4;
  const points = 5;
  
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points;
    const r = i % 2 === 0 ? radius : innerRadius;
    const x = Math.cos(angle - Math.PI / 2) * r;
    const y = Math.sin(angle - Math.PI / 2) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  
  shape.closePath();
  return shape;
};
