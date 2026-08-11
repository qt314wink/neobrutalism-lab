import { specimenColors } from './tokens';
const allowedOffsets = new Set([2, 4, 6, 8, 10, 12]);
export function normalizeOffset(offset: number): number { return allowedOffsets.has(offset) ? offset : 4; }
export function physicalOffsetStyle(offset: number): { boxShadow: string; '--press-offset': string } {
  const normalized = normalizeOffset(offset);
  return { boxShadow: `${normalized}px ${normalized}px 0 0 ${specimenColors.ink}`, '--press-offset': `${normalized}px` };
}
