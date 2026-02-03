import { useCallback } from 'react';
import type { ThreeEvent } from '@react-three/fiber';

export function usePointerGuard(enabled: boolean) {
  return useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (!enabled) return false;
      event.stopPropagation();
      return true;
    },
    [enabled],
  );
}
