import type { Position } from '../../game/types';
import { sceneConfig } from '../config';

export function Fish({ position, collected }: { position: Position; collected: boolean }) {
  const { colors } = sceneConfig;
  if (collected) return <mesh position={[position.x, 0.045, position.z]} rotation={[-Math.PI / 2, 0, 0]}>
    <ringGeometry args={[0.15, 0.2, 24]} /><meshBasicMaterial color={colors.collected} />
  </mesh>;
  return <group position={[position.x, 0.3, position.z]} rotation={[0, -Math.PI / 4, 0]}>
    <mesh scale={[0.26, 0.13, 0.11]} castShadow>
      <sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={colors.fish} roughness={0.85} />
    </mesh>
    <mesh position={[-0.27, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
      <coneGeometry args={[0.16, 0.2, 3]} /><meshStandardMaterial color={colors.fish} />
    </mesh>
    <mesh position={[0.15, 0.04, 0.09]}><sphereGeometry args={[0.03, 8, 8]} /><meshBasicMaterial color={colors.ink} /></mesh>
  </group>;
}
