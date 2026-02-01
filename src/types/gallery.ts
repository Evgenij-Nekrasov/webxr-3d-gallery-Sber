export type GalleryModel = {
  id: string;
  name: string;
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
};

export type LibraryItem = {
  name: string;
  url: string;
  libraryKey: string;
};

export type GalleryEntry = GalleryModel & {
  libraryKey: string;
};
