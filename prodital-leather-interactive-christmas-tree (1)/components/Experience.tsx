
import React, { useMemo } from 'react';
import { Foliage } from './Foliage';
import { Ornaments } from './Ornaments';
import { Star } from './Star';
import { FairyDust } from './FairyDust';
import { TreeState } from '../types';
import { TREE_CONFIG, COLORS } from '../constants';
import * as THREE from 'three';

interface ExperienceProps {
  treeState: TreeState;
}

const Experience: React.FC<ExperienceProps> = ({ treeState }) => {
  const foliageData = useMemo(() => {
    const data = [];
    for (let i = 0; i < TREE_CONFIG.foliageCount; i++) {
      const rChaos = Math.random() * TREE_CONFIG.chaosRadius;
      const thetaChaos = Math.random() * Math.PI * 2;
      const phiChaos = Math.acos(2 * Math.random() - 1);
      const chaosPos: [number, number, number] = [
        rChaos * Math.sin(phiChaos) * Math.cos(thetaChaos),
        rChaos * Math.sin(phiChaos) * Math.sin(thetaChaos),
        rChaos * Math.cos(phiChaos)
      ];

      const h = Math.random() * TREE_CONFIG.treeHeight;
      const t = h / TREE_CONFIG.treeHeight;
      const tiers = 6;
      const tierBump = (t * tiers) % 1.0; 
      const rMaxAtH = (1 - t) * TREE_CONFIG.treeBaseRadius * (1 + Math.pow(tierBump, 2) * 0.15);
      
      const rDist = Math.pow(Math.random(), 0.7); 
      const r = rDist * rMaxAtH;
      const theta = Math.random() * Math.PI * 2;
      
      const targetPos: [number, number, number] = [
        r * Math.cos(theta),
        h - TREE_CONFIG.treeHeight / 2,
        r * Math.sin(theta)
      ];

      data.push({ chaosPos, targetPos, size: Math.random() * 0.05 + 0.02 });
    }
    return data;
  }, []);

  const ornamentData = useMemo(() => {
    const data = [];

    // 1. Gems: Placed slightly inside the foliage tips for a layered effect
    for (let i = 0; i < TREE_CONFIG.ornamentCount; i++) {
      const rChaos = Math.random() * TREE_CONFIG.chaosRadius;
      const thetaChaos = Math.random() * Math.PI * 2;
      const phiChaos = Math.acos(2 * Math.random() - 1);
      const chaosPos: [number, number, number] = [
        rChaos * Math.sin(phiChaos) * Math.cos(thetaChaos),
        rChaos * Math.sin(phiChaos) * Math.sin(thetaChaos),
        rChaos * Math.cos(phiChaos)
      ];

      const h = Math.random() * TREE_CONFIG.treeHeight;
      const t = h / TREE_CONFIG.treeHeight;
      const tiers = 6;
      const tierBump = (t * tiers) % 1.0;
      const rMaxAtH = (1 - t) * TREE_CONFIG.treeBaseRadius * (1 + Math.pow(tierBump, 2) * 0.2);
      
      // Layering: Move gems slightly inward so pearls can drape OUTSIDE
      const r = rMaxAtH * 0.85; 
      const theta = Math.random() * Math.PI * 2;
      const targetPos: [number, number, number] = [
        r * Math.cos(theta),
        h - TREE_CONFIG.treeHeight / 2,
        r * Math.sin(theta)
      ];

      data.push({
        chaosPos,
        targetPos,
        type: 'gem',
        color: COLORS.gemColors[Math.floor(Math.random() * COLORS.gemColors.length)],
        weight: 0.05
      });
    }

    // 2. Pearl Necklaces: Continuous strings draping on the OUTSIDE layer
    const numNecklaces = 10;
    const pearlsPerNecklace = Math.floor(TREE_CONFIG.pearlCount / numNecklaces);
    for (let n = 0; n < numNecklaces; n++) {
      const startAngle = (n * Math.PI * 2) / numNecklaces;
      for (let i = 0; i < pearlsPerNecklace; i++) {
        const rChaos = (Math.random() - 0.5) * TREE_CONFIG.chaosRadius * 2;
        const yChaos = (Math.random() - 0.5) * TREE_CONFIG.chaosRadius * 2;
        const zChaos = (Math.random() - 0.5) * TREE_CONFIG.chaosRadius * 2;
        const chaosPos: [number, number, number] = [rChaos, yChaos, zChaos];

        const t = i / pearlsPerNecklace;
        const h = t * TREE_CONFIG.treeHeight;
        
        // Tighter spiral for necklaces to feel like wrapped strings
        const spiralRotations = 6;
        const theta = startAngle + t * Math.PI * 2 * spiralRotations;
        
        const rMaxAtH = (1 - t) * TREE_CONFIG.treeBaseRadius;
        
        // Sagging effect: pearls hang down and push slightly outward between attachment points
        // Use a high-frequency sine wave to simulate sagging segments
        const sagFrequency = 24; 
        const sagVal = Math.sin(t * Math.PI * sagFrequency);
        const verticalSag = Math.max(0, sagVal) * 0.25;
        const radialPush = Math.max(0, sagVal) * 0.2;

        // OUTSIDE placement: r is > 1.0 multiplier of base radius
        const r = rMaxAtH * 1.12 + radialPush; 

        const targetPos: [number, number, number] = [
          r * Math.cos(theta),
          h - TREE_CONFIG.treeHeight / 2 - verticalSag,
          r * Math.sin(theta)
        ];

        data.push({
          chaosPos,
          targetPos,
          type: 'pearl',
          color: COLORS.pearlWhite,
          weight: 0.03
        });
      }
    }

    // 3. Lights: Deep inside the foliage for internal glow
    for (let i = 0; i < TREE_CONFIG.lightCount; i++) {
      const rChaos = (Math.random() - 0.5) * TREE_CONFIG.chaosRadius * 2;
      const yChaos = (Math.random() - 0.5) * TREE_CONFIG.chaosRadius * 2;
      const zChaos = (Math.random() - 0.5) * TREE_CONFIG.chaosRadius * 2;
      const chaosPos: [number, number, number] = [rChaos, yChaos, zChaos];

      const h = Math.random() * TREE_CONFIG.treeHeight;
      const t = h / TREE_CONFIG.treeHeight;
      const rMaxAtH = (1 - t) * TREE_CONFIG.treeBaseRadius;
      const r = rMaxAtH * 0.5; 
      const theta = Math.random() * Math.PI * 2;
      const targetPos: [number, number, number] = [
        r * Math.cos(theta),
        h - TREE_CONFIG.treeHeight / 2,
        r * Math.sin(theta)
      ];

      data.push({
        chaosPos,
        targetPos,
        type: 'light',
        color: COLORS.palePink,
        weight: 0.02
      });
    }

    return data;
  }, []);

  return (
    <group>
      <Foliage data={foliageData} treeState={treeState} />
      <Ornaments data={ornamentData} treeState={treeState} />
      <Star treeState={treeState} />
      <FairyDust treeState={treeState} />
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -TREE_CONFIG.treeHeight/2 - 0.1, 0]} receiveShadow>
        <circleGeometry args={[20, 64]} />
        <meshStandardMaterial 
          color={COLORS.black} 
          roughness={0.1} 
          metalness={0.8} 
        />
      </mesh>
    </group>
  );
};

export default Experience;
