
export const SCENE_BACKGROUND = '#bcd6ff';

export const SCENE_FOG = {
  color: '#bcd6ff',
  near: 40,
  far: 95,
};

export const SKY_CONFIG = {
  distance: 450000,
  sunPosition: [0, 45, 90] as [number, number, number],
  inclination: 0.48,
  azimuth: 0.18,
  mieCoefficient: 0.005,
  mieDirectionalG: 0.9,
  turbidity: 8,
  rayleigh: 1.5,
};

export const HEMISPHERE_LIGHT_ARGS = ['#e0f2fe', '#0f172a', 0.6] as const;

export const DIRECTIONAL_LIGHT = {
  position: [6, 12, 8] as [number, number, number],
  intensity: 1.2,
  shadow: {
    mapSize: [1024, 1024] as [number, number],
    camera: {
      near: 1,
      far: 40,
      left: -18,
      right: 18,
      top: 18,
      bottom: -18,
    },
  },
};

export const SPOT_LIGHT = {
  position: [-10, 14, -5] as [number, number, number],
  angle: 0.4,
  intensity: 1.1,
  penumbra: 0.4,
};
