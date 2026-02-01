import { useMemo } from 'react';

import type { GalleryEntry } from '../../../types/gallery';

type Options = {
  objects: GalleryEntry[];
  hoveredId: string | null;
  selectedId: string | null;
  polyCounts: Record<string, number>;
};

export function useGalleryDerivedState({
  objects,
  hoveredId,
  selectedId,
  polyCounts,
}: Options) {
  const hoveredObject = useMemo(() => {
    if (!hoveredId) return null;
    return objects.find((obj) => obj.id === hoveredId) ?? null;
  }, [hoveredId, objects]);

  const selectedObject = useMemo(() => {
    if (!selectedId) return null;
    return objects.find((obj) => obj.id === selectedId) ?? null;
  }, [objects, selectedId]);

  const activePolyCount = useMemo(() => {
    if (selectedId && polyCounts[selectedId] != null) {
      return polyCounts[selectedId];
    }
    if (hoveredId && polyCounts[hoveredId] != null) {
      return polyCounts[hoveredId];
    }
    return null;
  }, [hoveredId, polyCounts, selectedId]);

  return {
    hoveredObject,
    selectedObject,
    activePolyCount,
  };
}
