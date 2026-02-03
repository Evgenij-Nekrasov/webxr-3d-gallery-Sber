import { useCallback, useRef } from 'react';
import type * as THREE from 'three';

export function useGalleryCamera() {
  const cameraRef = useRef<THREE.Camera | null>(null);

  const registerCamera = useCallback((camera: THREE.Camera) => {
    cameraRef.current = camera;
  }, []);

  return {
    cameraRef,
    registerCamera,
  };
}
