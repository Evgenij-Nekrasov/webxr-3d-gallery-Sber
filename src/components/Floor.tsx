import { useGLTF } from '@react-three/drei';
import type { GLTF } from 'three-stdlib';
import * as THREE from 'three';

import { FLOOR_SIZE } from '../constants/gallery';

export function Floor() {
  const gltf = useGLTF('/floor.glb') as GLTF & {
    materials?: Record<string, THREE.Material>;
  };
  const parquet = Object.values(gltf.materials ?? {}).find(
    (mat): mat is THREE.MeshStandardMaterial =>
      mat instanceof THREE.MeshStandardMaterial,
  );
  if (parquet?.map) {
    parquet.map.wrapS = parquet.map.wrapT = THREE.RepeatWrapping;
    parquet.map.repeat.set(6, 6);
    parquet.map.anisotropy = 8;
  }

  return (
    <mesh
      receiveShadow
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
    >
      <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE]} />
      <meshStandardMaterial
        color={parquet?.color ?? new THREE.Color('#e5e7eb')}
        map={parquet?.map}
        normalMap={parquet?.normalMap}
        roughness={0.7}
        metalness={0.02}
      />
    </mesh>
  );
}

useGLTF.preload('/floor.glb');
