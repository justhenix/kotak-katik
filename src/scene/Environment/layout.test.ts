import { describe, expect, it } from 'vitest';
import { OrthographicCamera, Vector3 } from 'three';
import { curriculumLevels } from '../../game/levels/curriculum';
import { planScenery, sceneryIsClear } from './layout';

describe('deterministic scenery outside authored boards', () => {
  for (const level of curriculumLevels) it(level.id, () => {
    const camera = new OrthographicCamera(-737, 737, 511.5, -511.5, 0.1, 100);
    const xs = level.tiles.map(tile => tile.position.x), zs = level.tiles.map(tile => tile.position.z);
    const center = new Vector3((Math.min(...xs) + Math.max(...xs)) / 2, 0, (Math.min(...zs) + Math.max(...zs)) / 2);
    camera.position.copy(center).add(new Vector3(10, 8.2, 10));
    camera.lookAt(center);
    camera.zoom = 150;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    const placements = planScenery(level, camera, 0.08, 0.67);
    expect(placements).toEqual(planScenery({ ...level, tiles: [...level.tiles].reverse() }, camera, 0.08, 0.67));
    expect(placements.length).toBeGreaterThan(0);
    for (const item of placements) expect(sceneryIsClear(level, item)).toBe(true);
    expect(new Set(placements.map(item => `${item.x},${item.z}`)).size).toBe(placements.length);
  });
});
