import { sceneConfig } from '../config';

function MiniIsland({ position, trees = false, rocks = false }: {
  position: [number, number, number];
  trees?: boolean;
  rocks?: boolean;
}) {
  const { colors } = sceneConfig;
  return (
    <group position={position}>
      {/* Soil base */}
      <mesh position={[0, -0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.7, 0.22, 0.7]} />
        <meshStandardMaterial color={colors.grassEdge} roughness={1} />
      </mesh>
      {/* Grass top */}
      <mesh position={[0, -0.01, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.7, 0.08, 0.7]} />
        <meshStandardMaterial color={colors.grass} roughness={1} />
      </mesh>
      {/* Trees */}
      {trees && (
        <group>
          {/* Tree 1 */}
          <mesh position={[-0.12, 0.12, -0.1]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 0.2, 8]} />
            <meshStandardMaterial color="#846545" roughness={1} />
          </mesh>
          <mesh position={[-0.12, 0.28, -0.1]} castShadow>
            <sphereGeometry args={[0.16, 8, 8]} />
            <meshStandardMaterial color="#88C768" roughness={1} />
          </mesh>
          {/* Tree 2 */}
          <mesh position={[0.14, 0.09, 0.12]} castShadow>
            <cylinderGeometry args={[0.035, 0.045, 0.16, 8]} />
            <meshStandardMaterial color="#846545" roughness={1} />
          </mesh>
          <mesh position={[0.14, 0.23, 0.12]} castShadow>
            <sphereGeometry args={[0.13, 8, 8]} />
            <meshStandardMaterial color="#72B852" roughness={1} />
          </mesh>
        </group>
      )}
      {/* Rocks */}
      {rocks && (
        <group>
          <mesh position={[-0.12, 0.08, -0.08]} rotation={[0.1, 0.4, 0]} castShadow>
            <boxGeometry args={[0.18, 0.14, 0.16]} />
            <meshStandardMaterial color="#A2B0B5" roughness={0.9} />
          </mesh>
          <mesh position={[0.1, 0.06, 0.1]} rotation={[0, 0.6, 0.1]} castShadow>
            <boxGeometry args={[0.14, 0.11, 0.13]} />
            <meshStandardMaterial color="#8E9FA5" roughness={0.9} />
          </mesh>
          <mesh position={[-0.04, 0.05, 0.15]} rotation={[0.2, -0.3, 0]} castShadow>
            <boxGeometry args={[0.12, 0.09, 0.11]} />
            <meshStandardMaterial color="#A8B7BC" roughness={0.9} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function PuffyCloud({ position, scale = 1 }: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.42, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.95} />
      </mesh>
      <mesh position={[-0.32, -0.05, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.95} />
      </mesh>
      <mesh position={[0.34, -0.06, 0]}>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.95} />
      </mesh>
      <mesh position={[0.08, 0.12, 0]}>
        <sphereGeometry args={[0.34, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.95} />
      </mesh>
    </group>
  );
}

export function ToyboxDressing() {
  return (
    <group>
      {/* Distant background floating mini islands */}
      <MiniIsland position={[2.6, -0.45, -1.8]} trees />
      <MiniIsland position={[-2.0, -0.55, 0.5]} rocks />

      {/* Distant soft background clouds */}
      <PuffyCloud position={[-3.2, 3.2, -4.2]} scale={1.05} />
      <PuffyCloud position={[3.2, 3.4, -4.5]} scale={1.15} />
      <PuffyCloud position={[-0.2, 3.8, -5.2]} scale={1.0} />
    </group>
  );
}
