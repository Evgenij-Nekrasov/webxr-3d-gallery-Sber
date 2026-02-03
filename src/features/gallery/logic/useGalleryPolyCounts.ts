import { useCallback, useState } from 'react';

export function useGalleryPolyCounts() {
  const [polyCounts, setPolyCounts] = useState<Record<string, number>>({});

  const setPolyCount = useCallback((id: string, count: number) => {
    setPolyCounts((prev) =>
      prev[id] === count ? prev : { ...prev, [id]: count },
    );
  }, []);

  const removePolyCount = useCallback((id: string) => {
    setPolyCounts((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  return {
    polyCounts,
    setPolyCount,
    removePolyCount,
  };
}
