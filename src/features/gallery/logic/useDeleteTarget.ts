import { useCallback } from 'react';

type Options = {
  enabled: boolean;
  selectedId: string | null;
  hoveredId: string | null;
  grabbedId: string | null;
  removeObject: (id: string) => void;
  clearGrabbed: (id?: string) => void;
};

export function useDeleteTarget({
  enabled,
  selectedId,
  hoveredId,
  grabbedId,
  removeObject,
  clearGrabbed,
}: Options) {
  const deleteTarget = useCallback(() => {
    if (!enabled) return;
    const targetId = selectedId ?? hoveredId ?? grabbedId;
    if (!targetId) return;
    removeObject(targetId);
    clearGrabbed(targetId);
  }, [clearGrabbed, enabled, grabbedId, hoveredId, removeObject, selectedId]);

  return { deleteTarget };
}
