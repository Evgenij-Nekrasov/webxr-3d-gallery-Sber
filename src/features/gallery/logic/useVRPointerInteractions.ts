import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { Vector3 } from 'three';

import type { GalleryEntry } from '../../../types/gallery';
import type { GalleryPointerHandlers } from './types';
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

  const guardEvent = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (!enabled) return false;
      event.stopPropagation();
      return true;
    },
    [enabled],
  );

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
      setHoveredId(item.id);
      console.info('Тип объекта:', item.libraryKey);
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
        (
          current &&
          current.id === item.id &&
          current.pointerId === event.pointerId
        ) ?
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
        onMoveObject(item.id, target);
        return current;
      });
    },
    [guardEvent, onMoveObject],
  );

  const handlers: GalleryPointerHandlers = useMemo(
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
