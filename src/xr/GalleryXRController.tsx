import { Suspense, useCallback, useRef } from 'react';
import {
  CombinedPointer,
  PointerCursorModel,
  PointerRayModel,
  XRControllerModel,
  XRSpace,
  useXRControllerButtonEvent,
  useRayPointer,
  useXRInputSourceStateContext,
} from '@react-three/xr';
import type { NativeEvent } from '@pmndrs/pointer-events';
import type { Object3D } from 'three';

import { CURSOR_MODEL, RAY_MODEL } from './pointerModels';

function SqueezeRayPointer() {
  const state = useXRInputSourceStateContext('controller');
  const ref = useRef<Object3D | null>(null);
  const pointer = useRayPointer(ref, state, {
    makeDefault: true,
    minDistance: 0.2,
  });

  const pressedRef = useRef({ trigger: false, squeeze: false, isDown: false });
  const emitPointerDown = useCallback(() => {
    const nativeEvent: NativeEvent & { button: number } = {
      timeStamp: performance.now(),
      button: 0,
    };
    pointer.down(nativeEvent);
  }, [pointer]);
  const emitPointerUp = useCallback(() => {
    const nativeEvent: NativeEvent & { button: number } = {
      timeStamp: performance.now(),
      button: 0,
    };
    pointer.up(nativeEvent);
  }, [pointer]);
  const updatePointerDownState = useCallback(() => {
    const shouldBeDown =
      pressedRef.current.trigger || pressedRef.current.squeeze;
    if (shouldBeDown === pressedRef.current.isDown) return;
    pressedRef.current.isDown = shouldBeDown;
    if (shouldBeDown) {
      emitPointerDown();
    } else {
      emitPointerUp();
    }
  }, [emitPointerDown, emitPointerUp]);

  useXRControllerButtonEvent(state, 'xr-standard-trigger', (buttonState) => {
    pressedRef.current.trigger = buttonState === 'pressed';
    updatePointerDownState();
  });
  useXRControllerButtonEvent(
    state,
    'xr-standard-squeeze',
    (buttonState) => {
      pressedRef.current.squeeze = buttonState === 'pressed';
      updatePointerDownState();
    },
  );

  return (
    <XRSpace ref={ref} space="target-ray-space">
      <PointerRayModel pointer={pointer} {...RAY_MODEL} />
      <PointerCursorModel pointer={pointer} {...CURSOR_MODEL} />
    </XRSpace>
  );
}

export function GalleryXRController() {
  return (
    <>
      <Suspense fallback={null}>
        <XRControllerModel />
      </Suspense>
      <CombinedPointer>
        <SqueezeRayPointer />
      </CombinedPointer>
    </>
  );
}
