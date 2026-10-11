import { Component, Suspense, useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrthographicCamera, Vector3 } from 'three';
import { useGameStore } from '../stores/game-store';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Board } from './Board/Board';
import { Cat } from './Cat/Cat';
import { Fish } from './Collectibles/Fish';
import { sceneConfig } from './config';
import { ToyboxDressing } from './Environment/ToyboxDressing';
import type { LevelDefinition } from '../game/types';

function FitCamera({ level }: { level: LevelDefinition }) {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    if (!(camera instanceof OrthographicCamera)) return;
    const xs = level.tiles.map((tile) => tile.position.x);
    const zs = level.tiles.map((tile) => tile.position.z);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minZ = Math.min(...zs), maxZ = Math.max(...zs);
    const center = new Vector3((minX + maxX) / 2, 0.25, (minZ + maxZ) / 2);
    camera.position.copy(center).add(new Vector3(8, 8, 8));
    camera.lookAt(center);
    camera.updateMatrixWorld();
    // Fit occupied tiles, including the cat's full travel envelope, not the empty
    // corners of a rectangular level. Keep the same framing throughout execution.
    const projected = level.tiles.flatMap(({ position }) => [-0.56, 0.56].flatMap((dx) => [-0.56, 0.56].flatMap((dz) =>
      [-0.4, 1.2].map((y) => new Vector3(position.x + dx, y, position.z + dz).applyMatrix4(camera.matrixWorldInverse)))));
    const left = Math.min(...projected.map((v) => v.x)), right = Math.max(...projected.map((v) => v.x));
    const bottom = Math.min(...projected.map((v) => v.y)), top = Math.max(...projected.map((v) => v.y));
    const offset = new Vector3((left + right) / 2, (bottom + top) / 2, 0).applyQuaternion(camera.quaternion);
    camera.position.add(offset);
    camera.zoom = Math.min(size.width * 0.88 / (right - left), size.height * 0.94 / (top - bottom));
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, level, size.width, size.height, invalidate]);
  return null;
}

function World({ reduced, onReady }: { reduced: boolean; onReady: (ready: boolean) => void }) {
  const level = useGameStore((s) => s.level);
  const simulation = useGameStore((s) => s.simulation);
  useEffect(() => {
    onReady(true);
    return () => onReady(false);
  }, [onReady]);
  return <>
    <FitCamera level={level} />
    <ambientLight intensity={1.7} />
    <directionalLight position={[-3, 8, 5]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-0.0005} shadow-normalBias={0.02} shadow-radius={4} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} /><shadowMaterial transparent opacity={0.13} />
    </mesh>
    <Board level={level} simulation={simulation} />
    <ToyboxDressing />
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
          shadows="percentage" dpr={sceneConfig.dpr} frameloop="demand" fallback={<SceneFallback />}>
          <Suspense fallback={null}>
            <World reduced={reduced} onReady={ready} />
          </Suspense>
        </Canvas>
      </>
    </SceneBoundary>
  </div>;
}
