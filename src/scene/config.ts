import type { Orientation } from '../game/types';

export const sceneConfig = {
  tileSize: 1, tileWidth: 0.94, tileHeight: 0.3,
  transitionMs: 240, dpr: [1, 1.5] as [number, number],
  colors: {
    grass: '#A8D98F', grassEdge: '#69996B', cream: '#FFF3D6', ink: '#263D45',
    fish: '#F7D774', warning: '#A83B4D', collected: '#43704B',
  },
};
export const orientationRotation: Record<Orientation, number> = {
  north: 0, east: -Math.PI / 2, south: -Math.PI, west: Math.PI / 2,
};
