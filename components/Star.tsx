
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Extrude } from '@react-three/drei';
import * as THREE from 'three';
import { TreeState } from '../types';
import { COLORS, starGeometry, TREE_CONFIG } from '../constants';

interface StarProps {
  treeState: TreeState;
}

export const Star: React.FC<StarProps> = ({ treeState }) => {
  const meshRef = useRef<THREE.Group>(null!);
  const progress = useRef(0);
  const shape = useMemo(() => starGeometry(), []);

  const extrudeSettings = useMemo(() => ({
    steps: 1,
    depth: 0.15,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelOffset: 0,
    bevelSegments: 5
  }), []);

  const targetY = TREE_CONFIG.treeHeight / 2 + 1.2;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const targetProgress = treeState === TreeState.FORMED ? 1 : 0;
    progress.current = THREE.MathUtils.lerp(progress.current, targetProgress, 0.05);

    if (meshRef.current) {
      // In Formed state, it stays at top with a floating bob. In Chaos, it floats wildly in the space.
      const chaosY = Math.sin(t * 0.4) * 6;
      const chaosX = Math.cos(t * 0.6) * 7;
      const chaosZ = Math.sin(t * 0.5) * 5;
      
      const floatingOffset = Math.sin(t * 2.5) * 0.2;
      
      meshRef.current.position.y = THREE.MathUtils.lerp(chaosY, targetY + floatingOffset, progress.current);
      meshRef.current.position.x = THREE.MathUtils.lerp(chaosX, 0, progress.current);
      meshRef.current.position.z = THREE.MathUtils.lerp(chaosZ, 0, progress.current);
      
      // Gentle rotation for the star around its vertical axis
      meshRef.current.rotation.y += 0.02;
      meshRef.current.scale.setScalar(progress.current * 0.4 + 0.6);
    }
  });

  return (
    <group ref={meshRef}>
      <Extrude args={[shape, extrudeSettings]} rotation={[0, 0, 0]} position={[0, 0, -0.075]}>
        <meshStandardMaterial 
          color={COLORS.silver} 
          metalness={1} 
          roughness={0.05} 
          emissive={COLORS.silverHighlight} 
          emissiveIntensity={1.2} 
        />
      </Extrude>
      
      {/* Primary Silver Glow Halo */}
      <mesh scale={[1.8, 1.8, 1.8]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color={COLORS.silverHighlight} 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending} 
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer Golden Halo */}
      <mesh scale={[2.5, 2.5, 2.5]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color={COLORS.lightGold} 
          transparent 
          opacity={0.05} 
          blending={THREE.AdditiveBlending} 
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};
