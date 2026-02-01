import { Canvas } from '@react-three/fiber';
import { XR, type XRStore } from '@react-three/xr';
import { Suspense } from 'react';
import type * as THREE from 'three';

import { Floor, PreviewCameraControls } from '../../../components';
import { SceneEnvironment } from '../../../components/scene';
import { CameraTracker, XRBindings } from '../../../components/xr';
import { PEDESTAL_COLORS } from '../../../constants';
import type { GalleryEntry } from '../../../types/gallery';
import type { GalleryPointerHandlers } from '../logic/types';
import { GalleryItem } from './GalleryItem';

type Props = {
  xrStore: XRStore;
  objects: GalleryEntry[];
  hoveredId: string | null;
  selectedId: string | null;
  grabbedId: string | null;
  pointerInteractive: boolean;
  pointerHandlers?: GalleryPointerHandlers;
  onPolyCount: (id: string, count: number) => void;
  onPointerMissed: (event: MouseEvent) => void;
  onCameraUpdate: (camera: THREE.Camera) => void;
  onDelete: () => void;
  onSessionChange: (session: XRSession | undefined, mode: XRSessionMode | null) => void;
  previewEnabled: boolean;
};

export function GalleryScene({
  xrStore,
  objects,
  hoveredId,
  selectedId,
  grabbedId,
  pointerInteractive,
  pointerHandlers,
  onPolyCount,
  onPointerMissed,
  onCameraUpdate,
  onDelete,
  onSessionChange,
  previewEnabled,
}: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.25]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 1.7, 0], near: 0.1, far: 120, fov: 70 }}
      onPointerMissed={onPointerMissed}
    >
      <XR store={xrStore}>
        <SceneEnvironment />

        <Suspense fallback={null}>
          <Floor />
          {objects.map((item, index) => (
            <GalleryItem
              key={item.id}
              data={item}
              pedestalColor={PEDESTAL_COLORS[index % PEDESTAL_COLORS.length]}
              highlighted={
                hoveredId === item.id ||
                selectedId === item.id ||
                grabbedId === item.id
              }
              interactive={pointerInteractive}
              handlers={pointerHandlers}
              onPolyCount={onPolyCount}
            />
          ))}
        </Suspense>

        <PreviewCameraControls enabled={previewEnabled} />
        <CameraTracker onCameraUpdate={onCameraUpdate} />

        <XRBindings onDelete={onDelete} onSessionChange={onSessionChange} />
      </XR>
    </Canvas>
  );
}
