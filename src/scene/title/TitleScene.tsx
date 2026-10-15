import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AnimationMixer, Group, OrthographicCamera, Vector3 } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useModel } from '../models';
import { Bush, Cloud, Contact, Flower, Grass, Island, Rocks, TILE_SIZE, Tree } from './Dressing';
import { Water } from './Water';
import type { Footprint } from './Water';

type Point = [number, number, number];
// Every consecutive pair shares an edge at least one world unit wide.
// The stagger belongs only to this decorative vignette; gameplay uses its integer grid.
const desktopPath: Point[] = [[-1.8, 0, 3.6], [0, 0, 3.6], [0.8, 0, 1.8], [1.6, 0, 0], [2.4, 0, -1.8]];
const mobilePath: Point[] = [[-1.8, 0, 1.8], [-1.8, 0, 0], [0, 0, 0], [0, 0, -1.8], [1.8, 0, -1.8]];
// Screen-space art direction is converted to the same orthographic ground plane.
// These are fixed compositions, not random decoration or additional puzzle routes.
function atReference(x: number, y: number, height = 0): Point {
  const dx = (x - 865) / 110;
  const dy = (555 - y) / 110 - height * 0.865;
  return [0.707 * dx - 0.707 * dy / 0.502, height, -0.707 * dx - 0.707 * dy / 0.502];
}
function atIsland(x: number, y: number, scale: number): Point {
  const [px, , pz] = atReference(x, y, -0.615 * (1 - scale));
  return [px, 0, pz];
}
const decorations = [
  { position: atIsland(211, 353, 0.94), scale: 0.94, kind: 'tree' },
  { position: atIsland(1528, 461, 0.84), scale: 0.84, kind: 'double' },
  { position: atIsland(1471, 846, 1.22), scale: 1.22, kind: 'bush' },
  { position: atIsland(83, 823, 1.25), scale: 1.25, kind: 'rocks' },
] as const;
const blocks = [[87, 539, 0.27], [1380, 274, 0.28], [1615, 625, 0.24], [405, 863, 0.27]].map(([x, y, scale]) => ({ position: atIsland(x, y, scale), scale }));

function FitCamera({ mobile }: { mobile: boolean }) {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    if (!(camera instanceof OrthographicCamera)) return;
    camera.position.set(14, mobile ? 13 : 11.5, 14);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    const up = new Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    const scale = Math.min(size.width / 1672, size.height / 941);
    camera.zoom = mobile ? size.width * 0.91 / 7.64 : 110 * scale;
    camera.position.addScaledVector(right, mobile ? 0 : -29 / 110);
    camera.position.addScaledVector(up, mobile ? size.height * 0.16 / camera.zoom : 84.5 / 110);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    invalidate();
  }, [camera, size.width, size.height, mobile, invalidate]);
  return null;
}

function TitleModel({ name, position, scale, rotation, reduced }: {
  name: 'cat' | 'fish'; position: Point; scale: number; rotation: number; reduced: boolean;
}) {
  const { scene, animations } = useModel(name);
  const mixer = useMemo(() => new AnimationMixer(scene), [scene]);
  const gl = useThree(state => state.gl);
  useEffect(() => {
    const clip = animations.find(clip => clip.name === (name === 'cat' ? reduced ? 'static' : 'idle' : 'Armature|Swim'));
    if (clip) { mixer.clipAction(clip).play(); mixer.update(0); }
    gl.shadowMap.needsUpdate = true;
    gl.domElement.dataset[`${name}Loaded`] = 'true';
    return () => { mixer.stopAllAction(); mixer.uncacheRoot(scene); };
  }, [animations, mixer, name, reduced, scene, gl]);
  useFrame((_, delta) => { if (!reduced) mixer.update(Math.min(delta, 0.033)); });
  return <group position={position} scale={scale} rotation={[0, rotation, 0]}>
    <primitive object={scene} dispose={null} />
  </group>;
}

const accentGeometry = new RoundedBoxGeometry(0.10, 0.24, 0.075, 1, 0.02);
function Accents({ position }: { position: Point }) {
  const { camera, size } = useThree();
  const group = useRef<Group>(null);
  useEffect(() => { group.current?.quaternion.copy(camera.quaternion); }, [camera, size]);
  return <group ref={group} position={position}>
    {[[-0.08, 0.08, -0.32], [0.13, -0.09, -1.20]].map(([x, y, angle], i) =>
      <mesh key={i} geometry={accentGeometry} position={[x, y, 0]} rotation={[0, 0, angle]} dispose={null}>
        <meshStandardMaterial color="#ffcf30" roughness={1} />
      </mesh>)}
  </group>;
}

