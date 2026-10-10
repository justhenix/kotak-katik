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
import type { LevelDefinition } from '../game/types';

function FitCamera({ level }: { level: LevelDefinition }) {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    if (!(camera instanceof OrthographicCamera)) return;
    const xs = level.tiles.map((tile) => tile.position.x);
    const zs = level.tiles.map((tile) => tile.position.z);
    const minX = Math.min(...xs) - 0.7, maxX = Math.max(...xs) + 0.7;
    const minZ = Math.min(...zs) - 0.7, maxZ = Math.max(...zs) + 0.7;
    const center = new Vector3((minX + maxX) / 2, 0.25, (minZ + maxZ) / 2);
    camera.position.copy(center).add(new Vector3(8, 8, 8));
    camera.lookAt(center);
    camera.updateMatrixWorld();
    const projected = [minX, maxX].flatMap((x) => [minZ, maxZ].flatMap((z) =>
      [-0.4, 1.5].map((y) => new Vector3(x, y, z).applyMatrix4(camera.matrixWorldInverse))));
    const width = Math.max(...projected.map((v) => v.x)) - Math.min(...projected.map((v) => v.x));
    const height = Math.max(...projected.map((v) => v.y)) - Math.min(...projected.map((v) => v.y));
    camera.zoom = Math.min(size.width / (width + 0.3), size.height / (height + 0.3));
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
    <ambientLight intensity={1.5} />
    <directionalLight position={[2, 7, 4]} intensity={2.5} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.001} />
    <Board level={level} simulation={simulation} />
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
