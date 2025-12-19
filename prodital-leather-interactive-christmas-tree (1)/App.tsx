
import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import Experience from './components/Experience';
import Overlay from './components/Overlay';
import { ShootingStars } from './components/ShootingStars';
import { TreeState } from './types';
import { COLORS } from './constants';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.FORMED);
  const [showGreeting, setShowGreeting] = useState(false);

  const toggleState = useCallback(() => {
    setTreeState(prev => (prev === TreeState.FORMED ? TreeState.CHAOS : TreeState.FORMED));
  }, []);

  return (
    <div className="w-full h-screen bg-black relative">
      <Canvas
        shadows
        gl={{ antialias: false, alpha: true }}
        onClick={toggleState}
        style={{ cursor: 'pointer' }}
      >
        <PerspectiveCamera makeDefault position={[0, 4, 20]} fov={45} />
        
        <color attach="background" args={[COLORS.black]} />
        
        {/* Environment Light */}
        <Environment preset="lobby" />
        <ambientLight intensity={0.15} /> {/* Slightly reduced from 0.2 for depth */}
        <pointLight position={[10, 10, 10]} intensity={1.5} color={COLORS.silver} />
        <spotLight 
          position={[-10, 20, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={2} 
          castShadow 
          color={COLORS.palePink} 
        />

        {/* Adjusted stars for a more spaced-out, deep celestial feel */}
        <Stars 
          radius={120} 
          depth={60} 
          count={4000} 
          factor={6} 
          saturation={0} 
          fade 
          speed={0.8} 
        />
        <ShootingStars />

        <Experience treeState={treeState} />

        <EffectComposer enableNormalPass={false}>
          <Bloom 
            mipmapBlur 
            intensity={1.2} 
            luminanceThreshold={0.8} 
            luminanceSmoothing={0.1} 
          />
          <Noise opacity={0.04} />
          {/* Increased darkness and offset for a deeper sense of focus and sky depth */}
          <Vignette eskil={false} offset={0.3} darkness={1.2} />
        </EffectComposer>

        <OrbitControls 
          enablePan={false} 
          minDistance={10} 
          maxDistance={40} 
          autoRotate={treeState === TreeState.FORMED}
          autoRotateSpeed={0.5}
          dampingFactor={0.05}
        />
      </Canvas>

      <Overlay 
        treeState={treeState} 
        onShowGreeting={() => setShowGreeting(true)} 
        showGreeting={showGreeting} 
        onCloseGreeting={() => setShowGreeting(false)} 
      />
    </div>
  );
};

export default App;
