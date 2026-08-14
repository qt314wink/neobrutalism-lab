import { createHash } from 'node:crypto';
import type { GenesisCandidate } from './schema';

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(record)
        .sort()
        .map((key) => [key, canonicalize(record[key])]),
    );
  }
  return value;
}

export function candidateDigest(candidate: GenesisCandidate): string {
  const canonical = JSON.stringify(canonicalize(candidate));
  return `sha256:${createHash('sha256').update(canonical).digest('hex')}`;
}
