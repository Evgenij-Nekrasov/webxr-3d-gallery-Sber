import * as THREE from 'three';

export function computeSpawnPosition(camera: THREE.Camera) {
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  const right = new THREE.Vector3()
    .crossVectors(dir, new THREE.Vector3(0, 1, 0))
    .normalize();
  const forward = THREE.MathUtils.randFloat(1, 1.5);
  const sideways = THREE.MathUtils.randFloatSpread(1);
  const spawn = camera.position
    .clone()
    .add(dir.multiplyScalar(forward))
    .add(right.multiplyScalar(sideways));

  return new THREE.Vector3(spawn.x, 0, spawn.z);
}
