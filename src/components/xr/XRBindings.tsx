import { useEffect, useCallback } from 'react';
import {
  useXR,
  useXRControllerButtonEvent,
  useXRInputSourceState,
} from '@react-three/xr';

type Props = {
  onDelete: () => void;
  onSessionChange: (session: XRSession | undefined, mode: XRSessionMode | null) => void;
};

export function XRBindings({ onDelete, onSessionChange }: Props) {
  const session = useXR((state) => state.session);
  const mode = useXR((state) => state.mode);

  const leftController = useXRInputSourceState('controller', 'left');

  const handleDelete = useCallback(
    (state: string) => {
      if (state === 'pressed') onDelete();
    },
    [onDelete],
  );

  useXRControllerButtonEvent(leftController, 'x-button', handleDelete);

  useEffect(() => {
    onSessionChange(session, mode);
  }, [mode, onSessionChange, session]);

  return null;
}
