'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Preload } from '@react-three/drei';
import * as THREE from 'three';

function FloatingOrb({ position, color, scale = 1 }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.5;
    meshRef.current.rotation.x = t * 0.2;
    meshRef.current.rotation.y = t * 0.3;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function FloatingTorus({ position, color }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.3;
    meshRef.current.rotation.z = t * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[0.8, 0.2, 16, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function BackgroundParticles() {
  const count = 200;
  const meshRef = useRef();
  
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    
    const color = new THREE.Color();
    color.setHSL(Math.random() * 0.2 + 0.5, 0.7, 0.5);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#06b6d4" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
      
      <FloatingOrb position={[8, 2, -5]} color="#06b6d4" scale={1.5} />
      <FloatingOrb position={[-7, -3, -8]} color="#3b82f6" scale={1.2} />
      <FloatingOrb position={[5, -2, -3]} color="#8b5cf6" scale={0.8} />
      
      <FloatingTorus position={[-5, 4, -6]} color="#06b6d4" />
      <FloatingTorus position={[6, -4, -4]} color="#3b82f6" />
      
      <BackgroundParticles />
      
      <Preload all />
    </>
  );
}

export function Scene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Scene;