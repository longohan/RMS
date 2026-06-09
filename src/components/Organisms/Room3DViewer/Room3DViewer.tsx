import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Html, useProgress } from '@react-three/drei';
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import RoomModelVR from './RoomModelVR';


function CustomLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 bg-card-bg backdrop-blur-xl px-8 py-5 rounded-3xl border border-card-border shadow-2xl">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="font-bold text-card-title text-sm whitespace-nowrap">
          Đang dựng không gian 3D {progress.toFixed(0)}%
        </span>
      </div>
    </Html>
  );
}

function GiaoDienLoi({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div>
      <p>Có lỗi xảy ra: {error instanceof Error ? error.message : String(error)}</p>
      <button onClick={resetErrorBoundary}>Thử lại</button>
    </div>
  );
}

export default function Room3DViewer({ modelUrl , roomData }: { modelUrl: string; roomData: { roomNumber: number; price: number } }) {
  return (
    <div className="w-full h-112.5 relative rounded-4xl overflow-hidden bg-black/5 dark:bg-black/20 border border-card-border">
      
      <ErrorBoundary key={modelUrl} FallbackComponent={GiaoDienLoi}>
        <Canvas shadows camera={{ position: [4, 2, 12], fov: 45 }}>
          
          <Suspense fallback={<CustomLoader />}>
            <Stage environment="city" intensity={0.7} adjustCamera={1.2}>
              <RoomModelVR  modelUrl={modelUrl} rotation={[ 1.9, 6.2, 8 ]} roomData={roomData} />
            </Stage>
          </Suspense> 

          <OrbitControls makeDefault enableZoom={true} maxPolarAngle={Math.PI / 2} />
        </Canvas>
      </ErrorBoundary>

    </div>
  );
}