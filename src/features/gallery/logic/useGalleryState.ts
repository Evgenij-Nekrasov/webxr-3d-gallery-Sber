import { useCallback, useRef, useState } from 'react';
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

export function useGalleryState() {
  const [objects, setObjects] = useState<GalleryEntry[]>(() =>
    buildInitialObjects(MODEL_LIBRARY, INITIAL_POSITIONS),
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [polyCounts, setPolyCounts] = useState<Record<string, number>>({});

  const cameraRef = useRef<THREE.Camera | null>(null);

  const registerCamera = useCallback((camera: THREE.Camera) => {
    cameraRef.current = camera;
  }, []);

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
  }, []);

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
    setHoveredId((current) => (current === id ? null : current));
    setSelectedId((current) => (current === id ? null : current));
    setPolyCounts((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const setPolyCount = useCallback((id: string, count: number) => {
    setPolyCounts((prev) =>
      prev[id] === count ? prev : { ...prev, [id]: count },
    );
  }, []);

  return {
    objects,
    hoveredId,
    selectedId,
    polyCounts,
    setHoveredId,
    setSelectedId,
    setPolyCount,
    addRandomObject,
    updateObjectPosition,
    removeObject,
    registerCamera,
  };
}
