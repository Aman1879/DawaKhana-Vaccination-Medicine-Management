import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function MedicalCore() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.6;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <torusKnotGeometry args={[0.9, 0.28, 180, 24]} />
        <meshStandardMaterial color="#006D67" emissive="#064f4c" emissiveIntensity={0.45} metalness={0.72} roughness={0.18} />
      </mesh>
      <mesh position={[1.5, 0.2, -0.7]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color="#33b3a8" emissive="#0f6b62" emissiveIntensity={0.8} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.03, 16, 120]} />
        <meshBasicMaterial color="#2aa695" transparent opacity={0.35} />
      </mesh>
      <mesh>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="h-[360px] overflow-hidden rounded-[2rem] border shadow-glow lg:h-[520px]" style={{ borderColor: 'rgba(0,109,103,0.10)', backgroundImage: 'radial-gradient(circle at top, rgba(0,109,103,0.16), transparent 32%), linear-gradient(180deg, rgba(2,6,23,0.95), rgba(15,23,42,0.9))' }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} color="#8fe3d9" />
        <pointLight position={[-4, -3, 2]} intensity={1.3} color="#33b3a8" />
        <Suspense fallback={null}>
          <MedicalCore />
        </Suspense>
      </Canvas>
    </div>
  );
}
