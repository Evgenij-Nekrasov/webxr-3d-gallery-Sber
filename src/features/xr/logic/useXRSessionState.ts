import type { RefObject } from 'react';
import { useCallback, useState } from 'react';

type Options = {
  resetInteractionsRef: RefObject<() => void>;
};

export function useXRSessionState({ resetInteractionsRef }: Options) {
  const [xrSessionActive, setXrSessionActive] = useState(false);
  const [xrMode, setXrMode] = useState<XRSessionMode | null>(null);

  const onSessionChange = useCallback(
    (session: XRSession | undefined, mode: XRSessionMode | null) => {
      setXrSessionActive(Boolean(session));
      setXrMode(mode);
      if (mode !== 'immersive-vr') {
        resetInteractionsRef.current();
      }
    },
    [resetInteractionsRef],
  );

  return { xrSessionActive, xrMode, onSessionChange };
}
