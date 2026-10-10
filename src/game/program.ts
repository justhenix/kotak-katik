import type { LevelDefinition, Program } from './types';

export function programError(level: LevelDefinition, program: Program, allowEmptyBodies = false): string | null {
  if (level.maxProgramSlots !== undefined && program.length > level.maxProgramSlots) return 'Urutan penuh.';
  for (const command of program) {
    if (!level.allowedCommands.includes(command.type)) return 'Perintah belum tersedia.';
    if (command.type === 'repeat') {
      if (![2, 3, 4].includes(command.count)) return 'Pilih 2×, 3×, atau 4×.';
      if (!allowEmptyBodies && command.commands.length === 0) return 'Isi perintah di dalam Ulangi.';
      if (level.maxLoopBodySlots !== undefined && command.commands.length > level.maxLoopBodySlots) return 'Ulangi penuh.';
      if (command.commands.some((child) =>
        !['forward', 'turn-left', 'turn-right'].includes(child.type) || !level.allowedCommands.includes(child.type))) {
        return 'Ulangi hanya berisi Maju, Kiri, atau Kanan.';
      }
    }
  }
  return null;
}
