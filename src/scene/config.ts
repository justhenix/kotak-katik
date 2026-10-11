import type { Orientation } from '../game/types';

export const sceneConfig = {
  tileSize: 1, tileWidth: 0.98, tileHeight: 0.32,
  transitionMs: 240, dpr: [1, 1.5] as [number, number],
  animationFadeSeconds: 0.1, fishPickupMs: 240,
  fishScale: 1.5,
  colors: {
    grass: '#ACCD79', grassEdge: '#937454', cream: '#FFF3D6', ink: '#263D45',
    fish: '#F7D774', warning: '#A83B4D', collected: '#43704B',
    left: '#26BED0', right: '#F09943',
  },
};
export const orientationRotation: Record<Orientation, number> = {
  north: 0, east: -Math.PI / 2, south: -Math.PI, west: Math.PI / 2,
};
