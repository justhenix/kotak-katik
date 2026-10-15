import { Component, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, Vector3 } from 'three';
import { gameStore, useGameStore } from '../stores/game-store';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Board } from './Board/Board';
import { Cat } from './Cat/Cat';
import { Fish } from './Collectibles/Fish';
import { sceneConfig } from './config';
import { ToyboxDressing } from './Environment/ToyboxDressing';
import { LearningCues } from './LearningCues';
import { useLessonStore, visibleHints } from '../stores/lesson-store';
import type { LevelDefinition } from '../game/types';
import { GameWater } from './Environment/GameWater';
import { planScenery } from './Environment/layout';
import type { SceneryPlacement } from './Environment/layout';
import type { WaterFootprint } from './Environment/GameWater';

function RenderBudget({ reduced, onConstrained }: { reduced: boolean; onConstrained: () => void }) {
  const slowFrames = useRef(0);
  useFrame(({ gl, setDpr }, delta) => {
    if (reduced) return;
    slowFrames.current = delta > 0.045 && delta < 0.25 ? slowFrames.current + 1 : 0;
    if (slowFrames.current >= 4 && gl.getPixelRatio() > 0.65) {
      // Lower only the 3D sampling cost on slower GPUs; DOM controls stay sharp.
      setDpr(Math.max(0.65, gl.getPixelRatio() * Math.sqrt(0.032 / delta)));
      onConstrained();
      slowFrames.current = 0;
    }
  });
  return null;
}

function FitCamera({ level, onLayout }: { level: LevelDefinition; onLayout: (items: SceneryPlacement[]) => void }) {
  const { camera, size, invalidate, gl } = useThree();
  const [textSize, setTextSize] = useState(() => getComputedStyle(document.documentElement).fontSize);
  const [guiLayout, setGuiLayout] = useState('');
  const fitted = useRef('');
  const scenery = useRef('');
  useLayoutEffect(() => {
    const nodes = [...document.querySelectorAll('.world-area, .game-header, .workbench, .feedback, .lesson-options-list')];
    const measure = () => {
      setTextSize(getComputedStyle(document.documentElement).fontSize);
      setGuiLayout(nodes.map(node => {
        const rect = node.getBoundingClientRect();
        return [rect.x, rect.y, rect.width, rect.height].map(Math.round).join(',');
      }).join('|') + `|${!!document.querySelector('.lesson-options[open]')}`);
    };
    const observer = new ResizeObserver(measure);
    nodes.forEach(node => observer.observe(node));
    const menu = document.querySelector('.lesson-options');
    const mutation = new MutationObserver(measure);
    if (menu) mutation.observe(menu, { attributes: true, attributeFilter: ['open'] });
    measure();
    return () => { observer.disconnect(); mutation.disconnect(); };
  }, []);
  useLayoutEffect(() => {
    if (!(camera instanceof OrthographicCamera)) return;
    const canvas = gl.domElement.getBoundingClientRect();
    const region = document.querySelector('.world-area')?.getBoundingClientRect() ?? canvas;
    const mobile = size.width <= 720;
    const menu = document.querySelector('.lesson-options[open] .lesson-options-list')?.getBoundingClientRect();
    const feedbackHeight = document.querySelector('.feedback')?.getBoundingClientRect().height ?? 52;
    const key = [level.id, size.width, size.height, textSize, !!menu, Math.round(region.top), Math.round(region.height)].join('|');
    if (fitted.current !== key || gameStore.getState().simulation.status === 'idle') {
      const xs = level.tiles.map((tile) => tile.position.x);
      const zs = level.tiles.map((tile) => tile.position.z);
      const minX = Math.min(...xs), maxX = Math.max(...xs);
      const minZ = Math.min(...zs), maxZ = Math.max(...zs);
      const center = new Vector3((minX + maxX) / 2, 0.25, (minZ + maxZ) / 2);
      camera.position.copy(center).add(new Vector3(10, 8.2, 10));
      camera.lookAt(center);
      camera.updateMatrixWorld();
      // Fit the complete tile/cat travel envelope, retaining the frame during execution.
      const projected = level.tiles.flatMap(({ position }) => [-0.56, 0.56].flatMap((dx) => [-0.56, 0.56].flatMap((dz) =>
        [-0.4, 1.2].map((y) => new Vector3(position.x + dx, y, position.z + dz).applyMatrix4(camera.matrixWorldInverse)))));
      const left = Math.min(...projected.map((v) => v.x)), right = Math.max(...projected.map((v) => v.x));
      const bottom = Math.min(...projected.map((v) => v.y)), top = Math.max(...projected.map((v) => v.y));
      const offset = new Vector3((left + right) / 2, (bottom + top) / 2, 0).applyQuaternion(camera.quaternion);
      camera.position.add(offset);
      const start = Math.max(region.top, mobile && menu ? menu.bottom + 10 : region.top);
      const areaHeight = Math.max(100, (region.bottom - start - feedbackHeight - 38) * 0.96);
      const verticalOffset = mobile ? 0 : Math.min(24, areaHeight * 0.04);
      camera.zoom = Math.min(size.width * (mobile ? 0.94 : 0.68) / (right - left), (areaHeight - verticalOffset * 2) * (mobile ? 0.94 : 0.99) / (top - bottom), mobile ? 160 : 240);
      const desiredY = start - canvas.top + areaHeight / 2 + verticalOffset;
      camera.position.addScaledVector(new Vector3(0, 1, 0).applyQuaternion(camera.quaternion), (desiredY - size.height / 2) / camera.zoom);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      const bannerCenter = region.bottom - canvas.top - feedbackHeight / 2 - 14;
      document.querySelector<HTMLElement>('.world-area')?.style.setProperty('--feedback-center', `${bannerCenter}px`);
      fitted.current = key;
      gl.domElement.dataset.cameraFrame = JSON.stringify({ position: camera.position.toArray(), rotation: camera.quaternion.toArray(), zoom: camera.zoom });
    }
    const ui = [...document.querySelectorAll('.puzzle-exit, .header-actions, .workbench, .feedback, .lesson-options[open] .lesson-options-list')].map(node => {
      const rect = node.getBoundingClientRect();
      return { left: (rect.left - canvas.left - 8) / size.width * 2 - 1, right: (rect.right - canvas.left + 8) / size.width * 2 - 1,
        top: 1 - (rect.top - canvas.top - 8) / size.height * 2, bottom: 1 - (rect.bottom - canvas.top + 10) / size.height * 2 };
    });
    const feedbackTop = document.querySelector('.feedback')?.getBoundingClientRect().top ?? region.bottom - feedbackHeight;
    const placements = planScenery(level, camera, (region.top - canvas.top) / size.height, (feedbackTop - canvas.top - 16) / size.height, ui, mobile);
    if (scenery.current !== JSON.stringify(placements)) { scenery.current = JSON.stringify(placements); onLayout(placements); }
    gl.shadowMap.needsUpdate = true;
    invalidate();
  }, [camera, level, size.width, size.height, invalidate, gl, onLayout, textSize, guiLayout]);
  return null;
}

