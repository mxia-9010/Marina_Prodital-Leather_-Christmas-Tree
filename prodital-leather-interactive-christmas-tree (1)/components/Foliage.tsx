
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleData, TreeState } from '../types';
import { COLORS } from '../constants';

interface FoliageProps {
  data: ParticleData[];
  treeState: TreeState;
}

export const Foliage: React.FC<FoliageProps> = ({ data, treeState }) => {
  const pointsRef = useRef<THREE.Points>(null!);
  const progress = useRef(0);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(data.length * 3);
    const sz = new Float32Array(data.length);
    data.forEach((p, i) => {
      sz[i] = p.size;
    });
    return [pos, sz];
  }, [data]);

  useFrame((state, delta) => {
    const targetProgress = treeState === TreeState.FORMED ? 1 : 0;
    progress.current = THREE.MathUtils.lerp(progress.current, targetProgress, 0.05);

    const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < data.length; i++) {
      const p = data[i];
      const i3 = i * 3;
      
      // Interpolate position based on progress
      positionsArray[i3] = THREE.MathUtils.lerp(p.chaosPos[0], p.targetPos[0], progress.current);
      positionsArray[i3 + 1] = THREE.MathUtils.lerp(p.chaosPos[1], p.targetPos[1], progress.current);
      positionsArray[i3 + 2] = THREE.MathUtils.lerp(p.chaosPos[2], p.targetPos[2], progress.current);
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={data.length}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={data.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={COLORS.emerald}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
