import { describe, expect, it } from 'vitest';
import { AnimationClip, Group, NumberKeyframeTrack, Vector3 } from 'three';
import { CatPlayback } from './playback';
import { createInitialState, executeNextAction } from '../../game/interpreter/interpreter';
import { kernelLevel } from '../../game/levels/kernel';
import { turningLevel } from '../../game/levels/mechanics';
import { ORIENTATIONS } from '../../game/engine/simulation';
import { orientationRotation } from '../config';
import type { Orientation } from '../../game/types';

function setup() {
  const model = new Group();
  const body = new Group();
  body.name = 'body';
  model.add(body);
  const clips = Object.entries({ static: 0.1, idle: 1, walk: 0.5, eat: 0.5, dance: 0.5 })
    .map(([name, duration]) => new AnimationClip(name, duration,
      [new NumberKeyframeTrack('body.position[y]', [0, duration / 2, duration], [0, 0.05, 0])]));
  const placement = new Group();
  placement.add(model);
  const playback = new CatPlayback(placement, model, clips);
  const start = createInitialState(kernelLevel);
  playback.sync(start, false);
  const program = [{ type: 'forward' }, { type: 'forward' }] as const;
  const first = executeNextAction(kernelLevel, program, start);
  const completed = executeNextAction(kernelLevel, program, first);
  return { playback, placement, start, first, completed };
}

