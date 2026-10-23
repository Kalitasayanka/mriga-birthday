import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { useApp } from '../context/useApp';

// Pre-seeded static star positions to prevent Math.random during render
const STAR_DATA = [
  [-2.2, 1.8, -1.5, 0.045],
  [2.1, 2.1, -2.0, 0.055],
  [-1.6, -1.2, -1.0, 0.038],
  [1.8, -0.9, -1.8, 0.042],
  [-1.2, 2.4, -2.2, 0.06],
  [1.3, 2.6, -1.6, 0.04],
  [-2.0, -0.4, -1.2, 0.05],
  [1.6, -1.8, -1.4, 0.048],
  [-0.6, 2.7, -2.5, 0.052],
  [0.8, -2.2, -1.9, 0.044],
  [-1.8, 0.9, -2.4, 0.05],
  [2.0, 1.1, -1.2, 0.042],
  [-1.4, -2.0, -1.7, 0.056],
  [1.0, 1.9, -2.1, 0.038],
  [-2.2, 2.2, -2.8, 0.062],
  [2.2, -1.5, -2.2, 0.05],
];

function Balloon({ position, color, speed = 1 }) {
  const meshRef = useRef();
  const initialY = position[1];

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    const px = state.pointer.x * 0.2;
    const py = state.pointer.y * 0.15;

    if (meshRef.current) {
      meshRef.current.position.y = initialY + Math.sin(t * 0.6) * 0.22 + py;
      meshRef.current.position.x = position[0] + Math.sin(t * 0.4) * 0.1 + px;
      meshRef.current.rotation.z = Math.sin(t * 0.3) * 0.07;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Balloon body */}
      <mesh>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.18}
          metalness={0.12}
          emissive={color}
          emissiveIntensity={0.06}
        />
      </mesh>
      {/* Balloon knot */}
      <mesh position={[0, -0.4, 0]}>
        <coneGeometry args={[0.055, 0.08, 8]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* String */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, -0.45, 0, 0, -1.35, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" opacity={0.2} transparent />
      </line>
    </group>
  );
}

function GiftBox({ position }) {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.18;
      meshRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.08;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Box */}
      <mesh>
        <boxGeometry args={[0.55, 0.55, 0.55]} />
        <meshStandardMaterial color="#e8a87c" roughness={0.3} metalness={0.08} />
      </mesh>
      {/* Ribbon horizontal */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.57, 0.08, 0.57]} />
        <meshStandardMaterial color="#d4a853" roughness={0.2} metalness={0.25} />
      </mesh>
      {/* Ribbon vertical */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.08, 0.57, 0.57]} />
        <meshStandardMaterial color="#d4a853" roughness={0.2} metalness={0.25} />
      </mesh>
      {/* Bow */}
      <mesh position={[0, 0.32, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#d4a853" roughness={0.2} metalness={0.35} />
      </mesh>
    </group>
  );
}

function CakeCandle({ position, lit }) {
  const flameRef = useRef();
  const lightRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (flameRef.current) {
      if (lit) {
        flameRef.current.scale.set(
          1 + Math.sin(t * 9) * 0.12,
          1 + Math.sin(t * 12) * 0.18,
          1 + Math.sin(t * 9) * 0.12
        );
      } else {
        flameRef.current.scale.lerp({ x: 0.001, y: 0.001, z: 0.001 }, 0.15);
      }
    }
    if (lightRef.current) {
      lightRef.current.intensity = lit ? 0.4 + Math.sin(t * 8) * 0.08 : 0;
    }
  });

  return (
    <group position={position}>
      {/* Candle stick */}
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, 0.22, 12]} />
        <meshStandardMaterial color="#fff6eb" roughness={0.3} />
      </mesh>
      {/* Flame */}
      <mesh ref={flameRef} position={[0, 0.16, 0]} visible={lit}>
        <sphereGeometry args={[0.042, 10, 10]} />
        <meshStandardMaterial
          color="#ffcc44"
          emissive="#ff8800"
          emissiveIntensity={lit ? 2.5 : 0}
          roughness={0.1}
        />
      </mesh>
      {/* Flame point light */}
      <pointLight
        ref={lightRef}
        position={[0, 0.2, 0]}
        color="#ffaa33"
        intensity={0.4}
        distance={1.6}
      />
    </group>
  );
}

