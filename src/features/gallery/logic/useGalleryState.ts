import { useCallback } from 'react';

import { useGalleryObjects } from './useGalleryObjects';
import { useGallerySelection } from './useGallerySelection';
import { useGalleryPolyCounts } from './useGalleryPolyCounts';
import { useGalleryCamera } from './useGalleryCamera';

export function useGalleryState() {
  const { cameraRef, registerCamera } = useGalleryCamera();
  const { objects, addRandomObject, updateObjectPosition, removeObject } =
    useGalleryObjects(cameraRef);
  const { hoveredId, selectedId, setHoveredId, setSelectedId, clearSelection } =
    useGallerySelection();
  const { polyCounts, setPolyCount, removePolyCount } = useGalleryPolyCounts();

  const handleRemoveObject = useCallback(
    (id: string) => {
      removeObject(id);
      clearSelection(id);
      removePolyCount(id);
    },
    [removeObject, clearSelection, removePolyCount],
  );

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
    removeObject: handleRemoveObject,
    registerCamera,
  };
}
