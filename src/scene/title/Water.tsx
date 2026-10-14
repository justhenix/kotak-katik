import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, ShaderMaterial, Vector4 } from 'three';

export type Footprint = readonly [number, number, number];

const vertexShader = /* glsl */ `
  varying vec2 world;
  void main() {
    vec4 p = modelMatrix * vec4(position, 1.0);
    world = p.xz;
    gl_Position = projectionMatrix * viewMatrix * p;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float time;
  uniform vec3 aqua;
  uniform vec3 lightAqua;
  uniform vec4 islands[13];
  varying vec2 world;
  float shore(vec2 p, vec4 island) {
    vec2 q = abs(p - island.xy) - vec2(island.z - 0.08);
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - 0.08;
  }
  void main() {
    float broad = sin(world.x * 0.38 + time * 0.035) * cos(world.y * 0.31 - time * 0.025);
    float wash = sin(world.x * 0.78 + world.y * 0.4 + time * 0.045);
    vec3 color = mix(aqua, lightAqua, 0.44 + broad * 0.22 + wash * 0.065);
    float distanceToShore = 100.0;
    for (int i = 0; i < 13; i++) {
      distanceToShore = min(distanceToShore, shore(world, islands[i]));
    }
    // The union of footprints keeps foam outside the connected path, not between tiles.
    float halo = exp(-max(distanceToShore, 0.0) * 3.4) * step(0.0, distanceToShore);
    color = mix(color, lightAqua, halo * 0.32);
    float drift = sin(time * 0.24) * 0.035;
    float ring = 1.0 - smoothstep(0.016, 0.039, abs(distanceToShore - 0.13 - drift));
    float outer = 1.0 - smoothstep(0.012, 0.033, abs(distanceToShore - 0.37 + drift));
    float sparse = smoothstep(0.05, 0.50, sin(world.x * 2.0 + world.y * 1.7));
    float foam = ring * sparse * 0.50 + outer * sparse * 0.47;
    color = mix(color, vec3(0.79, 0.97, 0.96), foam);
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

export function Water({ footprints, reduced }: { footprints: Footprint[]; reduced: boolean }) {
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    aqua: { value: new Color('#75d9e3') },
    lightAqua: { value: new Color('#b4efed') },
    islands: { value: Array.from({ length: 13 }, (_, i) => {
      const point = footprints[i] ?? [1000, 1000, 0];
      return new Vector4(point[0], point[1], point[2], 0);
    }) },
  }), [footprints]);
  useFrame((_, delta) => {
    if (!reduced && material.current) material.current.uniforms.time.value += Math.min(delta, 0.05);
  });
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.65, 0]}>
    <planeGeometry args={[200, 200]} />
    <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} toneMapped={false} />
  </mesh>;
}
