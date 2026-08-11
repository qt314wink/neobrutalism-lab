import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { validateGenesisCandidate } from '../src/index.ts';

const request = JSON.parse(readFileSync('packages/genesis/fixtures/request.valid.json', 'utf8'));
const validCandidate = JSON.parse(readFileSync('packages/genesis/fixtures/candidate.valid.json', 'utf8'));
const clone = <T,>(value: T): T => structuredClone(value);

describe('validateGenesisCandidate', () => {
  it('accepts a complete proposal that covers its problem, evidence, constraints, and benchmarks', () => {
    const receipt = validateGenesisCandidate(request, validCandidate);
    expect(receipt.accepted).toBe(true);
    expect(receipt.checks.every((check) => check.status === 'pass')).toBe(true);
  });

  it('rejects target paths that escape allowed write roots', () => {
    const candidate = clone(validCandidate);
    candidate.files[0].path = '../packages/apps/escape.ts';
    const receipt = validateGenesisCandidate(request, candidate);
    expect(receipt.accepted).toBe(false);
    expect(receipt.checks.some((check) => check.id === 'paths' && check.status === 'fail')).toBe(true);
  });

  it('rejects candidates without at least two alternatives', () => {
    const candidate = clone(validCandidate);
    candidate.alternatives = [candidate.alternatives[0]];
    const receipt = validateGenesisCandidate(request, candidate);
    expect(receipt.accepted).toBe(false);
    expect(receipt.checks.some((check) => check.id === 'schema' && check.status === 'fail')).toBe(true);
  });

  it('rejects uncovered constraints and benchmarks', () => {
    const candidate = clone(validCandidate);
    candidate.qaChecks = candidate.qaChecks.slice(0, 1);
    const receipt = validateGenesisCandidate(request, candidate);
    expect(receipt.accepted).toBe(false);
    expect(receipt.checks.some((check) => check.id === 'coverage' && check.status === 'fail')).toBe(true);
  });

  it('rejects undeclared dependencies and unknown observation references', () => {
    const candidate = clone(validCandidate);
    candidate.files[0].dependencies.push('@neobrutalism-lab/apps');
    candidate.decisions[0].observationRefs = ['observation:invented'];
    const receipt = validateGenesisCandidate(request, candidate);
    expect(receipt.accepted).toBe(false);
    expect(receipt.checks.some((check) => check.id === 'dependencies' && check.status === 'fail')).toBe(true);
    expect(receipt.checks.some((check) => check.id === 'evidence' && check.status === 'fail')).toBe(true);
  });

  it('rejects unknown relationship endpoints', () => {
    const candidate = clone(validCandidate);
    candidate.relationships[0].to = 'pattern:unknown';
    const receipt = validateGenesisCandidate(request, candidate);
    expect(receipt.accepted).toBe(false);
    expect(receipt.checks.some((check) => check.id === 'graph' && check.status === 'fail')).toBe(true);
  });

  it('rejects any direct-write mode at schema boundary', () => {
    const candidate = clone(validCandidate);
    candidate.writeMode = 'direct';
    const receipt = validateGenesisCandidate(request, candidate);
    expect(receipt.accepted).toBe(false);
    expect(receipt.checks.some((check) => check.id === 'schema' && check.status === 'fail')).toBe(true);
  });
});