function Cake({ position, candlesLit }) {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const px = state.pointer.x * 0.12;
    const py = state.pointer.y * 0.08;

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.12 + px;
      meshRef.current.rotation.x = 0.05 - py * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(t * 0.6) * 0.06;
    }
  });

  const frostingDrips = useMemo(() => {
    return [0, 1, 2, 3, 4, 5].map((i) => {
      const angle = (i / 6) * Math.PI * 2;
      return [Math.cos(angle) * 0.58, 0.06, Math.sin(angle) * 0.58];
    });
  }, []);

  return (
    <group ref={meshRef} position={position}>
      {/* Bottom tier */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.35, 36]} />
        <meshStandardMaterial color="#eed7c5" roughness={0.35} />
      </mesh>
      {/* Middle tier */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.28, 36]} />
        <meshStandardMaterial color="#f7cad0" roughness={0.35} />
      </mesh>
      {/* Top tier */}
      <mesh position={[0, 0.54, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.22, 36]} />
        <meshStandardMaterial color="#ffd6e0" roughness={0.3} />
      </mesh>
      {/* Frosting drips on bottom */}
      {frostingDrips.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.065, 10, 10]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} />
        </mesh>
      ))}
      {/* Candles */}
      <CakeCandle position={[0, 0.74, 0]} lit={candlesLit} />
      <CakeCandle position={[-0.12, 0.74, 0.1]} lit={candlesLit} />
      <CakeCandle position={[0.12, 0.74, -0.1]} lit={candlesLit} />
    </group>
  );
}

function Star({ position, size }) {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.z = t * 0.6;
      meshRef.current.rotation.y = t * 0.4;
      const pulse = 0.75 + Math.sin(t * 2.5 + position[0] * 8) * 0.25;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[size]} />
      <meshStandardMaterial
        color="#ffd166"
        emissive="#ffd166"
        emissiveIntensity={0.8}
        roughness={0.2}
        metalness={0.5}
      />
    </mesh>
  );
}

export default function BirthdayScene() {
  const { candlesLit } = useApp();
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="scene-container">
      <Canvas
        camera={{
          position: isMobile ? [0, 0.45, 6.2] : [0, 0.4, 4.8],
          fov: isMobile ? 48 : 45,
        }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 6, 4]} intensity={0.9} color="#fff6ee" />
        <directionalLight position={[-4, 3, -2]} intensity={0.35} color="#c9b1ff" />

        {/* 3D Birthday Cake */}
        <Cake position={[0, -0.65, 0]} candlesLit={candlesLit} />

        {/* Floating Gift Box - mobile friendly framing */}
        <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.35}>
          <GiftBox position={[1.35, -0.55, -0.3]} />
        </Float>

        {/* Floating Balloons - clustered for mobile framing */}
        <Balloon position={[-1.25, 1.05, -0.4]} color="#e07a8e" speed={0.8} />
        <Balloon position={[-0.85, 1.45, -0.8]} color="#7ec8e3" speed={1.1} />
        <Balloon position={[1.15, 1.25, -0.6]} color="#c9b1ff" speed={0.9} />
        <Balloon position={[1.45, 0.75, -0.2]} color="#e8a87c" speed={1.2} />
        <Balloon position={[-0.3, 1.6, -1.0]} color="#8fd9a8" speed={1.0} />
        <Balloon position={[0.45, 1.75, -1.2]} color="#f7c59f" speed={0.7} />

        {/* Twinkling stars */}
        {STAR_DATA.map((item, i) => (
          <Star key={i} position={[item[0], item[1], item[2]]} size={item[3]} />
        ))}

        {/* Sparkle particles */}
        <Sparkles
          count={55}
          scale={6.5}
          size={2.2}
          speed={0.35}
          opacity={0.55}
          color="#ffd166"
        />
      </Canvas>
    </div>
  );
}
