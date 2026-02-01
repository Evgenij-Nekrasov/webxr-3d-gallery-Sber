import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';

type Props = {
  onCameraUpdate: (camera: THREE.Camera) => void;
};

export function CameraTracker({ onCameraUpdate }: Props) {
  useFrame((state) => onCameraUpdate(state.camera));
  return null;
}
