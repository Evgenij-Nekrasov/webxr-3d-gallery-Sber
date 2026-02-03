import { useCallback, useState } from 'react';
import type * as THREE from 'three';

import { INITIAL_POSITIONS, MODEL_LIBRARY } from '../../../constants';
import type { GalleryEntry, LibraryItem } from '../../../types';
import { computeSpawnPosition } from '../../../utils';

const buildInitialObjects = (
  models: LibraryItem[],
  positions: GalleryEntry['position'][],
): GalleryEntry[] =>
  models.map((model, index) => {
    const position = positions[index % positions.length];
    return {
      ...model,
      id: `${model.libraryKey}-${index}`,
      position,
      rotation: [0, (Math.PI / 7) * index, 0],
    };
  });

export function useGalleryObjects(
  cameraRef: React.RefObject<THREE.Camera | null>,
) {
  const [objects, setObjects] = useState<GalleryEntry[]>(() =>
    buildInitialObjects(MODEL_LIBRARY, INITIAL_POSITIONS),
  );

  const addRandomObject = useCallback(() => {
    if (!cameraRef.current) return;
    const choice =
      MODEL_LIBRARY[Math.floor(Math.random() * MODEL_LIBRARY.length)];
    const spawn = computeSpawnPosition(cameraRef.current);
    const id = `${choice.libraryKey}-${Date.now()}`;

    setObjects((prev) => [
      ...prev,
      {
        ...choice,
        id,
        position: [spawn.x, spawn.y, spawn.z],
        rotation: [0, Math.random() * Math.PI * 2, 0],
      },
    ]);
  }, [cameraRef]);

  const updateObjectPosition = useCallback(
    (id: string, position: THREE.Vector3) => {
      setObjects((prev) =>
        prev.map((obj) =>
          obj.id === id ?
            { ...obj, position: [position.x, position.y, position.z] }
          : obj,
        ),
      );
    },
    [],
  );

  const removeObject = useCallback((id: string) => {
    setObjects((prev) => prev.filter((obj) => obj.id !== id));
  }, []);

  return {
    objects,
    addRandomObject,
    updateObjectPosition,
    removeObject,
  };
}
