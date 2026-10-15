import { DataTexture, LinearFilter, RGBAFormat, Vector2 } from 'three';

export type WaterFootprint = readonly [number, number, number];

// A level's coastline is static. Bake distances, sparse accents, and the soft
// ambient reflection once, leaving one texture lookup per water fragment.
export function createShoreField(footprints: readonly WaterFootprint[]) {
  const padding = 0.65;
  const left = Math.min(...footprints.map(([x, , half]) => x - half)) - padding;
  const bottom = Math.min(...footprints.map(([, z, half]) => z - half)) - padding;
  const right = Math.max(...footprints.map(([x, , half]) => x + half)) + padding;
  const top = Math.max(...footprints.map(([, z, half]) => z + half)) + padding;
  const size = 256;
  const width = right - left, height = top - bottom;
  const data = new Uint8Array(size * size * 4);
  for (let row = 0; row < size; row++) {
    const z = bottom + (row + 0.5) / size * height;
    for (let column = 0; column < size; column++) {
      const x = left + (column + 0.5) / size * width;
      let distance = 0.75;
      for (const [cx, cz, half] of footprints) {
        const qx = Math.abs(x - cx) - Math.max(0.01, half - 0.07);
        const qz = Math.abs(z - cz) - Math.max(0.01, half - 0.07);
        const dx = Math.max(qx, 0), dz = Math.max(qz, 0);
        distance = Math.min(distance, Math.sqrt(dx * dx + dz * dz) + Math.min(Math.max(qx, qz), 0) - 0.07);
      }
      const index = (row * size + column) * 4;
      data[index] = Math.round(Math.max(0, distance + 0.25) * 255);
      const sparse = Math.max(0, Math.min(1, (Math.sin(x * 2.3 + z * 1.8) + 0.1) / 0.65));
      data[index + 1] = Math.round(sparse * sparse * (3 - 2 * sparse) * 255);
      data[index + 2] = Math.round((distance >= 0 ? Math.exp(-distance * 4) : 0) * 255);
      data[index + 3] = 255;
    }
  }
  const texture = new DataTexture(data, size, size, RGBAFormat);
  texture.minFilter = texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return { texture, origin: new Vector2(left, bottom), span: new Vector2(width, height) };
}
