import { useCallback, useState } from 'react';

export function useGallerySelection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const clearSelection = useCallback((id: string) => {
    setHoveredId((current) => (current === id ? null : current));
    setSelectedId((current) => (current === id ? null : current));
  }, []);

  return {
    hoveredId,
    selectedId,
    setHoveredId,
    setSelectedId,
    clearSelection,
  };
}
