import { useLayoutEffect, useRef } from 'react';
import { CylinderGeometry, Euler, IcosahedronGeometry, InstancedMesh, Matrix4, MeshStandardMaterial, Quaternion, SphereGeometry, Vector3 } from 'three';
import { Contact, Island, Rocks } from '../title/Dressing';
import type { SceneryPlacement } from './layout';

const canopy = new IcosahedronGeometry(1, 1);
const trunk = new CylinderGeometry(0.10, 0.14, 0.58, 7);
const leaves = new MeshStandardMaterial({ color: '#8dcb50', roughness: 1, flatShading: true });
const bark = new MeshStandardMaterial({ color: '#9c7145', roughness: 1 });
const round = new SphereGeometry(1, 10, 6);
const white = new MeshStandardMaterial({ color: '#fff9e9', roughness: 1 });
const yellow = new MeshStandardMaterial({ color: '#ffcf3e', roughness: 1 });
const green = new MeshStandardMaterial({ color: '#77b94c', roughness: 1 });
const stem = new CylinderGeometry(0.025, 0.035, 0.25, 6);
const petals = Array.from({ length: 5 }, (_, i) => {
  const angle = i * Math.PI * 2 / 5;
  return new Matrix4().compose(new Vector3(Math.sin(angle) * 0.115, 0, Math.cos(angle) * 0.115), new Quaternion(), new Vector3(0.095, 0.052, 0.095));
});
const blades = [-1, 0, 1].map(i => new Matrix4().compose(new Vector3(i * 0.095, 0.16, 0),
  new Quaternion().setFromEuler(new Euler(0.15, 0, -i * 0.38)), new Vector3(0.079, 0.21 + (i === 0 ? 0.035 : 0), 0.06)));

function Flower({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  const flowers = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    petals.forEach((matrix, i) => flowers.current?.setMatrixAt(i, matrix));
    if (flowers.current) flowers.current.instanceMatrix.needsUpdate = true;
  }, []);
  return <group position={position} scale={scale}>
    <Contact width={0.5} depth={0.4} />
    <mesh geometry={round} material={green} position={[0, 0.08, 0]} scale={[0.16, 0.08, 0.12]} dispose={null} />
    <mesh geometry={stem} material={green} position={[0, 0.125, 0]} dispose={null} />
    <group position={[0, 0.25, 0]} rotation={[0.65, 0, -0.55]}>
      <instancedMesh ref={flowers} args={[round, white, 5]} castShadow dispose={null} />
      <mesh geometry={round} material={yellow} position={[0, 0.035, 0]} scale={[0.085, 0.052, 0.085]} castShadow dispose={null} />
    </group>
  </group>;
}

function Grass({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  const leaves = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    blades.forEach((matrix, i) => leaves.current?.setMatrixAt(i, matrix));
    if (leaves.current) leaves.current.instanceMatrix.needsUpdate = true;
  }, []);
  return <group position={position} scale={scale}>
    <Contact width={0.46} depth={0.30} />
    <instancedMesh ref={leaves} args={[round, green, 3]} castShadow dispose={null} />
  </group>;
}

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return <group position={position} scale={scale}>
    <Contact width={1.1} depth={0.8} />
    <mesh geometry={trunk} material={bark} position={[0, 0.29, 0]} castShadow dispose={null} />
    <mesh geometry={canopy} material={leaves} position={[0, 0.84, 0]} scale={[0.50, 0.52, 0.49]} castShadow dispose={null} />
  </group>;
}

function Lily({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  return <mesh position={[x, -0.415, z]} rotation={[-Math.PI / 2, 0, 0.4]} scale={scale}>
    <circleGeometry args={[0.14, 12, 0.25, Math.PI * 1.8]} /><meshStandardMaterial color="#99ca57" roughness={1} />
  </mesh>;
}

export function ToyboxDressing({ placements }: { placements: readonly SceneryPlacement[] }) {
  return <group>
    {placements.map(({ kind, x, z, scale }) => kind === 'rock' ? <group key={kind + x}>
      <Rocks position={[x, -0.37, z]} scale={scale * 1.8} />
      <Lily x={x - 0.32} z={z + 0.13} /><Lily x={x - 0.13} z={z + 0.40} scale={0.70} />
    </group> : <Island key={kind + x} position={[x, 0.22, z]} scale={scale}>
      {kind === 'tree' && <>
        <Tree position={[-0.20, 0.07, -0.25]} scale={1.55} /><Rocks position={[-0.36, 0.07, 0.30]} scale={0.75} />
        <Grass position={[0.52, 0.07, -0.12]} scale={1.2} />
        <Flower position={[-0.50, 0.08, -0.03]} scale={1.1} /><Flower position={[0.20, 0.08, 0.47]} scale={0.75} />
      </>}
      {kind === 'garden' && <>
        <Tree position={[-0.35, 0.07, -0.30]} scale={1.25} /><Rocks position={[0.40, 0.07, -0.20]} scale={1.1} />
        <Grass position={[0.53, 0.07, -0.53]} scale={1.25} /><Grass position={[-0.45, 0.07, 0.22]} />
        <Flower position={[0.15, 0.08, 0.45]} scale={1.05} /><Flower position={[0.59, 0.08, 0.42]} scale={0.70} />
      </>}
      {kind === 'twins' && <>
        <Tree position={[-0.30, 0.07, -0.24]} scale={1.05} /><Tree position={[0.35, 0.07, 0.05]} scale={0.70} />
        <Flower position={[-0.45, 0.08, 0.40]} scale={1.0} /><Flower position={[0.60, 0.08, -0.38]} scale={0.80} /><Grass position={[0.20, 0.07, 0.50]} />
      </>}
      {kind === 'flowers' && <><Flower scale={1.6} position={[-0.24, 0.08, 0.15]} /><Grass position={[0.36, 0.07, -0.25]} scale={1.8} /></>}
    </Island>)}
  </group>;
}
