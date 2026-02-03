import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { Vector3 } from 'three';

import type { GalleryEntry } from '../../../types/gallery';
import type { GrabPointerHandlers } from './types';
import { usePointerGuard } from './usePointerGuard';
import { MIN_RAY_Y } from './constants';

type GrabState = {
  id: string;
  pointerId: number;
  planeY: number;
  offset: Vector3;
};

type Options = {
  enabled: boolean;
  onMoveObject: (id: string, position: Vector3) => void;
  setHoveredId: Dispatch<SetStateAction<string | null>>;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
};

export function useVRPointerInteractions({
  enabled,
  onMoveObject,
  setHoveredId,
  setSelectedId,
}: Options) {
  const [grabState, setGrabState] = useState<GrabState | null>(null);
  const moveTargetRef = useRef<{ id: string; target: Vector3 } | null>(null);
  const guardEvent = usePointerGuard(enabled);

  const clearGrabbed = useCallback((id?: string) => {
    setGrabState((current) => {
      if (!current || !id || current.id === id) return null;
      return current;
    });
  }, []);

  const resetInteractions = useCallback(() => {
    clearGrabbed();
    setHoveredId(null);
    setSelectedId(null);
  }, [clearGrabbed, setHoveredId, setSelectedId]);

  const handleHover = useCallback(
    (item: GalleryEntry, event: ThreeEvent<PointerEvent>) => {
      if (!guardEvent(event)) return;
      console.info(item.libraryKey);
      setHoveredId(item.id);
    },
    [guardEvent, setHoveredId],
  );

  const handleBlur = useCallback(
    (item: GalleryEntry, event: ThreeEvent<PointerEvent>) => {
      if (!guardEvent(event)) return;
      if (grabState?.id === item.id) return;
      setHoveredId((current) => (current === item.id ? null : current));
    },
    [grabState?.id, guardEvent, setHoveredId],
  );

  const handleGrabStart = useCallback(
    (item: GalleryEntry, event: ThreeEvent<PointerEvent>) => {
      if (!guardEvent(event)) return;
      const objectPosition = new Vector3(...item.position);
      const hitPoint = event.point.clone();
      const offset = hitPoint.sub(objectPosition);
      offset.y = 0;
      event.eventObject?.setPointerCapture?.(event.pointerId);
      setGrabState({
        id: item.id,
        pointerId: event.pointerId,
        planeY: objectPosition.y,
        offset,
      });
      setSelectedId(item.id);
    },
    [guardEvent, setSelectedId],
  );

  const handleGrabEnd = useCallback(
    (item: GalleryEntry, event: ThreeEvent<PointerEvent>) => {
      if (!guardEvent(event)) return;
      setGrabState((current) =>
        current?.id === item.id && current?.pointerId === event.pointerId ?
          null
        : current,
      );
      event.eventObject?.releasePointerCapture?.(event.pointerId);
      setSelectedId((current) => (current === item.id ? null : current));
    },
    [guardEvent, setSelectedId],
  );

  const handleGrabMove = useCallback(
    (item: GalleryEntry, event: ThreeEvent<PointerEvent>) => {
      if (!guardEvent(event)) return;

      setGrabState((current) => {
        if (
          !current ||
          current.id !== item.id ||
          current.pointerId !== event.pointerId
        ) {
          return current;
        }

        const directionY = event.ray.direction.y;
        if (Math.abs(directionY) < MIN_RAY_Y) return current;
        const distance = (current.planeY - event.ray.origin.y) / directionY;
        if (distance < 0) return current;
        const target = event.ray.origin
          .clone()
          .add(event.ray.direction.clone().multiplyScalar(distance))
          .sub(current.offset);
        target.y = current.planeY;

        moveTargetRef.current = { id: item.id, target };

        return current;
      });

      const targetData = moveTargetRef.current;
      if (targetData) {
        onMoveObject(targetData.id, targetData.target);
        moveTargetRef.current = null;
      }
    },
    [guardEvent, onMoveObject],
  );

  const handlers: GrabPointerHandlers = useMemo(
    () => ({
      onHover: handleHover,
      onBlur: handleBlur,
      onGrabStart: handleGrabStart,
      onGrabEnd: handleGrabEnd,
      onGrabMove: handleGrabMove,
    }),
    [handleBlur, handleGrabEnd, handleGrabMove, handleGrabStart, handleHover],
  );

  return {
    grabbedId: grabState?.id ?? null,
    handlers,
    clearGrabbed,
    resetInteractions,
  };
}
