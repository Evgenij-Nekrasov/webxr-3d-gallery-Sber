import { useCallback, useMemo } from 'react';
import type { XRStore } from '@react-three/xr';

type Options = {
  store: XRStore;
  checkXRSupport?: () => boolean;
};

const defaultCheckXRSupport = () => Boolean(navigator.xr);

export function useToggleVR({
  store,
  checkXRSupport = defaultCheckXRSupport,
}: Options) {
  const xrSupported = useMemo(() => checkXRSupport(), []);

  const toggleVR = useCallback(async () => {
    const currentSession = store.getState().session;
    if (currentSession) {
      await currentSession.end();
      return;
    }

    const supported = await navigator.xr?.isSessionSupported?.('immersive-vr');
    if (!supported) return;

    try {
      await store.enterVR();
    } catch (error) {
      const active = store.getState().session;
      if (active) {
        await active.end().catch(() => undefined);
      }
      console.error('Не удалось запустить VR сессию', error);
    }
  }, [store]);

  return { toggleVR, xrSupported };
}
