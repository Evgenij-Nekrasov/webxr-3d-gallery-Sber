import type { ThreeEvent } from '@react-three/fiber';

import type { GalleryEntry } from '../../../types/gallery';

export type GalleryPointerHandler = (
  item: GalleryEntry,
  event: ThreeEvent<PointerEvent>,
) => void;

export type BasePointerHandlers = {
  onHover?: GalleryPointerHandler;
  onBlur?: GalleryPointerHandler;
  onSelect?: GalleryPointerHandler;
};

export type GrabPointerHandlers = BasePointerHandlers & {
  onGrabStart?: GalleryPointerHandler;
  onGrabEnd?: GalleryPointerHandler;
  onGrabMove?: GalleryPointerHandler;
};

// Для обратной совместимости
export type GalleryPointerHandlers = GrabPointerHandlers;
