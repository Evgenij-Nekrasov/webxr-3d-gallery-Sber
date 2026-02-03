export type LibraryItem = {
  name: string;
  url: string;
  libraryKey: string;
};

export type GalleryEntry = LibraryItem & {
  id: string;
  position: [number, number, number];
  rotation?: [number, number, number];
};
