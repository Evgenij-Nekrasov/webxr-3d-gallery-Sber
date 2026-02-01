import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { MathUtils } from 'three';

type Props = {
  enabled: boolean;
  rotateSpeed?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
};

type ControlState = {
  dragging: boolean;
  lastX: number;
  lastY: number;
  yaw: number;
  pitch: number;
};

const DEFAULT_MIN_POLAR = -Math.PI / 2 + 0.08;
const DEFAULT_MAX_POLAR = Math.PI / 2 - 0.08;

export function PreviewCameraControls({
  enabled,
  rotateSpeed = 0.003,
  minPolarAngle = DEFAULT_MIN_POLAR,
  maxPolarAngle = DEFAULT_MAX_POLAR,
}: Props) {
  const { camera, gl } = useThree();
  const state = useRef<ControlState>({
    dragging: false,
    lastX: 0,
    lastY: 0,
    yaw: 0,
    pitch: 0,
  });

  useEffect(() => {
    if (!enabled) return;

    const domElement = gl.domElement;
    const controlState = state.current;

    camera.rotation.order = 'YXZ';
    controlState.yaw = camera.rotation.y;
    controlState.pitch = camera.rotation.x;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      controlState.dragging = true;
      controlState.lastX = event.clientX;
      controlState.lastY = event.clientY;
      domElement.setPointerCapture?.(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!controlState.dragging) return;
      const deltaX = event.clientX - controlState.lastX;
      const deltaY = event.clientY - controlState.lastY;
      controlState.lastX = event.clientX;
      controlState.lastY = event.clientY;

      controlState.yaw -= deltaX * rotateSpeed;
      controlState.pitch -= deltaY * rotateSpeed;
      controlState.pitch = MathUtils.clamp(
        controlState.pitch,
        minPolarAngle,
        maxPolarAngle,
      );

      camera.rotation.set(controlState.pitch, controlState.yaw, 0);
    };

    const onPointerEnd = (event: PointerEvent) => {
      if (!controlState.dragging) return;
      controlState.dragging = false;
      domElement.releasePointerCapture?.(event.pointerId);
    };

    const previousTouchAction = domElement.style.touchAction;
    domElement.style.touchAction = 'none';

    domElement.addEventListener('pointerdown', onPointerDown);
    domElement.addEventListener('pointermove', onPointerMove);
    domElement.addEventListener('pointerup', onPointerEnd);
    domElement.addEventListener('pointerleave', onPointerEnd);

    return () => {
      domElement.removeEventListener('pointerdown', onPointerDown);
      domElement.removeEventListener('pointermove', onPointerMove);
      domElement.removeEventListener('pointerup', onPointerEnd);
      domElement.removeEventListener('pointerleave', onPointerEnd);
      domElement.style.touchAction = previousTouchAction;
      controlState.dragging = false;
    };
  }, [camera, enabled, gl, maxPolarAngle, minPolarAngle, rotateSpeed]);

  return null;
}
