import { useMemo, useRef } from 'react';

import {
  GalleryPanel,
  GalleryScene,
  useDeleteTarget,
  useGalleryState,
  useGalleryDerivedState,
  usePreviewPointerInteractions,
  useVRPointerInteractions,
} from './features/gallery';
import { useToggleVR, useXRSessionState } from './features/xr';
import { createGalleryXRStore } from './xr';

import './App.css';

function App() {
  const xrStore = useMemo(() => createGalleryXRStore(), []);
  const resetInteractionsRef = useRef<() => void>(() => undefined);

  const {
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
  } = useGalleryState();

  const { xrSessionActive, xrMode, onSessionChange } = useXRSessionState({
    resetInteractionsRef,
  });
  const vrEnabled = xrMode === 'immersive-vr';

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
  resetInteractionsRef.current = resetInteractions;

  const { toggleVR, xrSupported } = useToggleVR({ store: xrStore });

  const { handlers: previewHandlers, onPointerMissed } =
    usePreviewPointerInteractions({
      enabled: !xrSessionActive,
      setHoveredId,
      setSelectedId,
    });

  const { hoveredObject, selectedObject, activePolyCount } =
    useGalleryDerivedState({
      objects,
      hoveredId,
      selectedId,
      polyCounts,
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

export default App;
