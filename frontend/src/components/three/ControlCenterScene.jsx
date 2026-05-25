import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef, useEffect, useState } from 'react';

function VialCore() {
  const groupRef = useRef();
  const ringARef = useRef();
  const ringBRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.6;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.12;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.15;
    if (ringARef.current) {
      ringARef.current.rotation.z += delta * 0.5;
    }
    if (ringBRef.current) {
      ringBRef.current.rotation.z -= delta * 0.35;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <cylinderGeometry args={[0.55, 0.75, 2.3, 16]} />
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.28} metalness={0.45} roughness={0.08} emissive="#0f766e" emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.42, 0.55, 0.4, 12]} />
        <meshStandardMaterial color="#67e8f9" metalness={0.85} roughness={0.15} emissive="#14b8a6" emissiveIntensity={0.28} />
      </mesh>
      <mesh position={[0, -1.35, 0]}>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial color="#22d3ee" metalness={0.6} roughness={0.18} emissive="#38bdf8" emissiveIntensity={0.5} />
      </mesh>

      <mesh ref={ringARef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.25, 0.04, 8, 80]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.4} />
      </mesh>

      <mesh ref={ringBRef} rotation={[0, Math.PI / 4, Math.PI / 2]} position={[-1.6, 0.8, -0.2]}>
        <ringGeometry args={[0.35, 0.52, 12]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.35} />
      </mesh>

      <mesh rotation={[0, Math.PI / 3, Math.PI / 4]} position={[1.4, -0.7, 0.6]}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshBasicMaterial color="#e0f2fe" />
      </mesh>
    </group>
  );
}

export default function ControlCenterScene() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isSmall = width < 768;

  const isTiny = width < 420;

  return (
    <div className="relative h-[320px] overflow-hidden rounded-[2rem] border shadow-glow lg:h-[460px]" style={{ borderColor: 'rgba(0,109,103,0.15)', backgroundImage: 'radial-gradient(circle at top, rgba(0,109,103,0.2), transparent 35%), linear-gradient(180deg, rgba(2,6,23,0.96), rgba(8,15,35,0.92))' }}>
      {!isTiny ? (
        <Canvas camera={{ position: [0, 0, isSmall ? 9 : 7], fov: isSmall ? 50 : 45 }} dpr={[1, isSmall ? 1 : 1.5]}>
          <ambientLight intensity={isSmall ? 0.5 : 0.75} />
          <directionalLight position={[3, 4, 5]} intensity={isSmall ? 1.2 : 2.4} color="#8fe3d9" />
          <pointLight position={[-4, -3, 2]} intensity={isSmall ? 0.9 : 1.6} color="#33b3a8" />
          <Suspense fallback={null}>
            <VialCore />
          </Suspense>
        </Canvas>
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="text-center text-sm text-slate-300">3D preview disabled on small screens for performance</div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-6 top-6 flex items-center justify-between text-xs uppercase tracking-[0.35em]" style={{ color: 'rgba(0,109,103,0.7)' }}>
        <span>Health Command Core</span>
        <span>3D telemetry active</span>
      </div>
      <div className="pointer-events-none absolute bottom-5 left-6 right-6 grid gap-3 sm:grid-cols-3">
        {['Inventory flow', 'Appointments', 'Broadcast alerts'].map((label) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 backdrop-blur-md">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
