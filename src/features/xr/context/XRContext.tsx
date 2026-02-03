import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import type { XRStore } from '@react-three/xr';

import { createGalleryXRStore } from '../../../xr';
import { useXRSessionState } from '../logic/useXRSessionState';
import { useToggleVR } from '../logic/useToggleVR';

type XRContextValue = {
  xrStore: XRStore;
  xrSessionActive: boolean;
  xrMode: XRSessionMode | null;
  vrEnabled: boolean;
  xrSupported: boolean;
  toggleVR: () => Promise<void>;
  onSessionChange: (
    session: XRSession | undefined,
    mode: XRSessionMode | null,
  ) => void;
  resetInteractionsRef: React.RefObject<() => void>;
};

const XRContext = createContext<XRContextValue | null>(null);

type Props = {
  children: ReactNode;
  checkXRSupport?: () => boolean;
};

export function XRProvider({ children, checkXRSupport }: Props) {
  const xrStore = useMemo(() => createGalleryXRStore(), []);
  const resetInteractionsRef = useRef<() => void>(() => undefined);

  const { xrSessionActive, xrMode, onSessionChange } = useXRSessionState({
    resetInteractionsRef,
  });

  const { toggleVR, xrSupported } = useToggleVR({
    store: xrStore,
    checkXRSupport,
  });

  const vrEnabled = xrMode === 'immersive-vr';

  return (
    <XRContext.Provider
      value={{
        xrStore,
        xrSessionActive,
        xrMode,
        vrEnabled,
        xrSupported,
        toggleVR,
        onSessionChange,
        resetInteractionsRef,
      }}
    >
      {children}
    </XRContext.Provider>
  );
}

export function useXRContext() {
  const context = useContext(XRContext);
  if (!context) {
    throw new Error('useXRContext must be used within XRProvider');
  }
  return context;
}
