import * as THREE from 'three';
import React from 'react'; // Đã bỏ useState vì không cần thiết nữa
import { useGLTF, Html } from '@react-three/drei';
import type { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: { mesh_0: THREE.Mesh };
};

export default function RoomModelVR({ modelUrl, roomData, ...props }: { modelUrl: string; roomData: { roomNumber: number; price: number } } & React.ComponentProps<'group'>){
  const { nodes } = useGLTF(modelUrl) as unknown as GLTFResult;

  const labelPosition: [number, number, number] = [10, 2, 0];

  return (
    <group {...props} dispose={null}>
      <mesh 
        castShadow 
        receiveShadow 
        geometry={nodes.mesh_0.geometry} 
        material={nodes.mesh_0.material}
      >
        <Html 
          position={labelPosition} 
          pointer-events-none 
          distanceFactor={8}    
          
          occlude="blending"
          >
          
          <div className="w-max pointer-events-none transform -translate-y-full flex flex-col items-center animate-bounce">

            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border border-gray-200 relative z-10">
              <p className="text-sm font-bold text-gray-500 mb-1 text-center">Phòng {roomData.roomNumber}</p>
              <p className="text-xl font-black text-blue-600 text-center">{roomData.price.toLocaleString('vi-VN')} VNĐ</p>
            </div>

          </div>
        </Html>
      </mesh>
    </group>
  );
}
