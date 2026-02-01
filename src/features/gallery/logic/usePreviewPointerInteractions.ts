import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useMemo } from 'react';
import type { ThreeEvent } from '@react-three/fiber';

import type { GalleryEntry } from '../../../types/gallery';
import type { GalleryPointerHandlers } from './types';

type Options = {
  enabled: boolean;
  setHoveredId: Dispatch<SetStateAction<string | null>>;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
};

export function usePreviewPointerInteractions({
  enabled,
  setHoveredId,
  setSelectedId,
}: Options) {
  const guardEvent = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (!enabled) return false;
      event.stopPropagation();
      return true;
    },
    [enabled],
  );

  const handleHover = useCallback(
    (item: GalleryEntry, event: ThreeEvent<PointerEvent>) => {
      if (!guardEvent(event)) return;
      setHoveredId(item.id);
    },
    [guardEvent, setHoveredId],
  );

  const handleBlur = useCallback(
    (item: GalleryEntry, event: ThreeEvent<PointerEvent>) => {
      if (!guardEvent(event)) return;
      setHoveredId((current) => (current === item.id ? null : current));
    },
    [guardEvent, setHoveredId],
  );

  const handleSelect = useCallback(
    (item: GalleryEntry, event: ThreeEvent<PointerEvent>) => {
      if (!guardEvent(event)) return;
      setSelectedId(item.id);
    },
    [guardEvent, setSelectedId],
  );

  const handlers = useMemo<GalleryPointerHandlers>(
    () => ({
      onHover: handleHover,
      onBlur: handleBlur,
      onGrabStart: handleSelect,
    }),
    [handleBlur, handleHover, handleSelect],
  );

  const onPointerMissed = useCallback(
    (event: MouseEvent) => {
      if (!enabled) return;
      if (event.button !== 0) return;
      setSelectedId(null);
    },
    [enabled, setSelectedId],
  );

  return {
    handlers,
    onPointerMissed,
  };
}
