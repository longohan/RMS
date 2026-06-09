import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface SmartWallProps {
  position: [number, number, number];
  args: [number, number, number];
  color?: string;
  children?: React.ReactNode;
}

interface BedProps {
  position: [number, number, number];
}


const ROOM_CENTER = new THREE.Vector3(0, 3.5, 0);


function SmartWall({ position, args, color = "#f8fafc", children }: SmartWallProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ camera }) => {
    if (!groupRef.current) return;

    const distToWallSq = camera.position.distanceToSquared(groupRef.current.position);
    const distToCenterSq = camera.position.distanceToSquared(ROOM_CENTER);

    const isHiding = distToWallSq < distToCenterSq;
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const childMesh = child as THREE.Mesh;
        if (childMesh.material instanceof THREE.Material) {
          childMesh.material.transparent = true;
          childMesh.material.opacity = isHiding ? 0.15 : 1;
        }
      }
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Bản thân bức tường đặc */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={args} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {children}
    </group>
  );
}


function Bed({ position }: BedProps) {
  return (
    <group position={position}>
      {/* Khung giường (Màu gỗ sẫm) */}
      <mesh position={[0.9, 0.3, 2]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.7, 7]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.8} />
      </mesh>

      {/* Tấm nệm (Màu trắng sữa) */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.2, 2.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={1} />
      </mesh>

      {/* đầu giường */}
      <RoundedBox
        args={[4.4, 1.2, 0.2]} // Kích thước cũ
        radius={0.2}           // Độ bo tròn (càng lớn càng tròn)
        smoothness={4}         // Độ mịn của góc bo
        position={[0.9, 0.8, -1.4]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#5c3a21" roughness={0.8} />
      </RoundedBox>

      <group position={[4.7, 3, -1.06]}>
        {/* 1. Thân tủ chính (Màu gỗ sẫm) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3, 5.7, 1.6]} />
          <meshStandardMaterial color="#5c3a21" roughness={0.8} />
        </mesh>


        <mesh position={[0, 0, 0.81]}>
          <boxGeometry args={[0.02, 5.5, 0.02]} />
          <meshStandardMaterial color="#1e293b" roughness={1} />
        </mesh>

        {/* 3. Tay nắm cửa Trái (Màu vàng đồng hoặc bạc kim loại) */}
        <mesh position={[-0.1, 0, 0.83]}>
          <boxGeometry args={[0.04, 0.8, 0.04]} />
          <meshStandardMaterial color="yellow" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* 4. Tay nắm cửa Phải */}
        <mesh position={[0.1, 0, 0.83]}>
          <boxGeometry args={[0.04, 0.8, 0.04]} />
          <meshStandardMaterial color="yellow" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Gối phải */}
      <mesh position={[2, 0.85, -0.7]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.2, 0.8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
      </mesh>

      {/* Gối trái */}
      <mesh position={[0, 0.85, -0.7]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.2, 0.8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
      </mesh>

      {/* gường */}
      <mesh position={[0.9, 0.7, 2.1]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.15, 6.4]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Room() {
  return (
    <group>
      {/* Tường Trái */}
      <SmartWall position={[-4, 3.5, 0]} args={[0.2, 7, 8]} />
      {/* Tường Phải */}
      <SmartWall position={[4, 3.5, 0]} args={[0.2, 7, 8]} >
        <mesh position={[0, -1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, 4, 2]} />
          <meshStandardMaterial color="#8b5a2b" roughness={0.6} />
        </mesh>
      </SmartWall>
      {/* Tường Sau */}
      <SmartWall position={[0, 3.5, -4]} args={[8, 7, 0.2]} />
      {/* Tường Trước */}
      <SmartWall position={[0, 3.5, 4]} args={[8, 7, 0.2]} />

      {/* sàn nhà */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[8.2, 0.1, 8.2]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>

      <Bed position={[-2.5, 0, -2]} />

    </group>
  );
}

export default function InteractiveRoomApp() {
  return (
    <div className="w-full h-112.5 bg-slate-800 relative">
      <div className="w-full h-full">
        <Canvas shadows camera={{ position: [12, 14, 15], fov: 40 }}>

          <ambientLight intensity={0.5} />

          <directionalLight
            castShadow
            position={[10, 15, 5]}
            intensity={1.2}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-8}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-bottom={-8}
          />

          <group position={[0, -3, 0]}>
            <Room />
          </group>

          <ContactShadows position={[0, -3, 0]} opacity={0.5} scale={20} blur={2} />

          <OrbitControls makeDefault maxPolarAngle={Math.PI / 2 - 0.1} minDistance={5} maxDistance={30} />
        </Canvas>
      </div>

    </div>
  );
}