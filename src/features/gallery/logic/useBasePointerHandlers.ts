import {
  useCallback,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { ThreeEvent } from '@react-three/fiber';

import type { GalleryEntry } from '../../../types/gallery';
import type { BasePointerHandlers } from './types';
import { usePointerGuard } from './usePointerGuard';

type Options = {
  enabled: boolean;
  setHoveredId: Dispatch<SetStateAction<string | null>>;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  skipBlurForId?: string | null;
};

export function useBasePointerHandlers({
  enabled,
  setHoveredId,
  setSelectedId,
  skipBlurForId,
}: Options) {
  const guardEvent = usePointerGuard(enabled);

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
      if (skipBlurForId && skipBlurForId === item.id) return;
      setHoveredId((current) => (current === item.id ? null : current));
    },
    [guardEvent, setHoveredId, skipBlurForId],
  );

  const handleSelect = useCallback(
    (item: GalleryEntry, event: ThreeEvent<PointerEvent>) => {
      if (!guardEvent(event)) return;
      setSelectedId(item.id);
    },
    [guardEvent, setSelectedId],
  );

  const handlers = useMemo<BasePointerHandlers>(
    () => ({
      onHover: handleHover,
      onBlur: handleBlur,
      onSelect: handleSelect,
    }),
    [handleBlur, handleHover, handleSelect],
  );

  return { handlers, guardEvent };
}
