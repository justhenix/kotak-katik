import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group } from 'three';
import type { Position } from '../../game/types';
import { sceneConfig } from '../config';
import { useModel } from '../models';

export function Fish({ position, collected, reduced }: { position: Position; collected: boolean; reduced: boolean }) {
  const { scene } = useModel('fish');
  const visual = useRef<Group>(null);
  const pickup = useRef({ elapsed: 0, active: false, firstFrame: true });
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    if (!visual.current) return;
    pickup.current = { elapsed: 0, active: collected && !reduced, firstFrame: true };
    visual.current.visible = !collected || !reduced;
    visual.current.scale.setScalar(1);
    visual.current.position.y = 0.2;
    invalidate();
  }, [collected, reduced, invalidate]);
  useFrame((_, delta) => {
    if (!visual.current || !pickup.current.active) return;
    const state = pickup.current;
    state.elapsed += state.firstFrame ? 0 : delta;
    state.firstFrame = false;
    const t = Math.min(1, state.elapsed / (sceneConfig.fishPickupMs / 1000));
    visual.current.position.y = 0.2 + 0.14 * (1 - (1 - t) ** 3);
    visual.current.scale.setScalar(1 - 0.1 * t);
    visual.current.visible = t < 1;
    state.active = t < 1;
    if (state.active) invalidate();
  });
  return <group position={[position.x, 0, position.z]}>
    <group ref={visual} position={[0, 0.2, 0]} rotation={[0, Math.PI / 4, 0]} visible={!collected}>
      <primitive object={scene} dispose={null} />
    </group>
    {collected && <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.15, 0.2, 24]} /><meshBasicMaterial color={sceneConfig.colors.collected} />
    </mesh>}
  </group>;
}