function World({ reduced, onReady }: { reduced: boolean; onReady: () => void }) {
  const mobile = useThree(state => state.size.width <= 600);
  const { gl } = useThree();
  const path = mobile ? mobilePath : desktopPath;
  const footprints = useMemo<Footprint[]>(() => [
    ...path.map(([x, , z]) => [x, z, TILE_SIZE / 2] as const),
    ...(mobile ? [] : [...decorations, ...blocks].map(({ position: [x, , z], scale }) => [x, z, TILE_SIZE * scale / 2] as const)),
  ], [path, mobile]);
  useEffect(() => {
    onReady();
    gl.shadowMap.autoUpdate = false;
    gl.shadowMap.needsUpdate = true;
  }, [gl, mobile, onReady]);
  const cat = path[0], fish = path[4];
  return <>
    <FitCamera mobile={mobile} />
    <fog attach="fog" args={['#99e5e8', 35, 90]} />
    <hemisphereLight args={['#f7fbff', '#aab3bd', 1.6]} />
    <ambientLight intensity={0.25} />
    <directionalLight position={[7, 5, 3]} color="#f4edff" intensity={0.9} />
    <directionalLight position={[-3, 9, -5]} color="#fff0cf" intensity={2.4} castShadow
      shadow-mapSize={[1024, 1024]} shadow-camera-left={-13} shadow-camera-right={13}
      shadow-camera-top={13} shadow-camera-bottom={-13} shadow-camera-far={35}
      shadow-bias={-0.0003} shadow-normalBias={0.03} shadow-radius={3} shadow-blurSamples={4} />
    <Water footprints={footprints} reduced={reduced} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.645, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} /><shadowMaterial transparent opacity={0.14} depthWrite={false} />
    </mesh>
    {path.map((position, i) => <Island key={i} position={position}>
      {i === 0 && <>
        <Contact width={1.5} depth={1.5} y={0.073} />
        <mesh position={[0, 0.072, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.76, 0.80, 64]} /><meshBasicMaterial color="#398d42" />
        </mesh>
      </>}
      {i === 2 && <><Grass position={[-0.51, 0.08, 0.21]} /><Flower position={[0.12, 0.08, 0.40]} scale={1.15} /><Grass position={[0.60, 0.08, -0.40]} /></>}
      {i === 3 && <><Rocks position={[0.10, 0.08, 0.05]} /><Grass position={[-0.45, 0.08, -0.40]} /></>}
      {i === 4 && <Grass position={[0.55, 0.08, -0.48]} />}
    </Island>)}
    <Suspense fallback={null}>
      <TitleModel name="cat" position={[cat[0] + 0.15, 0.08, cat[2] - 0.10]} scale={mobile ? 1.8 : 1.95} rotation={-Math.PI / 2 - 0.20} reduced={reduced} />
      <TitleModel name="fish" position={[fish[0] - 0.10, 0.12, fish[2] + 0.08]} scale={mobile ? 2.3 : 2.8} rotation={Math.PI / 4} reduced={reduced} />
    </Suspense>
    <Accents position={[cat[0] + 1.2, 1.50, cat[2] - 0.65]} />
    <Accents position={[fish[0] + 1.1, 0.93, fish[2] - 0.55]} />
    {!mobile && <>
      {decorations.map(({ position, scale, kind }) => <Island key={kind} position={position} scale={scale}>
        {kind === 'tree' && <><Tree position={[-0.60, 0.06, -0.40]} scale={1.12} /><Flower position={[0.25, 0.08, -0.05]} scale={1.25} /><Grass position={[0.50, 0.08, -0.45]} /></>}
        {kind === 'double' && <><Tree position={[-0.30, 0.06, -0.32]} scale={0.9} double /><Grass position={[0.40, 0.08, 0.35]} /></>}
        {kind === 'bush' && <><group position={[-0.40, 0.08, -0.15]} scale={1.25}><Bush /></group><Flower position={[0.50, 0.08, -0.05]} scale={1.20} height={0.45} /></>}
        {kind === 'rocks' && <><Rocks position={[-0.1, 0.08, -0.12]} scale={1.8} /><Grass position={[0.55, 0.08, 0.35]} /></>}
      </Island>)}
      {blocks.map(({ position, scale }, i) => <Island key={i} position={position} scale={scale} />)}
      <Island position={atIsland(56, 163, 0.22)} scale={0.22} distant />
      <Island position={atIsland(1138, 920, 0.45)} scale={0.45} distant />
      <Cloud position={atReference(315, 142, 1.5)} scale={1.15} />
      <Cloud position={atReference(1518, 194, 1.5)} scale={1.10} />
    </>}
  </>;
}

class TitleBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { console.error('Title scene failed to initialize', error); }
  render() { return this.state.failed ? <p className="title-scene-status">Dunia belum bisa dibuka. Kamu tetap bisa bermain.</p> : this.props.children; }
}

export function TitleScene() {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  return <div className="title-diorama" aria-hidden="true" data-ready={ready}>
    <TitleBoundary>
      <Canvas orthographic camera={{ position: [14, 11.5, 14], zoom: 110, near: 0.1, far: 150 }}
        shadows="variance" dpr={[1, 1.5]} frameloop={reduced ? 'demand' : 'always'}
        gl={{ alpha: false, antialias: true }} fallback={<p className="title-scene-status">Kotak-Katik</p>}>
        <World reduced={reduced} onReady={onReady} />
      </Canvas>
    </TitleBoundary>
  </div>;
}
