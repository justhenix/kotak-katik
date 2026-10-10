import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Keep conversion tools outside the game's dependency graph.
const [sourceDirectory, toolDirectory, selectedAsset] = process.argv.slice(2);
if (!sourceDirectory || !toolDirectory) {
  throw new Error('Usage: bun scripts/assets/prepare-models.mjs <sources> <toolchain> [asset]');
}
const requireTool = createRequire(path.join(path.resolve(toolDirectory), 'package.json'));
const loadTool = (name) => import(pathToFileURL(requireTool.resolve(name)).href);
const { NodeIO } = await loadTool('@gltf-transform/core');
const { ALL_EXTENSIONS } = await loadTool('@gltf-transform/extensions');
const { dedup, resample, getBounds } = await loadTool('@gltf-transform/functions');
const validator = await loadTool('gltf-validator');
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const outputDirectory = path.join(project, 'public/assets/models');
await mkdir(outputDirectory, { recursive: true });
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const sha256 = (data) => createHash('sha256').update(data).digest('hex');
function stripPngMetadata(image) {
  const bytes = Buffer.from(image);
  const chunks = [bytes.subarray(0, 8)];
  for (let offset = 8; offset < bytes.length;) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString('ascii', offset + 4, offset + 8);
    if (['IHDR', 'PLTE', 'tRNS', 'IDAT', 'IEND'].includes(type)) {
      chunks.push(bytes.subarray(offset, offset + length + 12));
    }
    offset += length + 12;
  }
  return Buffer.concat(chunks);
}
const picks = [
  {
    name: 'cat', input: 'cube-pets/Models/GLB format/animal-cat.glb', width: 0.9, yaw: Math.PI,
    hash: '1e73aaf7d497dd7d2946badf92d189d2333f163e66dced91feb446bc9bdee850',
  },
  {
    name: 'fish', input: 'poly/BEcU9rjiAq.glb', width: 0.58, yaw: Math.PI / 2,
    hash: '9607de8de8a0ac2d857f271272e70e6d8d3fd19852d979c2cfbe9eafe1e4fcc5',
  },
  {
    name: 'fish-trout', input: 'poly/2W2sKWYvk8k.glb', width: 0.7, yaw: Math.PI / 2,
    hash: '7f0f98a67b31c5ad46b2669c78e3c6288571c7d5776debd67c9cd898e1abd260',
  },
  {
    name: 'tree', input: 'poly/ahBEW2RRgq.glb', width: 1.3, yaw: 0,
    hash: '73da653baf82d3c04c979f37b037415f190813d8d16610bd49fc6a20f649077f',
  },
  {
    name: 'rock', input: 'poly/4MUaQTcDdc.glb', width: 0.7, yaw: 0,
    hash: '306a8e11898caad21aa4da9eb60538ba05e041d9dd3c1a3d5da85b2a6165d8d8',
  },
  {
    name: 'crate', input: 'poly/YAghI6GBls.glb', width: 0.75, yaw: 0,
    hash: 'e0c4c5946b53ba314ec6e22bdb5d3329e4a2f0950b3c477a88e0d456d85baea8',
  },
  {
    name: 'bush', input: 'poly/92EytlU1El.glb', width: 0.65, yaw: 0,
    hash: 'a10307dcb7030d364093fae966f01a3776e3482bf7bb0ab0231b16a3e1b65e27',
  },
];
const reports = [];
if (selectedAsset && !picks.some((pick) => pick.name === selectedAsset)) {
  throw new Error(`Unknown asset: ${selectedAsset}`);
}
const validationPath = path.join(project, 'docs/ASSET_VALIDATION.json');
const previousReport = selectedAsset ? JSON.parse(await readFile(validationPath, 'utf8')) : undefined;
for (const pick of picks.filter((pick) => !selectedAsset || pick.name === selectedAsset)) {
  const inputPath = path.join(sourceDirectory, pick.input);
  const input = await readFile(inputPath);
  if (sha256(input) !== pick.hash) throw new Error(`Source hash mismatch: ${pick.input}`);
  if (pick.name === 'cat') {
    const palette = await readFile(path.join(path.dirname(inputPath), 'Textures/colormap.png'));
    if (sha256(palette) !== '2f6d0032e51c2d49b13b8e689d59eb39aa3ee6c32f2a1851213e11fc7593177d') {
      throw new Error('Cat palette hash mismatch');
    }
  }
  const document = await io.read(inputPath);
  const root = document.getRoot();
  const clipsBefore = root.listAnimations().map((animation) => ({
    name: animation.getName(), channels: animation.listChannels().length,
    duration: Math.max(...animation.listSamplers().map((s) => Math.max(...s.getInput().getArray()))),
  }));
  for (const material of root.listMaterials()) {
    material.setMetallicFactor(0).setRoughnessFactor(1);
  }
  if (pick.name === 'fish-trout') {
    root.getAsset().copyright = 'Trout by Poly by Google, CC BY 3.0. https://poly.pizza/m/2W2sKWYvk8k ; https://creativecommons.org/licenses/by/3.0/ . Modified: normalized wrappers, lossless resource deduplication and PNG metadata removal.';
  }
  for (const texture of root.listTextures()) {
    if (texture.getMimeType() === 'image/png') texture.setImage(stripPngMetadata(texture.getImage()));
  }
  // A separate wrapper preserves animated node transforms and skeletal bindings.
  const scene = root.listScenes()[0];
  // Kenney's scene and animated root share a name; Three.js would bind the scene first.
  scene.setName(`KotakKatik_${pick.name}_scene`);
  const orientation = document.createNode(`${pick.name}-orientation`)
    .setRotation([0, Math.sin(pick.yaw / 2), 0, Math.cos(pick.yaw / 2)]);
  for (const child of scene.listChildren()) orientation.addChild(child);
  scene.addChild(orientation);
  const originalBounds = getBounds(scene);
  const scale = pick.width / Math.max(
    originalBounds.max[0] - originalBounds.min[0],
    originalBounds.max[2] - originalBounds.min[2],
  );
  const wrapper = document.createNode(`KotakKatik_${pick.name}`)
    .setScale([scale, scale, scale])
    .setTranslation([
      -scale * (originalBounds.min[0] + originalBounds.max[0]) / 2,
      -scale * originalBounds.min[1],
      -scale * (originalBounds.min[2] + originalBounds.max[2]) / 2,
    ]);
  wrapper.addChild(orientation);
  scene.addChild(wrapper);
  await document.transform(resample({ tolerance: 0 }), dedup());
  const clipsAfter = root.listAnimations().map((animation) => ({
    name: animation.getName(), channels: animation.listChannels().length,
    duration: Math.max(...animation.listSamplers().map((s) => Math.max(...s.getInput().getArray()))),
  }));
  if (JSON.stringify(clipsBefore) !== JSON.stringify(clipsAfter)) {
    throw new Error(`Animation metadata changed: ${pick.name}`);
  }
  const output = await io.writeBinary(document);
  const validation = await validator.validateBytes(output, { uri: `${pick.name}.glb`, maxIssues: 1000 });
  if (validation.issues.numErrors) {
    throw new Error(`${pick.name}: ${JSON.stringify(validation.issues)}`);
  }
  const jsonLength = new DataView(output.buffer, output.byteOffset).getUint32(12, true);
  const json = JSON.parse(new TextDecoder().decode(output.subarray(20, 20 + jsonLength)));
  if ([...(json.buffers ?? []), ...(json.images ?? [])].some((resource) => resource.uri)) {
    throw new Error(`External resource found: ${pick.name}`);
  }
  let triangles = 0;
  for (const mesh of root.listMeshes()) {
    for (const primitive of mesh.listPrimitives()) {
      triangles += (primitive.getIndices() ?? primitive.getAttribute('POSITION')).getCount() / 3;
    }
  }
  const report = {
    name: pick.name, file: `${pick.name}.glb`, source: pick.input,
    sourceBytes: input.length, sourceSha256: sha256(input), bytes: output.length,
    sha256: sha256(output), bounds: getBounds(scene), scale, yaw: pick.yaw,
    meshes: root.listMeshes().length, triangles,
    materials: root.listMaterials().map((m) => ({ name: m.getName(), metallic: m.getMetallicFactor(), roughness: m.getRoughnessFactor(), alphaMode: m.getAlphaMode() })),
    textures: root.listTextures().map((t) => ({ name: t.getName(), dimensions: t.getSize(), bytes: t.getImage().length, mimeType: t.getMimeType() })),
    skins: root.listSkins().map((s) => ({ name: s.getName(), joints: s.listJoints().length })),
    animations: clipsAfter, validatorVersion: validator.version(), issues: validation.issues,
  };
  await writeFile(path.join(outputDirectory, pick.name + '.glb'), output);
  reports.push(report);
  console.log(`${pick.name}: ${output.length} bytes; ${triangles} triangles; ${validation.issues.numErrors} errors; ${validation.issues.numWarnings} warnings`);
}
const assets = previousReport ? previousReport.assets.map((asset) => reports.find((report) => report.name === asset.name) ?? asset) : reports;
for (const report of reports) {
  if (!assets.some((asset) => asset.name === report.name)) assets.push(report);
}
await writeFile(validationPath, JSON.stringify({
  ...previousReport,
  reviewed: '2026-10-10', toolchain: { gltfTransform: '4.5.1', gltfValidator: validator.version() },
  assets,
}, null, 2) + '\n');
