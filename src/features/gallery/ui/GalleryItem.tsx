import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo } from 'react';

import type { GalleryEntry } from '../../../types/gallery';
import type { GalleryPointerHandlers } from '../logic/types';
import { applyHighlight, prepareModelScene } from '../logic/modelUtils';

type Props = {
  data: GalleryEntry;
  highlighted: boolean;
  pedestalColor: string;
  interactive?: boolean;
  handlers?: GalleryPointerHandlers;
  onPolyCount: (id: string, count: number) => void;
};

const PEDESTAL_HEIGHT = 0.55;
const PEDESTAL_RADIUS = 0.7;
const TARGET_SIZE = 1.6;

export function GalleryItem({
  data,
  highlighted,
  pedestalColor,
  interactive = false,
  handlers,
  onPolyCount,
}: Props) {
  const gltf = useGLTF(data.url);

  const { scene, polyCount } = useMemo(() => {
    return prepareModelScene(gltf.scene, {
      targetSize: TARGET_SIZE,
      pedestalHeight: PEDESTAL_HEIGHT,
    });
  }, [gltf.scene]);

  useEffect(() => {
    onPolyCount(data.id, polyCount);
  }, [data.id, onPolyCount, polyCount]);

  useEffect(() => {
    applyHighlight(scene, highlighted);
  }, [highlighted, scene]);

  const onHover = interactive ? handlers?.onHover : undefined;
  const onBlur = interactive ? handlers?.onBlur : undefined;
  const onGrabStart = interactive ? handlers?.onGrabStart : undefined;
  const onGrabEnd = interactive ? handlers?.onGrabEnd : undefined;
  const onGrabMove = interactive ? handlers?.onGrabMove : undefined;

  return (
    <group
      position={data.position}
      rotation={data.rotation ?? [0, 0, 0]}
      onPointerOver={onHover ? (event) => onHover(data, event) : undefined}
      onPointerOut={onBlur ? (event) => onBlur(data, event) : undefined}
      onPointerDown={
        onGrabStart ? (event) => onGrabStart(data, event) : undefined
      }
      onPointerUp={onGrabEnd ? (event) => onGrabEnd(data, event) : undefined}
      onPointerMove={
        onGrabMove ? (event) => onGrabMove(data, event) : undefined
      }
    >
      <mesh position={[0, PEDESTAL_HEIGHT / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry
          args={[PEDESTAL_RADIUS, PEDESTAL_RADIUS, PEDESTAL_HEIGHT, 48]}
        />
        <meshStandardMaterial
          color={highlighted ? '#7dd3fc' : pedestalColor}
          metalness={0.25}
          roughness={0.6}
        />
      </mesh>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/bolshoi_theatre.glb');
useGLTF.preload('/french_cannon.glb');
useGLTF.preload('/lion.glb');
useGLTF.preload('/motherland_calls.glb');
useGLTF.preload('/saint_basils_cathedral.glb');