describe('cat presentation', () => {
  it.each(ORIENTATIONS)('animates either exact quarter-turn from %s without translation', (orientation) => {
    for (const type of ['turn-left', 'turn-right'] as const) {
      const { playback, placement } = setup();
      const level = { ...turningLevel, avatar: { ...turningLevel.avatar, orientation } };
      const start = createInitialState(level);
      playback.sync(start, false);
      const yaw = placement.rotation.y;
      const next = executeNextAction(level, [{ type }], start);
      playback.sync(next, false);
      expect(playback.phase).toBe('turn');
      playback.tick(0.12);
      expect(Math.abs(placement.rotation.y - yaw)).toBeGreaterThan(0);
      expect(Math.abs(placement.rotation.y - yaw)).toBeLessThan(Math.PI / 2);
      playback.tick(0.12);
      expect(placement.rotation.y - yaw).toBeCloseTo(type === 'turn-left' ? Math.PI / 2 : -Math.PI / 2);
      expect(placement.position.x).toBe(level.avatar.position.x);
      expect(placement.position.z).toBe(level.avatar.position.z);
      expect(Math.cos(placement.rotation.y)).toBeCloseTo(Math.cos(orientationRotation[next.avatar.orientation]));
      playback.sync(start, true);
      playback.sync(next, true);
      expect(playback.phase).toBe('static');
      expect(playback.tick(1)).toBe(false);
      expect(placement.rotation.y).toBe(orientationRotation[next.avatar.orientation]);
    }
  });

  it('stopping Run preserves the current animation without replaying the pickup', () => {
    const { playback, completed } = setup();
    const running = { ...completed, status: 'running' as const, completion: false };
    playback.sync(running, false);
    playback.tick(0.24);
    expect(playback.phase).toBe('eat');
    playback.tick(0.2);
    playback.sync({ ...running, status: 'paused' }, false);
    playback.tick(0.3);
    expect(playback.phase).toBe('idle');
  });

  it.each(['turn-left', 'turn-right'] as const)('rapid repeated %s Steps retain their rotation direction', (type) => {
    const { playback, placement } = setup();
    const start = createInitialState(turningLevel);
    const program = [{ type }, { type }] as const;
    playback.sync(start, false);
    const yaw = placement.rotation.y;
    const first = executeNextAction(turningLevel, program, start);
    playback.sync(first, false);
    const second = executeNextAction(turningLevel, program, first);
    playback.sync(second, false);
    playback.tick(0.24);
    expect(placement.rotation.y - yaw).toBeCloseTo(type === 'turn-left' ? Math.PI : -Math.PI);
    expect(placement.position.x).toBe(0);
    expect(placement.position.z).toBe(0);
  });

  it.each([
    ['north', 0, -1], ['east', 1, 0], ['south', 0, 1], ['west', -1, 0],
  ] as const)('faces %s from the model’s −Z forward axis', (orientation: Orientation, x, z) => {
    const { playback, placement, start } = setup();
    playback.sync({ ...start, avatar: { ...start.avatar, orientation } }, false);
    const forward = new Vector3(0, 0, -1).applyEuler(placement.rotation);
    expect(forward.x).toBeCloseTo(x);
    expect(forward.z).toBeCloseTo(z);
  });

  it('sequences walk, eat, dance, then a bounded idle without changing logical state', () => {
    const { playback, placement, completed } = setup();
    const before = structuredClone(completed);
    playback.sync(completed, false);
    expect(playback.phase).toBe('walk');
    playback.tick(0.24);
    expect(placement.position.x).toBe(2);
    expect(playback.phase).toBe('eat');
    playback.tick(0.5);
    expect(playback.phase).toBe('dance');
    playback.tick(0.5);
    expect(playback.phase).toBe('idle');
    expect(playback.tick(1)).toBe(false);
    expect(completed).toEqual(before);
  });

  it('resets immediately during pickup and cancels the queued celebration', () => {
    const { playback, placement, start, completed } = setup();
    playback.sync(completed, false);
    playback.tick(0.3);
    expect(playback.phase).toBe('eat');
    playback.sync(start, false);
    expect(placement.position.x).toBe(0);
    expect(playback.tick(2)).toBe(false);
    expect(playback.phase).toBe('idle');
  });

  it('retargets rapid steps from the current visual position', () => {
    const { playback, placement, first, completed } = setup();
    playback.sync(first, false);
    playback.tick(0.1);
    const interruptedX = placement.position.x;
    playback.sync(completed, false);
    expect(placement.position.x).toBe(interruptedX);
    playback.tick(0.24);
    expect(placement.position.x).toBe(2);
    expect(playback.phase).toBe('eat');
  });

  it('reduced motion snaps to logical state, cancels motion, and needs no idle frames', () => {
    const { playback, placement, completed } = setup();
    playback.sync(completed, false);
    playback.tick(0.1);
    playback.sync(completed, true);
    expect(placement.position.x).toBe(2);
    expect(playback.phase).toBe('static');
    expect(playback.tick(5)).toBe(false);
    playback.sync(completed, false);
    expect(playback.phase).toBe('idle');
  });

  it('collision cancels an interrupted pickup without replaying old events', () => {
    const { playback, placement, completed } = setup();
    playback.sync(completed, false);
    playback.tick(0.3);
    const collision = { position: { x: 3, z: 0 }, reason: 'invalid-tile' } as const;
    playback.sync({ ...completed, status: 'failed', completion: false, collision,
      events: [{ type: 'collision', collision }] }, false);
    playback.tick(2);
    expect(placement.position.x).toBe(2);
    expect(playback.phase).toBe('idle');
  });

  it('rotation takes the short path without translating the cat', () => {
    const { playback, placement, first } = setup();
    playback.sync(first, false);
    playback.tick(2);
    playback.sync({ ...first, avatar: { ...first.avatar, orientation: 'north' } }, false);
    expect(playback.phase).toBe('turn');
    playback.tick(0.24);
    expect(placement.position.x).toBe(1);
    expect(placement.rotation.y).toBeCloseTo(0);
  });

  it('settles after a long frame and can reinitialize after effect cleanup', () => {
    const { playback, placement, start, completed } = setup();
    playback.sync(completed, false);
    expect(playback.tick(5)).toBe(false);
    expect(placement.position.x).toBe(2);
    playback.dispose();
    playback.sync(start, false);
    expect(playback.phase).toBe('idle');
    expect(playback.tick(0.1)).toBe(true);
  });
});
