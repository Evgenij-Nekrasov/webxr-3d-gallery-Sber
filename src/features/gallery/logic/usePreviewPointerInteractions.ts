import {
  useCallback,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from 'react';

import type { GalleryPointerHandlers } from './types';
import { useBasePointerHandlers } from './useBasePointerHandlers';

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
  const { handlers: baseHandlers } = useBasePointerHandlers({
    enabled,
    setHoveredId,
    setSelectedId,
  });

  const handlers = useMemo<GalleryPointerHandlers>(
    () => ({
      onHover: baseHandlers.onHover,
      onBlur: baseHandlers.onBlur,
      onGrabStart: baseHandlers.onSelect,
    }),
    [baseHandlers],
  );

  const onPointerMissed = useCallback(
    (event: MouseEvent) => {
      if (!enabled) return;
      if (event.button !== 0) return;
      setSelectedId(null);
    },
    [enabled, setSelectedId],
  );

  return { handlers, onPointerMissed };
}
