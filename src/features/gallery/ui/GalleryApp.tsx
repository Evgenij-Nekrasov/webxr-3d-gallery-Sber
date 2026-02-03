import { useLayoutEffect } from 'react';

import { useGallery } from '../context/GalleryContext';
import { useXRContext } from '../../xr/context/XRContext';
import { useDeleteTarget } from '../logic/useDeleteTarget';
import { usePreviewPointerInteractions } from '../logic/usePreviewPointerInteractions';
import { useVRPointerInteractions } from '../logic/useVRPointerInteractions';
import { GalleryScene } from './GalleryScene';
import { GalleryPanel } from './GalleryPanel';

export function GalleryApp() {
  const {
    objects,
    hoveredId,
    selectedId,
    setHoveredId,
    setSelectedId,
    setPolyCount,
    addRandomObject,
    updateObjectPosition,
    removeObject,
    registerCamera,
    hoveredObject,
    selectedObject,
    activePolyCount,
  } = useGallery();

  const {
    xrStore,
    xrSessionActive,
    vrEnabled,
    xrSupported,
    toggleVR,
    onSessionChange,
    resetInteractionsRef,
  } = useXRContext();

  const {
    grabbedId,
    handlers: vrHandlers,
    clearGrabbed,
    resetInteractions,
  } = useVRPointerInteractions({
    enabled: vrEnabled,
    onMoveObject: updateObjectPosition,
    setHoveredId,
    setSelectedId,
  });

  useLayoutEffect(() => {
    resetInteractionsRef.current = resetInteractions;
  }, [resetInteractions]);

  const { handlers: previewHandlers, onPointerMissed } =
    usePreviewPointerInteractions({
      enabled: !xrSessionActive,
      setHoveredId,
      setSelectedId,
    });

  const pointerHandlers = vrEnabled ? vrHandlers : previewHandlers;
  const pointerInteractive = vrEnabled || !xrSessionActive;

  const { deleteTarget } = useDeleteTarget({
    enabled: vrEnabled,
    selectedId,
    hoveredId,
    grabbedId,
    removeObject,
    clearGrabbed,
  });

  return (
    <div className="layout">
      <GalleryScene
        xrStore={xrStore}
        objects={objects}
        hoveredId={hoveredId}
        selectedId={selectedId}
        grabbedId={grabbedId}
        pointerInteractive={pointerInteractive}
        pointerHandlers={pointerHandlers}
        onPolyCount={setPolyCount}
        onPointerMissed={onPointerMissed}
        onCameraUpdate={registerCamera}
        onDelete={deleteTarget}
        onSessionChange={onSessionChange}
        previewEnabled={!xrSessionActive}
      />

      <GalleryPanel
        hoveredObject={hoveredObject}
        selectedObject={selectedObject}
        activePolyCount={activePolyCount}
        objectsCount={objects.length}
        xrSupported={xrSupported}
        onAddObject={addRandomObject}
        onToggleVR={toggleVR}
      />
    </div>
  );
}
