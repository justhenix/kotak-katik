import { Check, Lock, Play } from 'lucide-react';
import { curriculumLevels } from '../../game/levels/curriculum';
import { nodeState, useProgressStore } from '../../stores/progress-store';

const labels = { locked: 'Terkunci', available: 'Bisa dimainkan', current: 'Lanjut di sini', completed: 'Selesai' };
const phases = { demonstration: 'Lihat contoh', guided: 'Coba bersama', independent: 'Coba sendiri' };

export function Expedition({ onSelect }: { onSelect: (id: string) => void }) {
  const progress = useProgressStore(state => state);
  return <ol className="expedition-route" aria-label="16 tahap belajar">
    {curriculumLevels.map((level, index) => {
      const state = nodeState(progress, level.id);
      return <li key={level.id}>
        <button className={`stage-node ${state}`} data-level-id={level.id} data-node-state={state}
          aria-current={progress.currentLevelId === level.id ? 'step' : undefined}
          disabled={state === 'locked'} onClick={() => onSelect(level.id)}>
          <span className="stage-number" aria-hidden="true">{index + 1}</span>
          <span className="stage-description"><strong>{level.title}</strong><span>{phases[level.learning.phase]}</span></span>
          <span className="stage-state">{state === 'completed' ? <Check aria-hidden="true" />
            : state === 'locked' ? <Lock aria-hidden="true" /> : <Play aria-hidden="true" />}{labels[state]}</span>
        </button>
      </li>;
    })}
  </ol>;
}
