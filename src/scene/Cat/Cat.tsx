import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Shape } from 'three';
import type { GameState } from '../../game/types';
import { sceneConfig } from '../config';
import { useModel } from '../models';
import { CatPlayback } from './playback';

const arrow = new Shape();
arrow.moveTo(0, 0.15); arrow.lineTo(-0.12, 0); arrow.lineTo(-0.045, 0);
arrow.lineTo(-0.045, -0.09); arrow.lineTo(0.045, -0.09); arrow.lineTo(0.045, 0);
arrow.lineTo(0.12, 0); arrow.closePath();

function DirectionCues() {
  const { colors } = sceneConfig;
  return <group>
    <mesh position={[0, 0.94, -0.36]} rotation={[-Math.PI / 2, 0, 0]}>
      <shapeGeometry args={[arrow]} /><meshBasicMaterial color={colors.ink} />
    </mesh>
    {([-1, 1] as const).map((side) => <group key={side} position={[side * 0.26, 0.94, -0.36]}>
      <mesh rotation={[-Math.PI / 2, 0, side * -Math.PI / 2]} scale={0.8}>
        <shapeGeometry args={[arrow]} /><meshBasicMaterial color={colors.ink} />
      </mesh>
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, side * -Math.PI / 2]} scale={0.62}>
        <shapeGeometry args={[arrow]} /><meshBasicMaterial color={side === -1 ? colors.left : colors.right} />
      </mesh>
    </group>)}
  </group>;
}

export function Cat({ simulation, reduced }: { simulation: GameState; reduced: boolean }) {
  const { scene, animations } = useModel('cat');
  const placement = useMemo(() => new Group(), []);
  const playback = useMemo(() => new CatPlayback(placement, scene, animations), [placement, scene, animations]);
  const firstFrame = useRef(true);
  const invalidate = useThree((state) => state.invalidate);
  const canvas = useThree((state) => state.gl.domElement);
  useEffect(() => {
    playback.sync(simulation, reduced);
    firstFrame.current = true;
    invalidate();
  }, [simulation, reduced, playback, invalidate]);
  useEffect(() => () => playback.dispose(), [playback]);
  useFrame((_, delta) => {
    const first = firstFrame.current;
    const active = playback.tick(first ? 0 : delta);
    firstFrame.current = false;
    if (first || canvas.dataset.catAnimation !== playback.phase || !active) {
      canvas.dataset.catAnimation = playback.phase;
      canvas.dataset.catX = String(placement.position.x);
      canvas.dataset.catZ = String(placement.position.z);
      canvas.dataset.catYaw = String(placement.rotation.y);
    }
    if (active) invalidate();
  });
  return <primitive object={placement} dispose={null}>
    <primitive object={scene} dispose={null} />
    <DirectionCues />
  </primitive>;
}
