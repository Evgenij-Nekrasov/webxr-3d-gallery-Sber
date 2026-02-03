import { createContext, useContext, type ReactNode } from 'react';

import { useGalleryState } from '../logic/useGalleryState';
import { useGalleryDerivedState } from '../logic/useGalleryDerivedState';

type GalleryContextValue = ReturnType<typeof useGalleryState> &
  ReturnType<typeof useGalleryDerivedState>;

const GalleryContext = createContext<GalleryContextValue | null>(null);

export function GalleryProvider({ children }: { children: ReactNode }) {
  const state = useGalleryState();
  const derived = useGalleryDerivedState({
    objects: state.objects,
    hoveredId: state.hoveredId,
    selectedId: state.selectedId,
    polyCounts: state.polyCounts,
  });

  return (
    <GalleryContext.Provider value={{ ...state, ...derived }}>
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within GalleryProvider');
  }
  return context;
}
