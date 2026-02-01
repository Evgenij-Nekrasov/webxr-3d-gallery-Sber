import * as THREE from 'three';

type ModelPrepOptions = {
  targetSize: number;
  pedestalHeight: number;
};

export function prepareModelScene(
  source: THREE.Object3D,
  { targetSize, pedestalHeight }: ModelPrepOptions,
) {
  const sceneClone = source.clone(true);
  const initialBox = new THREE.Box3().setFromObject(sceneClone);
  const size = initialBox.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = targetSize / maxDim;
  sceneClone.scale.setScalar(scale);

  const box = new THREE.Box3().makeEmpty();
  box.expandByObject(sceneClone);
  const center = box.getCenter(new THREE.Vector3());

  const offsetY = pedestalHeight - box.min.y;
  sceneClone.position.set(-center.x, offsetY, -center.z);

  sceneClone.traverse((child) => {
    if (!('isMesh' in child) || !(child as THREE.Mesh).isMesh) return;
    const mesh = child as THREE.Mesh;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });

  return {
    scene: sceneClone,
    polyCount: countPolygons(sceneClone),
  };
}

export function applyHighlight(root: THREE.Object3D, enabled: boolean) {
  const highlightEmissive = new THREE.Color(0.1, 0.35, 0.55);
  const neutralEmissive = new THREE.Color(0, 0, 0);
  const highlightColor = new THREE.Color('#7dd3fc');
  const neutralColor = new THREE.Color('#ffffff');
  root.traverse((child) => {
    if (!(child as THREE.Mesh).isMesh) return;
    const mesh = child as THREE.Mesh;
    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];
    materials.forEach((material) => {
      const mat = material as THREE.Material & {
        emissive?: THREE.Color;
        color?: THREE.Color;
      };
      if (mat.emissive) {
        mat.emissive.copy(enabled ? highlightEmissive : neutralEmissive);
      } else if (mat.color) {
        mat.color.copy(enabled ? highlightColor : neutralColor);
      }
    });
  });
}

function countPolygons(object: THREE.Object3D) {
  let total = 0;
  object.traverse((child) => {
    if (!('isMesh' in child) || !(child as THREE.Mesh).isMesh) return;
    const mesh = child as THREE.Mesh;
    const geometry = mesh.geometry;
    if (!geometry) return;
    if (geometry.index) {
      total += geometry.index.count / 3;
    } else if (geometry.attributes?.position) {
      total += geometry.attributes.position.count / 3;
    }
  });
  return Math.round(total);
}
