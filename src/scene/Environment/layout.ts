import { OrthographicCamera, Vector3 } from 'three';
import type { LevelDefinition } from '../../game/types';

export type SceneryKind = 'tree' | 'garden' | 'twins' | 'flowers' | 'rock';
export type SceneryPlacement = Readonly<{ kind: SceneryKind; x: number; z: number; scale: number }>;
export type ScreenRect = { left: number; right: number; top: number; bottom: number };

function projectBox(camera: OrthographicCamera, x: number, z: number, half: number, height: number, base = -0.45): ScreenRect {
  const points = [-half, half].flatMap(dx => [-half, half].flatMap(dz => [base, height].map(y =>
    new Vector3(x + dx, y, z + dz).project(camera))));
  return {
    left: Math.min(...points.map(p => p.x)), right: Math.max(...points.map(p => p.x)),
    top: Math.max(...points.map(p => p.y)), bottom: Math.min(...points.map(p => p.y)),
  };
}
const intersects = (a: ScreenRect, b: ScreenRect) => a.left < b.right + 0.015 && a.right > b.left - 0.015
  && a.bottom < b.top + 0.015 && a.top > b.bottom - 0.015;

export function sceneryIsClear(level: LevelDefinition, item: SceneryPlacement) {
  const clearance = item.scale * 0.9 + 1.05;
  return level.tiles.every(({ position }) => Math.abs(position.x - item.x) >= clearance || Math.abs(position.z - item.z) >= clearance);
}

// Check the full cat travel envelope, not only the starting pose. Scenery is
// independent of execution state and never reads a solution witness.
export function sceneryBounds(camera: OrthographicCamera, item: SceneryPlacement): ScreenRect {
  const height = item.kind === 'tree' ? item.scale * 2.82 - 0.395 : item.kind === 'garden' ? item.scale * 2.4 - 0.395
    : item.kind === 'twins' ? item.scale * 2.13 - 0.395 : item.kind === 'flowers' ? item.scale * 1.35 - 0.395 : 0.05;
  const half = item.kind === 'rock' ? 0.55 : item.scale * 1.06;
  return projectBox(camera, item.x, item.z, half, height, -0.48);
}

export function planScenery(level: LevelDefinition, camera: OrthographicCamera, top: number, bottom: number,
  ui: readonly ScreenRect[] = [], mobile = false): SceneryPlacement[] {
  const occupied = level.tiles.flatMap(({ position }) => [
    projectBox(camera, position.x, position.z, 0.52, 0.04),
    projectBox(camera, position.x, position.z, 0.38, 0.86),
    ...[0, 1, 2, 3].flatMap(turn => [-0.26, 0, 0.26].map(side => {
      const angle = turn * Math.PI / 2;
      const x = position.x + side * Math.cos(angle) - 0.36 * Math.sin(angle);
      const z = position.z - side * Math.sin(angle) - 0.36 * Math.cos(angle);
      return projectBox(camera, x, z, 0.13, 0.96, 0.93);
    })),
  ]);
  const direction = camera.getWorldDirection(new Vector3());
  const anchors: readonly [SceneryKind, number, number, number][] = mobile ? [
    ['flowers', 0.12, 0.18, 0.17], ['flowers', 0.88, 0.28, 0.16],
  ] : [
    ['tree', 0.155, 0.38, 0.60], ['garden', 0.705, 0.20, 0.50],
    ['twins', 0.875, 0.82, 0.52], ['flowers', 0.185, 0.86, 0.34],
    ['rock', 0.075, 0.56, 0.34], ['rock', 0.91, 0.36, 0.29],
  ];
  const result: SceneryPlacement[] = [];
  for (const [kind, u, v, scale] of anchors) {
    for (const [outward, down, factor] of [[0, 0, 1], [0, 0.10, 0.9], [0.025, 0.14, 0.82], [0.05, 0, 0.78], [0, -0.12, 0.75]]) {
      const screenX = u + (u < 0.5 ? -1 : 1) * outward;
      const screenY = top + (bottom - top) * (v + down);
      const origin = new Vector3(screenX * 2 - 1, 1 - screenY * 2, -1).unproject(camera);
      const point = origin.addScaledVector(direction, -origin.y / direction.y);
      const candidate = { kind, x: point.x, z: point.z, scale: scale * factor };
      const bounds = sceneryBounds(camera, candidate);
      if (sceneryIsClear(level, candidate) && bounds.left > -0.98 && bounds.right < 0.98 && bounds.top < 0.98 && bounds.bottom > -0.98
        && ![...occupied, ...ui, ...result.map(item => sceneryBounds(camera, item))].some(rect => intersects(rect, bounds))) {
        result.push(candidate);
        break;
      }
    }
  }
  return result;
}