function World({ reduced, onReady }: { reduced: boolean; onReady: (ready: boolean) => void }) {
  const level = useGameStore((s) => s.level);
  const simulation = useGameStore((s) => s.simulation);
  const program = useGameStore((s) => s.program);
  const revealed = useLessonStore((s) => s.revealed);
  const hintStrength = useLessonStore((s) => s.hintStrength);
  const hints = hintStrength >= 2 ? visibleHints(level, program, simulation, revealed) : [];
  const [placements, setPlacements] = useState<SceneryPlacement[]>([]);
  const [constrained, setConstrained] = useState(false);
  const constrain = useCallback(() => setConstrained(true), []);
  const visiblePlacements = useMemo(() => constrained ? placements.filter(item => item.kind === 'tree' || item.kind === 'twins') : placements, [placements, constrained]);
  const { gl } = useThree();
  const footprints = useMemo<WaterFootprint[]>(() => [
    ...level.tiles.map(({ position }) => [position.x, position.z, 0.49] as const),
    ...visiblePlacements.map(({ x, z, scale }) => [x, z, scale * 0.9] as const),
  ], [level, visiblePlacements]);
  useEffect(() => {
    onReady(true);
    gl.shadowMap.autoUpdate = false;
    gl.shadowMap.needsUpdate = true;
    gl.domElement.dataset.playableTiles = JSON.stringify(level.tiles.map(tile => tile.position));
    return () => onReady(false);
  }, [onReady, gl, level]);
  useEffect(() => {
    gl.shadowMap.needsUpdate = true;
    gl.domElement.dataset.scenery = JSON.stringify(visiblePlacements);
  }, [visiblePlacements, gl]);
  return <>
    <RenderBudget reduced={reduced} onConstrained={constrain} />
    <FitCamera level={level} onLayout={setPlacements} />
    <hemisphereLight args={['#f4ffff', '#a1b9b6', 1.6]} /><ambientLight intensity={0.30} />
    <directionalLight position={[6, 4, 2]} color="#f4edff" intensity={0.8} />
    <directionalLight position={[-3, 9, -5]} color="#fff0cf" intensity={2.5} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={14} shadow-camera-bottom={-14} shadow-camera-far={40} shadow-bias={-0.0003} shadow-normalBias={0.025} shadow-radius={3} shadow-blurSamples={4} />
    <GameWater footprints={footprints} reduced={reduced} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.425, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} /><shadowMaterial transparent opacity={0.14} depthWrite={false} />
    </mesh>
    <Board level={level} simulation={simulation} />
    <LearningCues hints={hints} />
    <ToyboxDressing placements={visiblePlacements} />
    {level.collectibles.map((fish) => <Fish key={fish.id} position={fish.position} collected={simulation.collectedIds.includes(fish.id)} reduced={reduced} />)}
    <Cat simulation={simulation} reduced={reduced} />
  </>;
}

function SceneFallback() {
  return <div className="scene-fallback" role="alert"><p>Papan belum bisa dibuka.</p><p>Coba muat ulang atau buka di peramban lain.</p><button onClick={() => window.location.reload()}>Muat ulang</button></div>;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { console.error('Game scene failed to initialize', error); }
  render() { return this.state.failed ? <SceneFallback /> : this.props.children; }
}

export function GameScene({ onReady }: { onReady: (ready: boolean) => void }) {
  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const ready = useCallback((value: boolean) => { setLoaded(value); onReady(value); }, [onReady]);
  return <div className="board-scene" aria-label="Papan permainan tiga dimensi" aria-busy={!loaded}>
    <SceneBoundary>
      <>
        {!loaded && <div className="scene-loading" role="status">Menyiapkan papan…</div>}
        <Canvas orthographic camera={{ position: [8, 8, 8], zoom: 60, near: 0.1, far: 100 }}
          shadows="variance" dpr={sceneConfig.dpr} frameloop="demand" fallback={loaded ? null : <SceneFallback />}>
          <Suspense fallback={null}>
            <World reduced={reduced} onReady={ready} />
          </Suspense>
        </Canvas>
      </>
    </SceneBoundary>
  </div>;
}
