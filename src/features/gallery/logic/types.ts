import type { ThreeEvent } from '@react-three/fiber';

import type { GalleryEntry } from '../../../types/gallery';

export type GalleryPointerHandler = (
  item: GalleryEntry,
  event: ThreeEvent<PointerEvent>,
) => void;

export type GalleryPointerHandlers = {
  onHover?: GalleryPointerHandler;
  onBlur?: GalleryPointerHandler;
  onGrabStart?: GalleryPointerHandler;
  onGrabEnd?: GalleryPointerHandler;
  onGrabMove?: GalleryPointerHandler;
};
