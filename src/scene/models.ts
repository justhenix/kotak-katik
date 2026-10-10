import { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { Mesh } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone } from 'three/addons/utils/SkeletonUtils.js';

export const modelPaths = {
  cat: '/assets/models/cat.glb', fish: '/assets/models/fish.glb',
  fishTrout: '/assets/models/fish-trout.glb',
  tree: '/assets/models/tree.glb', rock: '/assets/models/rock.glb',
  crate: '/assets/models/crate.glb', bush: '/assets/models/bush.glb',
} as const;

export function useModel(name: keyof typeof modelPaths) {
  const asset = useLoader(GLTFLoader, modelPaths[name]);
  const scene = useMemo(() => {
    // Instance transforms and bones are private; cached geometry/materials stay shared.
    const instance = clone(asset.scene);
    instance.traverse((object) => { if (object instanceof Mesh) object.castShadow = true; });
    return instance;
  }, [asset]);
  return { scene, animations: asset.animations };
}
