import { AnimationMixer, Group, LoopOnce, LoopRepeat } from 'three';
import type { AnimationAction, AnimationClip, Object3D } from 'three';
import type { GameState } from '../../game/types';
import { orientationRotation, sceneConfig } from '../config';

export type CatPhase = 'idle' | 'walk' | 'turn' | 'eat' | 'dance' | 'static';
type Reaction = 'eat' | 'dance';

// Presentation only: no command advancement, collection, or completion callbacks.
export class CatPlayback {
  readonly mixer: AnimationMixer;
  phase: CatPhase = 'static';
  private readonly clips = new Map<string, AnimationClip>();
  private action?: AnimationAction;
  private retiring?: AnimationAction;
  private fadeRemaining = 0;
  private elapsed = 0;
  private duration = 0;
  private pending: Reaction[] = [];
  private simulation?: GameState;
  private reduced = false;
  private from = { x: 0, z: 0, yaw: 0 };
  private to = { x: 0, z: 0, yaw: 0 };

  constructor(readonly placement: Group, model: Object3D, clips: readonly AnimationClip[]) {
    this.mixer = new AnimationMixer(model);
    for (const clip of clips) this.clips.set(clip.name, clip);
    for (const name of ['idle', 'walk', 'eat', 'dance', 'static']) {
      if (!this.clips.has(name)) throw new Error(`Cat model is missing ${name}`);
    }
  }

  sync(simulation: GameState, reduced: boolean) {
    if (simulation === this.simulation && reduced === this.reduced) return;
    const sameAction = simulation === this.simulation;
    this.simulation = simulation;
    this.reduced = reduced;
    this.pending = [];
    const yaw = orientationRotation[simulation.avatar.orientation];
    const { x, z } = simulation.avatar.position;
    const reset = simulation.events.length === 0 || simulation.nextCommandIndex === 0;
    if (reset || reduced || sameAction || simulation.status === 'failed') {
      this.placement.position.set(x, 0, z);
      this.placement.rotation.y = yaw;
      this.mixer.stopAllAction();
      this.action = this.retiring = undefined;
      this.fadeRemaining = 0;
      this.play(reduced ? 'static' : 'idle', false);
      return;
    }
    this.from = { x: this.placement.position.x, z: this.placement.position.z, yaw: this.placement.rotation.y };
    const difference = Math.atan2(Math.sin(yaw - this.from.yaw), Math.cos(yaw - this.from.yaw));
    this.to = { x, z, yaw: this.from.yaw + difference };
    if (simulation.events.some((event) => event.type === 'collected')) this.pending.push('eat');
    if (simulation.completion) this.pending.push('dance');
    if (x !== this.from.x || z !== this.from.z) this.play('walk');
    else if (Math.abs(difference) > 0.0001) this.play('turn');
    else this.play(this.pending.shift() ?? 'idle');
  }

  private play(phase: CatPhase, fade = true) {
    const next = this.mixer.clipAction(this.clips.get(phase === 'turn' ? 'idle' : phase)!);
    this.retiring?.stop();
    this.retiring = undefined;
    const previous = this.action;
    this.phase = phase;
    this.elapsed = 0;
    this.duration = phase === 'walk' || phase === 'turn' ? sceneConfig.transitionMs / 1000
      : phase === 'static' ? 0 : next.getClip().duration;
    if (previous !== next) {
      next.reset().setEffectiveWeight(1).setEffectiveTimeScale(1);
      next.setLoop(phase === 'walk' ? LoopRepeat : LoopOnce, phase === 'walk' ? Infinity : 1);
      next.clampWhenFinished = phase !== 'walk';
      if (fade && previous) {
        previous.fadeOut(sceneConfig.animationFadeSeconds);
        next.fadeIn(sceneConfig.animationFadeSeconds);
        this.retiring = previous;
        this.fadeRemaining = sceneConfig.animationFadeSeconds;
      } else previous?.stop();
      next.play();
      this.action = next;
    } else {
      next.stopFading().reset().play();
    }
    if (phase === 'static') this.mixer.update(0);
    this.placement.userData.animation = phase;
  }

  tick(delta: number): boolean {
    if (this.reduced || this.duration === 0) return false;
    let remaining = delta;
    do {
      const segment = Math.min(remaining, Math.max(0, this.duration - this.elapsed));
      this.elapsed += segment;
      this.mixer.update(segment);
      if (this.retiring && (this.fadeRemaining -= segment) <= 0) {
        this.retiring.stop();
        this.retiring = undefined;
      }
      if (this.phase === 'walk' || this.phase === 'turn') {
        const t = Math.min(1, this.elapsed / this.duration);
        const ease = 1 - (1 - t) ** 3;
        this.placement.position.x = this.from.x + (this.to.x - this.from.x) * ease;
        this.placement.position.z = this.from.z + (this.to.z - this.from.z) * ease;
        this.placement.rotation.y = this.from.yaw + (this.to.yaw - this.from.yaw) * ease;
      }
      remaining -= segment;
      if (this.elapsed < this.duration) break;
      if (this.phase === 'idle') {
        this.duration = 0;
        break;
      }
      this.play(this.pending.shift() ?? 'idle');
    } while (remaining > 0);
    return this.duration > 0;
  }

  dispose() {
    this.mixer.stopAllAction();
    this.mixer.uncacheRoot(this.mixer.getRoot());
    this.simulation = undefined;
    this.action = this.retiring = undefined;
    this.duration = 0;
  }
}
