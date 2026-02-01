import { Sky } from '@react-three/drei';

import {
  DIRECTIONAL_LIGHT,
  HEMISPHERE_LIGHT_ARGS,
  SCENE_BACKGROUND,
  SCENE_FOG,
  SKY_CONFIG,
  SPOT_LIGHT,
} from '../../constants/scene';

export function SceneEnvironment() {
  return (
    <>
      <color attach="background" args={[SCENE_BACKGROUND]} />
      <fog attach="fog" args={[SCENE_FOG.color, SCENE_FOG.near, SCENE_FOG.far]} />

      <Sky
        distance={SKY_CONFIG.distance}
        sunPosition={SKY_CONFIG.sunPosition}
        inclination={SKY_CONFIG.inclination}
        azimuth={SKY_CONFIG.azimuth}
        mieCoefficient={SKY_CONFIG.mieCoefficient}
        mieDirectionalG={SKY_CONFIG.mieDirectionalG}
        turbidity={SKY_CONFIG.turbidity}
        rayleigh={SKY_CONFIG.rayleigh}
      />

      <hemisphereLight args={HEMISPHERE_LIGHT_ARGS} />
      <directionalLight
        position={DIRECTIONAL_LIGHT.position}
        intensity={DIRECTIONAL_LIGHT.intensity}
        castShadow
        shadow-mapSize-width={DIRECTIONAL_LIGHT.shadow.mapSize[0]}
        shadow-mapSize-height={DIRECTIONAL_LIGHT.shadow.mapSize[1]}
        shadow-camera-near={DIRECTIONAL_LIGHT.shadow.camera.near}
        shadow-camera-far={DIRECTIONAL_LIGHT.shadow.camera.far}
        shadow-camera-left={DIRECTIONAL_LIGHT.shadow.camera.left}
        shadow-camera-right={DIRECTIONAL_LIGHT.shadow.camera.right}
        shadow-camera-top={DIRECTIONAL_LIGHT.shadow.camera.top}
        shadow-camera-bottom={DIRECTIONAL_LIGHT.shadow.camera.bottom}
      />
      <spotLight
        position={SPOT_LIGHT.position}
        angle={SPOT_LIGHT.angle}
        intensity={SPOT_LIGHT.intensity}
        penumbra={SPOT_LIGHT.penumbra}
      />
    </>
  );
}
