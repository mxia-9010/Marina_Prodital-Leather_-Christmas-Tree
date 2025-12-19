
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '../constants';

interface Meteor {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
}

export const ShootingStars: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null!);
  const meteors = useRef<Meteor[]>([]);
  
  // Create a pool of meteor objects to avoid garbage collection
  useFrame((state, delta) => {
    // Occasional spawning
    if (Math.random() < 0.015 && meteors.current.length < 5) {
      const startX = (Math.random() - 0.5) * 60;
      const startY = 15 + Math.random() * 10;
      const startZ = -20 - Math.random() * 10;
      
      meteors.current.push({
        position: new THREE.Vector3(startX, startY, startZ),
        velocity: new THREE.Vector3(
          (Math.random() * 10 + 10) * (Math.random() > 0.5 ? 1 : -1), 
          -Math.random() * 10 - 10, 
          Math.random() * 5
        ),
        life: 0,
        maxLife: 1.5 + Math.random() * 1.5
      });
    }

    // Update meteors
    meteors.current = meteors.current.filter(m => {
      m.life += delta;
      m.position.add(m.velocity.clone().multiplyScalar(delta));
      return m.life < m.maxLife;
    });

    // We use a group of individual meshes for simple management of few meteors
    // Updating the group's children manually for performance
    if (meshRef.current) {
      // Clear previous children
      meshRef.current.clear();
      
      meteors.current.forEach((m) => {
        const progress = m.life / m.maxLife;
        const opacity = Math.sin(progress * Math.PI); // Fade in and out
        
        const trailGeometry = new THREE.CylinderGeometry(0.02, 0, 4, 8);
        const trailMaterial = new THREE.MeshBasicMaterial({
          color: COLORS.silverHighlight,
          transparent: true,
          opacity: opacity * 0.8,
          blending: THREE.AdditiveBlending
        });
        
        const trail = new THREE.Mesh(trailGeometry, trailMaterial);
        
        // Orient the trail to the velocity
        trail.position.copy(m.position);
        trail.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          m.velocity.clone().normalize()
        );
        
        meshRef.current.add(trail);
        
        // Add a bright head
        const headGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const headMaterial = new THREE.MeshStandardMaterial({
          emissive: COLORS.silverHighlight,
          emissiveIntensity: 10,
          color: COLORS.white
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.copy(m.position);
        meshRef.current.add(head);
      });
    }
  });

  return <group ref={meshRef} />;
};
