import type { GameState, LevelDefinition } from '../../game/types';
import { samePosition } from '../../game/engine/simulation';
import { sceneConfig } from '../config';

export function Board({ level, simulation }: { level: LevelDefinition; simulation: GameState }) {
  const { colors, tileWidth, tileHeight } = sceneConfig;
  return <group>
    {level.tiles.map(({ position }) => {
      const collision = simulation.collision && samePosition(position, simulation.collision.position);
      const current = samePosition(position, simulation.avatar.position);
      return <group key={`${position.x},${position.z}`} position={[position.x, 0, position.z]}>
        <mesh position={[0, -tileHeight / 2, 0]} receiveShadow castShadow>
          <boxGeometry args={[tileWidth, tileHeight, tileWidth]} />
          <meshStandardMaterial color={colors.grassEdge} roughness={1} />
        </mesh>
        <mesh position={[0, 0.014, 0]} receiveShadow>
          <boxGeometry args={[tileWidth, 0.045, tileWidth]} />
          <meshStandardMaterial color={collision ? colors.warning : colors.grass} roughness={1} />
        </mesh>
        {current && <mesh position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.36, 0.41, 32]} /><meshBasicMaterial color={simulation.completion ? colors.collected : colors.ink} />
        </mesh>}
      </group>;
    })}
    {simulation.collision && <group position={[simulation.collision.position.x, 0.03, simulation.collision.position.z]}>
      {[-1, 1].map((side) => <mesh key={side} rotation={[0, side * Math.PI / 4, 0]}>
        <boxGeometry args={[0.7, 0.035, 0.1]} /><meshBasicMaterial color={colors.warning} />
      </mesh>)}
    </group>}
  </group>;
}
