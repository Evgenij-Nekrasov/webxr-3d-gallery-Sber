import type { GalleryEntry, LibraryItem } from '../types';

export const MODEL_LIBRARY: LibraryItem[] = [
  { name: 'Большой театр', url: '/bolshoi_theatre.glb', libraryKey: 'bolshoi' },
  {
    name: 'Французская пушка',
    url: '/french_cannon.glb',
    libraryKey: 'cannon',
  },
  { name: 'Лев', url: '/lion.glb', libraryKey: 'lion' },
  {
    name: 'Родина-мать',
    url: '/motherland_calls.glb',
    libraryKey: 'motherland',
  },
  {
    name: 'Собор Василия Блаженного',
    url: '/saint_basils_cathedral.glb',
    libraryKey: 'basil',
  },
];

export const PEDESTAL_COLORS = [
  '#94a3b8',
  '#8092a8',
  '#a5b4fc',
  '#22d3ee',
  '#38bdf8',
];

export const FLOOR_SIZE = 80;

export const INITIAL_POSITIONS: GalleryEntry['position'][] = [
  [0, 0, -3],
  [3, 0, -1],
  [1.7, 0, 2.5],
  [-1.7, 0, 2.5],
  [-3, 0, -1],
];
