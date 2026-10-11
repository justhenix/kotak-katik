import type { GameState, LevelDefinition } from '../../game/types';
import { samePosition } from '../../game/engine/simulation';
import { sceneConfig } from '../config';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const soil = new RoundedBoxGeometry(sceneConfig.tileWidth, sceneConfig.tileHeight, sceneConfig.tileWidth, 2, 0.045);
const grass = new RoundedBoxGeometry(sceneConfig.tileWidth, 0.13, sceneConfig.tileWidth, 2, 0.045);

export function Board({ level, simulation }: { level: LevelDefinition; simulation: GameState }) {
  const { colors, tileHeight } = sceneConfig;
  return <group>
    {level.tiles.map(({ position }) => {
      const collision = simulation.collision && samePosition(position, simulation.collision.position);
      const current = samePosition(position, simulation.avatar.position);
      return <group key={`${position.x},${position.z}`} position={[position.x, 0, position.z]}>
        <mesh geometry={soil} position={[0, -tileHeight / 2 - 0.02, 0]} receiveShadow castShadow dispose={null}>
          <meshStandardMaterial color={colors.grassEdge} roughness={1} />
        </mesh>
        <mesh geometry={grass} position={[0, -0.035, 0]} receiveShadow castShadow dispose={null}>
          <meshStandardMaterial color={collision ? colors.warning : colors.grass} roughness={1} />
        </mesh>
        {current && <mesh position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.36, 0.39, 32]} /><meshBasicMaterial color={simulation.collision ? colors.warning : simulation.completion ? colors.collected : colors.ink} />
        </mesh>}
      </group>;
    })}
    {simulation.collision && <group position={[
      simulation.avatar.position.x + (simulation.collision.position.x - simulation.avatar.position.x) * 0.5,
      0.065,
      simulation.avatar.position.z + (simulation.collision.position.z - simulation.avatar.position.z) * 0.5,
    ]}>
      {[-1, 1].map((side) => <mesh key={side} rotation={[0, side * Math.PI / 4, 0]}>
        <boxGeometry args={[0.4, 0.035, 0.075]} /><meshBasicMaterial color={colors.warning} />
      </mesh>)}
    </group>}
  </group>;
}
