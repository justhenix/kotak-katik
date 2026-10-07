import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Shape } from 'three';
import type { AvatarState } from '../../game/types';
import { orientationRotation, sceneConfig } from '../config';

const arrow = new Shape();
arrow.moveTo(0, 0.24); arrow.lineTo(-0.16, 0); arrow.lineTo(-0.06, 0);
arrow.lineTo(-0.06, -0.12); arrow.lineTo(0.06, -0.12); arrow.lineTo(0.06, 0);
arrow.lineTo(0.16, 0); arrow.closePath();

function Cuboid({ position, size, color }: {
  position: [number, number, number]; size: [number, number, number]; color: string;
}) {
  return <mesh position={position} castShadow><boxGeometry args={size} /><meshStandardMaterial color={color} roughness={0.85} /></mesh>;
}

export function Cat({ avatar, reduced }: { avatar: AvatarState; reduced: boolean }) {
  const group = useRef<Group>(null);
  const initialAvatar = useRef(avatar).current;
  const transition = useRef({ start: 0, x: avatar.position.x, z: avatar.position.z,
    yaw: orientationRotation[avatar.orientation], targetYaw: orientationRotation[avatar.orientation] });
  const invalidate = useThree((s) => s.invalidate);
  const colors = sceneConfig.colors;
  useEffect(() => {
    const mesh = group.current;
    if (!mesh) return;
    const yaw = mesh.rotation.y;
    const target = orientationRotation[avatar.orientation];
    const difference = Math.atan2(Math.sin(target - yaw), Math.cos(target - yaw));
    transition.current = { start: performance.now(), x: mesh.position.x, z: mesh.position.z, yaw, targetYaw: yaw + difference };
    invalidate();
  }, [avatar, reduced, invalidate]);
  useFrame(() => {
    if (!group.current) return;
    const t = reduced ? 1 : Math.min(1, (performance.now() - transition.current.start) / sceneConfig.transitionMs);
    const ease = 1 - (1 - t) ** 3;
    group.current.position.x = transition.current.x + (avatar.position.x - transition.current.x) * ease;
    group.current.position.z = transition.current.z + (avatar.position.z - transition.current.z) * ease;
    group.current.rotation.y = transition.current.yaw + (transition.current.targetYaw - transition.current.yaw) * ease;
    if (t < 1) invalidate();
  });
  return <group ref={group} position={[initialAvatar.position.x, 0, initialAvatar.position.z]} rotation={[0, orientationRotation[initialAvatar.orientation], 0]}>
    <Cuboid position={[0, 0.39, 0.08]} size={[0.42, 0.38, 0.5]} color={colors.cream} />
    <Cuboid position={[0, 0.71, -0.13]} size={[0.55, 0.4, 0.4]} color={colors.cream} />
    {([-1, 1] as const).map((side) => <group key={side}>
      <mesh position={[side * 0.19, 1.0, -0.1]} castShadow><coneGeometry args={[0.14, 0.25, 4]} /><meshStandardMaterial color={colors.cream} /></mesh>
      <Cuboid position={[side * 0.15, 0.73, -0.338]} size={[0.055, 0.075, 0.02]} color={colors.ink} />
      <Cuboid position={[side * 0.15, 0.17, -0.02]} size={[0.14, 0.13, 0.34]} color={colors.cream} />
    </group>)}
    <Cuboid position={[0, 0.62, -0.354]} size={[0.08, 0.055, 0.045]} color={colors.ink} />
    <group position={[0, 0.45, 0.4]} rotation={[-0.35, 0, 0]}>
      <Cuboid position={[0, 0.15, 0]} size={[0.1, 0.5, 0.1]} color={colors.cream} />
    </group>
    <mesh position={[0, 0.17, -0.57]} rotation={[-Math.PI / 2, 0, 0]}>
      <shapeGeometry args={[arrow]} /><meshBasicMaterial color={colors.ink} />
    </mesh>
  </group>;
}
