import { useEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import type { ReactNode } from 'react';
import { Color, Group, IcosahedronGeometry, MeshStandardMaterial, ShaderMaterial, SphereGeometry } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const TILE_SIZE = 1.8;
const soil = new RoundedBoxGeometry(TILE_SIZE, 0.56, TILE_SIZE, 2, 0.085);
const grass = new RoundedBoxGeometry(TILE_SIZE, 0.14, TILE_SIZE, 2, 0.045);
const sphere = new SphereGeometry(1, 12, 8);
const foliage = new IcosahedronGeometry(1, 1);
const earthMaterial = new MeshStandardMaterial({ color: '#bd8969', roughness: 1 });
const grassMaterial = new MeshStandardMaterial({ color: '#c3dc70', roughness: 1 });
const distantEarth = new MeshStandardMaterial({ color: '#89c5be', roughness: 1, transparent: true, opacity: 0.40, depthWrite: false });
const distantGrass = new MeshStandardMaterial({ color: '#b8dfac', roughness: 1, transparent: true, opacity: 0.50, depthWrite: false });
const leafMaterial = new MeshStandardMaterial({ color: '#62b341', roughness: 1, flatShading: true });
const paleLeafMaterial = new MeshStandardMaterial({ color: '#86c748', roughness: 1, flatShading: true });
const barkMaterial = new MeshStandardMaterial({ color: '#926342', roughness: 1 });
const petalMaterial = new MeshStandardMaterial({ color: '#fff8ed', roughness: 1 });
const pollenMaterial = new MeshStandardMaterial({ color: '#ffcf3e', roughness: 1 });

const contactMaterial = new ShaderMaterial({
  transparent: true, depthWrite: false, toneMapped: false,
  uniforms: { ink: { value: new Color('#367e78') } },
  vertexShader: 'varying vec2 v; void main() { v = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: /* glsl */ `
    uniform vec3 ink;
    varying vec2 v;
    void main() {
      float d = length((v - 0.5) * 2.0);
      gl_FragColor = vec4(ink, (1.0 - smoothstep(0.1, 1.0, d)) * 0.22);
      #include <colorspace_fragment>
    }
  `,
});

export function Contact({ width = 0.9, depth = 0.7, y = 0.014 }: { width?: number; depth?: number; y?: number }) {
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} material={contactMaterial} dispose={null}>
    <planeGeometry args={[width, depth]} />
  </mesh>;
}

export function Island({ children, position, scale = 1, distant = false }: { children?: ReactNode; position: [number, number, number]; scale?: number; distant?: boolean }) {
  return <group position={[position[0], position[1] - 0.615 * (1 - scale), position[2]]} scale={scale}>
    <mesh geometry={soil} material={distant ? distantEarth : earthMaterial} position={[0, -0.335, 0]} castShadow={!distant} receiveShadow={!distant} dispose={null} />
    <mesh geometry={grass} material={distant ? distantGrass : grassMaterial} position={[0, -0.005, 0]} castShadow={!distant} receiveShadow={!distant} dispose={null} />
    {children}
  </group>;
}

export function Grass({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  return <group position={position} scale={scale}>
    <Contact width={0.46} depth={0.30} />
    {[-1, 0, 1].map((i) => <mesh key={i} geometry={sphere} material={i === 1 ? paleLeafMaterial : leafMaterial}
      position={[i * 0.095, 0.16, 0]} scale={[0.079, 0.21 + (i === 0 ? 0.035 : 0), 0.060]} rotation={[0.15, 0, -i * 0.38]} castShadow dispose={null} />)}
  </group>;
}

export function Flower({ position = [0, 0, 0], scale = 1, height = 0.25 }: { position?: [number, number, number]; scale?: number; height?: number }) {
  return <group position={position} scale={scale}>
    <Contact width={0.5} depth={0.4} />
    <mesh geometry={sphere} material={leafMaterial} position={[0, 0.08, 0]} scale={[0.16, 0.08, 0.12]} dispose={null} />
    <mesh position={[0, height / 2, 0]} material={leafMaterial}>
      <cylinderGeometry args={[0.025, 0.035, height, 6]} />
    </mesh>
    <group position={[0, height, 0]} rotation={[0.65, 0, -0.55]}>
      {Array.from({ length: 5 }, (_, i) => {
        const a = i * Math.PI * 2 / 5;
        return <mesh key={i} geometry={sphere} material={petalMaterial} position={[Math.sin(a) * 0.115, 0, Math.cos(a) * 0.115]} scale={[0.095, 0.052, 0.095]} castShadow dispose={null} />;
      })}
      <mesh geometry={sphere} material={pollenMaterial} position={[0, 0.035, 0]} scale={[0.085, 0.052, 0.085]} castShadow dispose={null} />
    </group>
  </group>;
}

export function Tree({ position = [0, 0, 0], scale = 1, double = false }: { position?: [number, number, number]; scale?: number; double?: boolean }) {
  return <group position={position} scale={scale}>
    <Contact width={1.2} depth={0.85} />
    <mesh material={barkMaterial} position={[0, 0.28, 0]} castShadow>
      <cylinderGeometry args={[0.105, 0.13, 0.55, 9]} />
    </mesh>
    <mesh geometry={foliage} material={leafMaterial} position={[0, 0.85, 0]} scale={[0.46, 0.48, 0.43]} castShadow dispose={null} />
    {double && <mesh geometry={foliage} material={paleLeafMaterial} position={[0, 1.25, 0]} scale={[0.30, 0.31, 0.29]} castShadow dispose={null} />}
  </group>;
}

export function Bush() {
  return <group>
    <Contact width={1.1} depth={0.85} />
    <mesh geometry={foliage} material={leafMaterial} position={[0, 0.34, 0]} scale={[0.52, 0.34, 0.40]} castShadow dispose={null} />
  </group>;
}

export function Rocks({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  const geometry = useMemo(() => new RoundedBoxGeometry(0.38, 0.40, 0.38, 1, 0.085), []);
  return <group position={position} scale={scale}>
    <Contact width={0.9} depth={0.7} />
    {[[0, 0.25, 0, 1], [0.20, 0.10, 0.22, 0.60], [-0.27, 0.09, 0.06, 0.48]].map(([x, y, z, s], i) =>
      <mesh key={i} geometry={geometry} position={[x, y, z]} scale={s} rotation={[0, i * 0.3, 0.05]} castShadow receiveShadow>
        <meshStandardMaterial color={i === 1 ? '#a5a7b2' : '#9398ac'} roughness={1} flatShading />
      </mesh>)}
  </group>;
}

export function Cloud({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const group = useRef<Group>(null);
  const { camera, size } = useThree();
  useEffect(() => { group.current?.quaternion.copy(camera.quaternion); }, [camera, size]);
  return <group ref={group} position={position} scale={scale}>
    {[[-0.44, -0.02, 0, 0.33], [0, 0.20, 0.06, 0.44], [0.42, -0.08, 0.01, 0.35]].map(([x, y, z, s], i) =>
      <mesh key={i} position={[x, y, z]} scale={s}>
        <sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#fff8ef" emissive="#e6f0f3" emissiveIntensity={0.8} roughness={1} />
      </mesh>)}
  </group>;
}
