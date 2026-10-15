import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, ShaderMaterial } from 'three';
import { createShoreField } from './shore';
import type { WaterFootprint } from './shore';

export type { WaterFootprint } from './shore';
const vertexShader = /* glsl */ `
  uniform float time;
  uniform vec3 deepAqua;
  uniform vec3 shallowAqua;
  varying vec2 surface;
  varying vec3 waterColor;
  void main() {
    vec4 p = modelMatrix * vec4(position, 1.0);
    surface = p.xz;
    float broad = sin(p.x * 0.56 + time * 0.035) * cos(p.z * 0.42 - time * 0.025);
    float wash = sin(p.x * 1.1 + p.z * 0.63 + time * 0.06);
    waterColor = mix(deepAqua, shallowAqua, 0.50 + broad * 0.21 + wash * 0.065);
    gl_Position = projectionMatrix * viewMatrix * p;
  }
`;
const fragmentShader = /* glsl */ `
  uniform float drift;
  uniform vec3 shallowAqua;
  uniform sampler2D shoreline;
  uniform vec2 shoreOrigin;
  uniform vec2 shoreSpan;
  varying vec2 surface;
  varying vec3 waterColor;
  void main() {
    vec2 p = surface;
    vec3 color = waterColor;
    vec2 uv = (p - shoreOrigin) / shoreSpan;
    if (uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0) {
      vec3 field = texture2D(shoreline, uv).rgb;
      float edge = field.r - 0.25;
      color = mix(color, shallowAqua, field.b * 0.38);
      float ring = 1.0 - smoothstep(0.014, 0.033, abs(edge - 0.10 - drift));
      float outer = 1.0 - smoothstep(0.010, 0.026, abs(edge - 0.29 + drift));
      color = mix(color, vec3(0.76, 0.97, 0.93), (ring * 0.50 + outer * 0.40) * field.g);
    }
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

export function GameWater({ footprints, reduced }: { footprints: readonly WaterFootprint[]; reduced: boolean }) {
  const material = useRef<ShaderMaterial>(null);
  const field = useMemo(() => createShoreField(footprints), [footprints]);
  useEffect(() => () => field.texture.dispose(), [field]);
  const uniforms = useMemo(() => ({
    time: { value: 0 }, drift: { value: 0 }, deepAqua: { value: new Color('#42cbd4') }, shallowAqua: { value: new Color('#99eae0') },
    shoreline: { value: field.texture }, shoreOrigin: { value: field.origin }, shoreSpan: { value: field.span },
  }), [field]);
  // Advance only on requested gameplay frames. No extra animation loop wakes a
  // resting board, and reduced motion retains a completely static surface.
  useFrame((_, delta) => {
    if (!reduced && material.current) {
      const uniforms = material.current.uniforms;
      uniforms.time.value += Math.min(delta, 0.05);
      uniforms.drift.value = Math.sin(uniforms.time.value * 0.22) * 0.025;
    }
  });
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.43, 0]}>
    <planeGeometry args={[64, 64, 32, 32]} />
    <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} toneMapped={false} />
  </mesh>;
}
