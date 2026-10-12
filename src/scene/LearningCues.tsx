import { Shape } from 'three';
import { orientationRotation, sceneConfig } from './config';
import type { VisualHint } from '../game/types';

function turnArrow(side: -1 | 1) {
  const arrow = new Shape();
  arrow.moveTo(0, 0.58);
  arrow.quadraticCurveTo(side * 0.48, 0.58, side * 0.48, 0.1);
  arrow.lineTo(side * 0.48, 0.16);
  arrow.lineTo(side * 0.72, 0);
  arrow.lineTo(side * 0.42, -0.16);
  arrow.lineTo(side * 0.42, -0.06);
  arrow.quadraticCurveTo(side * 0.4, 0.46, 0, 0.46);
  arrow.closePath();
  return arrow;
}
const leftArrow = turnArrow(-1), rightArrow = turnArrow(1);

// Static, character-relative cues remain legible with reduced motion.
export function LearningCues({ hints }: { hints: readonly VisualHint[] }) {
  return <group>
    {hints.map(({ id, cue }) => cue.type === 'board-region' ? <group key={id}>
      {cue.positions.map(({ x, z }) => <mesh key={`${x},${z}`} position={[x, 0.058, z]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
        <ringGeometry args={[0.53, 0.58, 4]} /><meshBasicMaterial color="#173f76" />
      </mesh>)}
    </group> : cue.type === 'relative-turn' ? <group key={id} position={[cue.position.x, 0.075, cue.position.z]} rotation={[0, orientationRotation[cue.orientation], 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={1.03}>
        <shapeGeometry args={[cue.direction === 'left' ? leftArrow : rightArrow]} /><meshBasicMaterial color={sceneConfig.colors.ink} />
      </mesh>
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <shapeGeometry args={[cue.direction === 'left' ? leftArrow : rightArrow]} /><meshBasicMaterial color={cue.direction === 'left' ? sceneConfig.colors.left : sceneConfig.colors.right} />
      </mesh>
    </group> : null)}
  </group>;
}
