
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeState } from '../types';
import { COLORS, TREE_CONFIG } from '../constants';

interface FairyDustProps {
  treeState: TreeState;
}

export const FairyDust: React.FC<FairyDustProps> = ({ treeState }) => {
  const count = 200;
  const pointsRef = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const data = Array.from({ length: count }, () => ({
      angle: Math.random() * Math.PI * 2,
      height: Math.random() * TREE_CONFIG.treeHeight,
      speed: 0.2 + Math.random() * 0.5,
      radiusOffset: Math.random() * 0.5
    }));
    return { pos, data };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    particles.data.forEach((p, i) => {
      const i3 = i * 3;
      if (treeState === TreeState.FORMED) {
        p.height = (p.height + p.speed * 0.1) % TREE_CONFIG.treeHeight;
        p.angle += 0.02;
        const currentH = p.height - TREE_CONFIG.treeHeight / 2;
        const rAtH = (1 - p.height / TREE_CONFIG.treeHeight) * TREE_CONFIG.treeBaseRadius + p.radiusOffset + 0.2;
        
        posArray[i3] = Math.cos(p.angle) * rAtH;
        posArray[i3 + 1] = currentH;
        posArray[i3 + 2] = Math.sin(p.angle) * rAtH;
      } else {
        // Explode outward
        posArray[i3] *= 1.02;
        posArray[i3 + 1] *= 1.02;
        posArray[i3 + 2] *= 1.02;
      }
    });
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.pos}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color={COLORS.silverHighlight}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};
