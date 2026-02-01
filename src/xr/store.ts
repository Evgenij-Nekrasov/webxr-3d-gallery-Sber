import { createXRStore } from '@react-three/xr';

import { GalleryXRController } from './GalleryXRController';

export const createGalleryXRStore = () =>
  createXRStore({
    controller: GalleryXRController,
    layers: false,
  });
