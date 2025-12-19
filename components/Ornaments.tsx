
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrnamentData, TreeState } from '../types';
import { COLORS } from '../constants';

interface OrnamentsProps {
  data: OrnamentData[];
  treeState: TreeState;
}

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

export const Ornaments: React.FC<OrnamentsProps> = ({ data, treeState }) => {
  const gemMeshRef = useRef<THREE.InstancedMesh>(null!);
  const pearlMeshRef = useRef<THREE.InstancedMesh>(null!);
  const lightMeshRef = useRef<THREE.InstancedMesh>(null!);
  const progress = useRef(0);

  const gems = useMemo(() => data.filter(d => d.type === 'gem'), [data]);
  const pearls = useMemo(() => data.filter(d => d.type === 'pearl'), [data]);
  const lights = useMemo(() => data.filter(d => d.type === 'light'), [data]);

  const updateInstances = (
    mesh: THREE.InstancedMesh, 
    items: OrnamentData[], 
    p: number, 
    time: number
  ) => {
    items.forEach((item, i) => {
      // Dynamic interpolation with a slight individual stagger for natural flow
      const itemProgress = Math.max(0, Math.min(1, p + (Math.sin(time * 0.5 + i * 0.1) * 0.02)));
      
      const x = THREE.MathUtils.lerp(item.chaosPos[0], item.targetPos[0], itemProgress);
      const y = THREE.MathUtils.lerp(item.chaosPos[1], item.targetPos[1], itemProgress);
      const z = THREE.MathUtils.lerp(item.chaosPos[2], item.targetPos[2], itemProgress);
      
      tempObject.position.set(x, y, z);
      
      if (treeState === TreeState.FORMED) {
        // Subtle sway for the strings and gems
        tempObject.position.y += Math.sin(time * 1.2 + i * 0.2) * 0.015;
        tempObject.rotation.y = time * 0.1 + i * 0.1;
      } else {
        // Chaotic tumbling
        tempObject.rotation.x += 0.05;
        tempObject.rotation.z += 0.04;
      }

      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);
      
      if (item.type === 'gem') {
          mesh.setColorAt(i, tempColor.set(item.color));
      } else if (item.type === 'pearl') {
          mesh.setColorAt(i, tempColor.set(COLORS.pearlWhite));
      } else {
          mesh.setColorAt(i, tempColor.set(COLORS.palePink));
      }
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const targetProgress = treeState === TreeState.FORMED ? 1 : 0;
    progress.current = THREE.MathUtils.lerp(progress.current, targetProgress, 0.035);

    if (gemMeshRef.current) updateInstances(gemMeshRef.current, gems, progress.current, time);
    if (pearlMeshRef.current) updateInstances(pearlMeshRef.current, pearls, progress.current, time);
    if (lightMeshRef.current) updateInstances(lightMeshRef.current, lights, progress.current, time);
  });

  return (
    <>
      {/* Gems: Sharp-edged cut jewelry */}
      <instancedMesh ref={gemMeshRef} args={[undefined, undefined, gems.length]} castShadow>
        <dodecahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial 
          metalness={1} 
          roughness={0.01} 
          envMapIntensity={4.0} 
        />
      </instancedMesh>

      {/* Pearls: Smooth, round, white nacreous finish necklaces */}
      <instancedMesh ref={pearlMeshRef} args={[undefined, undefined, pearls.length]} castShadow>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial 
          metalness={0.5} 
          roughness={0.1} 
          color={COLORS.pearlWhite}
          emissive={COLORS.white}
          emissiveIntensity={0.1}
          envMapIntensity={1.8}
        />
      </instancedMesh>

      {/* Internal Glow Lights */}
      <instancedMesh ref={lightMeshRef} args={[undefined, undefined, lights.length]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial 
          emissive={COLORS.palePink} 
          emissiveIntensity={10} 
          color={COLORS.palePink} 
        />
      </instancedMesh>
    </>
  );
};
